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
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
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
	sessionUserKey             string
	sessionUserPasswordHashKey string
	passwordHash               PasswordHash
	testMode                   bool
	adminList                  []string
	adminFriendship            string
}

func NewAuth(base *BaseService, sessionUserKey, sessionUserPasswordHashKey string, passwordHash PasswordHash,
	testMode bool, adminList []string, adminFriendship string) rpc.AuthService {
	return &authService{
		BaseService:                base,
		sessionUserKey:             sessionUserKey,
		sessionUserPasswordHashKey: sessionUserPasswordHashKey,
		passwordHash:               passwordHash,
		testMode:                   testMode,
		adminList:                  adminList,
		adminFriendship:            strings.ToLower(adminFriendship),
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

	r.FullName = strings.Join(strings.Fields(r.FullName), " ")

	user := s.repos.User.FindUserByName(r.Name)
	if user != nil {
		return nil, twirp.NewError(twirp.AlreadyExists, "user already exists")
	}

	userID := common.GenerateUUID()
	passwordHash, err := s.passwordHash.GenerateHash(r.Password)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	s.repos.User.AddUser(userID, r.Name, r.Email, r.FullName, passwordHash, r.HideIdentity)

	user = s.repos.User.FindUserByID(userID)
	if user == nil {
		return nil, twirp.NotFoundError("user not found")
	}

	switch {
	case s.cfg.IsAdmin(r.Name) || s.cfg.IsAdmin(r.Email):
		s.repos.User.ConfirmUser(user.ID)
	case r.InviteToken == "":
		err := s.sendConfirmLink(*user)
		if err != nil {
			log.Printf("can't send email to %s: %s\n", r.Email, err)
		}
	default:
		err := s.confirmInviteToken(*user, r.InviteToken)
		if err != nil {
			log.Printf("can't confirm invite token for %s: %s\n", r.Email, err)
		}
	}
	return &rpc.Empty{}, nil
}

func (s *authService) Login(ctx context.Context, r *rpc.AuthLoginRequest) (*rpc.Empty, error) {
	user := s.repos.User.FindUserByName(r.Name)
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
	session.SetValue(s.sessionUserPasswordHashKey, user.PasswordHash[len(user.PasswordHash)-len(user.PasswordHash)/3:])
	err := session.Save(sessionSaveOptions)
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
			user := s.repos.User.FindUserByIDOrName(r.Token)
			if user != nil {
				s.repos.User.ConfirmUser(user.ID)
				return &rpc.Empty{}, nil
			}
		}
	}

	err := s.confirmUser(ctx, r.Token)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) SendConfirmLink(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	if !s.hasMe(ctx) {
		return nil, twirp.NewError(twirp.Unauthenticated, "")
	}
	me := s.getMe(ctx)
	err := s.sendConfirmLink(me)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) SendResetPasswordLink(_ context.Context, r *rpc.AuthSendResetPasswordLinkRequest) (*rpc.Empty, error) {
	user := s.repos.User.FindUserByName(r.Name)
	if user == nil {
		return nil, twirp.NotFoundError("user not found")
	}
	userInfo := s.userCache.UserFullAccess(user.ID)
	if userInfo.Email != r.Email {
		return nil, twirp.NotFoundError("user not found")
	}

	resetToken, err := s.tokenGenerator.Generate(r.Name, "user-password-reset",
		time.Now().Add(time.Minute*10),
		map[string]interface{}{
			"email": r.Email,
		})
	if err != nil {
		return nil, err
	}

	link := fmt.Sprintf("%s"+resetPasswordFrontendPath, s.cfg.FrontendAddress, url.QueryEscape(r.Name), url.QueryEscape(r.Email), resetToken)
	err = s.mailSender.SendHTMLEmail([]string{r.Email}, resetPasswordSubject, fmt.Sprintf(resetPasswordEmailBody, link), nil)
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

	user := s.repos.User.FindUserByName(userName)
	if user == nil {
		return nil, twirp.NotFoundError("user not found")
	}

	passwordHash, err := s.passwordHash.GenerateHash(r.NewPassword)
	if err != nil {
		return nil, err
	}

	s.repos.User.SetPassword(user.ID, passwordHash)

	return &rpc.Empty{}, nil
}

func (s *authService) sendConfirmLink(user repo.User) error {
	if user.ConfirmedAt.Valid {
		return nil
	}
	if !s.mailSender.Enabled() {
		return nil
	}

	userInfo := s.userCache.UserFullAccess(user.ID)
	confirmToken, err := s.tokenGenerator.Generate(user.ID, "user-confirm",
		time.Now().Add(time.Hour*24*30*12),
		map[string]interface{}{
			"email": userInfo.Email,
		})
	if err != nil {
		return merry.Wrap(err)
	}

	link := fmt.Sprintf("%s"+confirmFrontendPath, s.cfg.FrontendAddress, confirmToken)
	return s.mailSender.SendHTMLEmail([]string{userInfo.Email}, confirmEmailSubject, fmt.Sprintf(confirmEmailBody, link), nil)
}

func (s *authService) confirmUser(ctx context.Context, confirmToken string) error {
	_, claims, err := s.tokenParser.Parse(confirmToken, "user-confirm")
	if err != nil {
		return merry.Wrap(err)
	}
	var userID string
	var ok bool
	if userID, ok = claims["id"].(string); !ok {
		return token.ErrInvalidToken.Here()
	}

	ok = s.repos.User.ConfirmUser(userID)
	if !ok {
		return nil
	}

	if s.adminFriendship == "" || len(s.adminList) == 0 {
		return nil
	}

	user := s.repos.User.FindUserByID(userID)
	admin := s.repos.User.FindUserByName(s.adminList[0])
	if admin == nil {
		return nil
	}

	userInfo := s.userCache.UserFullAccess(user.ID)
	adminInfo := s.userCache.UserFullAccess(admin.ID)
	switch s.adminFriendship {
	case "invite":
		s.repos.Invite.AddInvite(user.ID, admin.ID)
		s.notificationSender.SendNotification([]string{admin.ID}, userInfo.DisplayName+" invited you to be friends", "friend-invite/add", map[string]interface{}{
			"user_id": user.ID,
		})
		err = s.sendInviteLinkToRegisteredUser(ctx, *user, adminInfo.Email)
		if err != nil {
			log.Println("can't invite by email:", err)
		}
	case "accept":
		s.repos.Invite.AddInvite(userID, admin.ID)
		if !s.repos.Invite.AcceptInvite(userID, admin.ID, true) {
			return twirp.NotFoundError("invite not found")
		}
		s.notificationSender.SendNotification([]string{admin.ID}, userInfo.DisplayName+" is registered and added to your friends!", "friend-invite/accept", map[string]interface{}{
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
	userInfo := s.userCache.UserFullAccess(user.ID)
	var userEmail string
	var ok bool
	if userEmail, ok = claims["email"].(string); !ok || userInfo.Email != userEmail {
		return token.ErrInvalidToken.Here()
	}

	s.repos.User.ConfirmUser(user.ID)
	return nil
}

func (s *authService) sendInviteLinkToRegisteredUser(ctx context.Context, inviter repo.User, userEmail string) error {
	if !s.mailSender.Enabled() {
		return nil
	}

	attachments := s.GetUserAttachments(ctx, inviter)

	inviterInfo := s.userCache.UserFullAccess(inviter.ID)
	link := fmt.Sprintf("%s"+invitationsFrontendPath, s.cfg.FrontendAddress)
	return s.mailSender.SendHTMLEmail([]string{userEmail}, inviterInfo.DisplayName+" invited you to be friends on KOTO",
		fmt.Sprintf(inviteRegisteredUserEmailBody, attachments.InlineHTML("avatar"), link),
		attachments)
}

func (s *authService) RecallNames(_ context.Context, r *rpc.AuthRecallNamesRequest) (*rpc.Empty, error) {
	if !s.mailSender.Enabled() {
		return &rpc.Empty{}, nil
	}

	users := s.repos.User.FindUsersByEmail(r.Email)
	if len(users) == 0 {
		return &rpc.Empty{}, nil
	}

	userNames := make([]string, len(users))
	for i, user := range users {
		userInfo := s.userCache.UserFullAccess(user.ID)
		userNames[i] = userInfo.DisplayName
	}

	var message string
	switch len(userNames) {
	case 0:
		message = "Your email is not associated with username"
	case 1:
		message = "Your email is associated with one username: " + userNames[0]
	default:
		message = "Your email is associated with more than one username:\n" + strings.Join(userNames, "\n")
	}

	err := s.mailSender.SendTextEmail([]string{r.Email}, "Koto username reminder", message)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}
