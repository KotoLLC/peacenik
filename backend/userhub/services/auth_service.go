package services

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/ansel1/merry"
	"github.com/gofrs/uuid"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
)

const (
	confirmFrontendPath = "/confirm-user?token=%s"
	confirmEmailSubject = "Please confirm your KOTO account"
	confirmEmailBody    = `Hi there!<p>Thanks for registering.</p>Please click the link below to confirm your account:</p>
<p><a href="%s" target="_blank">Click here</a>.</p><p>Thanks!</p>`

	resetPasswordSubject      = "KOTO password reset"
	resetPasswordFrontendPath = "/reset-password?name=%s&email=%s&token=%s"
	resetPasswordEmailBody    = `<p>To reset password, click on the link below:</p>
<p><a href="%s" target="_blank">Click here</a>.</p><p>Thanks!</p>`

	SessionDefaultMaxAge = time.Hour * 24 * 365 * 10
)

var (
	userNameRe = regexp.MustCompile(`^\w(\w|-|_|\.)+\w$`)
)

type PasswordHash interface {
	GenerateHash(password string) (string, error)
	CompareHashAndPassword(hash, password string) bool
}

type authService struct {
	*BaseService
	sessionUserKey  string
	passwordHash    PasswordHash
	testMode        bool
	adminList       []string
	adminFriendship string
}

func NewAuth(base *BaseService, sessionUserKey string, passwordHash PasswordHash, testMode bool,
	adminList []string, adminFriendship string) rpc.AuthService {
	return &authService{
		BaseService:     base,
		sessionUserKey:  sessionUserKey,
		passwordHash:    passwordHash,
		testMode:        testMode,
		adminList:       adminList,
		adminFriendship: strings.ToLower(adminFriendship),
	}
}

func (s *authService) Register(_ context.Context, r *rpc.AuthRegisterRequest) (*rpc.Empty, error) {
	if r.Name == "" {
		return nil, twirp.InvalidArgumentError("username", "shouldn't be empty")
	}
	if r.Email == "" {
		return nil, twirp.InvalidArgumentError("email", "shouldn't be empty")
	}
	if r.Password == "" {
		return nil, twirp.InvalidArgumentError("password", "shouldn't be empty")
	}
	r.Name = strings.TrimSpace(r.Name)
	if !userNameRe.MatchString(r.Name) {
		return nil, twirp.InvalidArgumentError("username", "is invalid")
	}

	user, err := s.repos.User.FindUserByName(r.Name)
	if err != nil {
		return nil, err
	}
	if user != nil {
		return nil, twirp.NewError(twirp.AlreadyExists, "user already exists")
	}

	userID, err := uuid.NewV4()
	if err != nil {
		return nil, merry.Wrap(err)
	}

	passwordHash, err := s.passwordHash.GenerateHash(r.Password)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.repos.User.AddUser(userID.String(), r.Name, r.Email, passwordHash)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	user, err = s.repos.User.FindUserByID(userID.String())
	if err != nil {
		return nil, merry.Wrap(err)
	}
	if user == nil {
		return nil, twirp.NotFoundError("user not found")
	}
	if r.InviteToken == "" {
		err := s.sendConfirmLink(*user)
		if err != nil {
			log.Printf("can't send email to %s: %s\n", user.Email, err)
		}
	} else {
		err := s.confirmInviteToken(*user, r.InviteToken)
		if err != nil {
			log.Printf("can't confirm invite token for %s: %s\n", user.Email, err)
		}
	}
	return &rpc.Empty{}, nil
}

func (s *authService) Login(ctx context.Context, r *rpc.AuthLoginRequest) (*rpc.Empty, error) {
	user, err := s.repos.User.FindUserByName(r.Name)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, twirp.NewError(twirp.InvalidArgument, "invalid username or password")
	}

	if !s.passwordHash.CompareHashAndPassword(user.PasswordHash, r.Password) {
		return nil, twirp.NewError(twirp.InvalidArgument, "invalid username or password")
	}

	sessionSaveOptions := SessionSaveOptions{}
	if r.RememberMe {
		sessionSaveOptions.MaxAge = SessionDefaultMaxAge
	}
	session := s.getAuthSession(ctx)
	session.SetValue(s.sessionUserKey, user.ID)
	err = session.Save(sessionSaveOptions)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) Logout(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	session := s.getAuthSession(ctx)
	session.Clear()
	err := session.Save(SessionSaveOptions{MaxAge: -1})
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) getAuthSession(ctx context.Context) Session {
	session, _ := ctx.Value(ContextSession).(Session)
	return session
}

func (s *authService) Confirm(ctx context.Context, r *rpc.AuthConfirmRequest) (*rpc.Empty, error) {
	if s.testMode {
		if s.isAdmin(ctx) {
			user, err := s.repos.User.FindUserByIDOrName(r.Token)
			if err != nil {
				return nil, err
			}
			if user != nil {
				err = s.repos.User.ConfirmUser(user.ID)
				if err != nil {
					return nil, err
				}
				return &rpc.Empty{}, nil
			}
		}
	}

	err := s.confirmUser(r.Token)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) SendConfirmLink(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	if !s.hasUser(ctx) {
		return nil, twirp.NewError(twirp.Unauthenticated, "")
	}
	user := s.getUser(ctx)
	err := s.sendConfirmLink(user)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) SendResetPasswordLink(_ context.Context, r *rpc.AuthSendResetPasswordLinkRequest) (*rpc.Empty, error) {
	user, err := s.repos.User.FindUserByName(r.Name)
	if err != nil {
		return nil, err
	}
	if user == nil || user.Email != r.Email {
		return nil, twirp.NotFoundError("user not found")
	}

	resetToken, err := s.tokenGenerator.Generate(r.Name, r.Name, "user-password-reset",
		time.Now().Add(time.Hour*24),
		map[string]interface{}{
			"email": r.Email,
		})
	if err != nil {
		return nil, err
	}

	link := fmt.Sprintf("%s"+resetPasswordFrontendPath, s.frontendAddress, url.QueryEscape(r.Name), url.QueryEscape(r.Email), resetToken)
	err = s.mailSender.SendHTMLEmail([]string{r.Email}, resetPasswordSubject, fmt.Sprintf(resetPasswordEmailBody, link))
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) ResetPassword(_ context.Context, r *rpc.AuthResetPasswordRequest) (*rpc.Empty, error) {
	if r.NewPassword == "" {
		return nil, twirp.InvalidArgumentError("new password", "is empty")
	}

	_, claims, err := s.tokenParser.Parse(r.ResetToken, "user-password-reset")
	if err != nil {
		return nil, err
	}
	var userName string
	var ok bool
	if userName, ok = claims["name"].(string); !ok {
		return nil, token.ErrInvalidToken.Here()
	}

	user, err := s.repos.User.FindUserByName(userName)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, twirp.NotFoundError("user not found")
	}

	passwordHash, err := s.passwordHash.GenerateHash(r.NewPassword)
	if err != nil {
		return nil, err
	}

	err = s.repos.User.SetPassword(user.ID, passwordHash)
	if err != nil {
		return nil, err
	}

	return &rpc.Empty{}, nil
}

func (s *authService) sendConfirmLink(user repo.User) error {
	if user.ConfirmedAt.Valid {
		return nil
	}
	if !s.mailSender.Enabled() {
		return nil
	}

	confirmToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "user-confirm",
		time.Now().Add(time.Hour*24*30*12),
		map[string]interface{}{
			"email": user.Email,
		})
	if err != nil {
		return merry.Wrap(err)
	}

	link := fmt.Sprintf("%s"+confirmFrontendPath, s.frontendAddress, confirmToken)
	return s.mailSender.SendHTMLEmail([]string{user.Email}, confirmEmailSubject, fmt.Sprintf(confirmEmailBody, link))
}

func (s *authService) confirmUser(confirmToken string) error {
	_, claims, err := s.tokenParser.Parse(confirmToken, "user-confirm")
	if err != nil {
		return merry.Wrap(err)
	}
	var userID string
	var ok bool
	if userID, ok = claims["id"].(string); !ok {
		return token.ErrInvalidToken.Here()
	}

	err = s.repos.User.ConfirmUser(userID)
	if err != nil {
		return merry.Wrap(err)
	}

	if s.adminFriendship == "" || len(s.adminList) == 0 {
		return nil
	}

	user, err := s.repos.User.FindUserByID(userID)
	if err != nil {
		return merry.Wrap(err)
	}

	admin, err := s.repos.User.FindUserByName(s.adminList[0])
	if err != nil {
		return merry.Wrap(err)
	}
	if admin == nil {
		return nil
	}

	switch s.adminFriendship {
	case "invite":
		err = s.repos.Invite.AddInvite(user.ID, admin.ID)
		if err != nil {
			return merry.Wrap(err)
		}
		s.notificationSender.SendNotification([]string{admin.ID}, user.Name+" invited you to be friends", "invite/add", map[string]interface{}{
			"user_id": user.ID,
		})
		err = s.sendInviteLinkToRegisteredUser(*user, admin.Email)
		if err != nil {
			log.Println("can't invite by email:", err)
		}
	case "accept":
		err = s.repos.Invite.AddInvite(userID, admin.ID)
		if err != nil {
			return merry.Wrap(err)
		}
		err = s.repos.Invite.AcceptInvite(userID, admin.ID, true)
		if err != nil {
			return merry.Wrap(err)
		}
		s.notificationSender.SendNotification([]string{admin.ID}, user.Name+" is registered and added to your friends!", "invite/accept", map[string]interface{}{
			"user_id": user.ID,
		})
	}
	return nil
}

func (s *authService) confirmInviteToken(user repo.User, confirmToken string) error {
	_, claims, err := s.tokenParser.Parse(confirmToken, "user-invite")
	if err != nil {
		return merry.Wrap(err)
	}
	var userEmail string
	var ok bool
	if userEmail, ok = claims["email"].(string); !ok || user.Email != userEmail {
		return token.ErrInvalidToken.Here()
	}

	return s.repos.User.ConfirmUser(user.ID)
}

func (s *authService) sendInviteLinkToRegisteredUser(inviter repo.User, userEmail string) error {
	if !s.mailSender.Enabled() {
		return nil
	}

	link := fmt.Sprintf("%s"+invitationsFrontendPath, s.frontendAddress)
	return s.mailSender.SendHTMLEmail([]string{userEmail}, inviter.Name+" invited you to be friends on KOTO", fmt.Sprintf(inviteRegisteredUserEmailBody, link))
}
