package user

import (
	"fmt"
	"net/url"
	"time"

	"github.com/ansel1/merry"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/repo"
)

const (
	confirmFrontendPath = "/confirm-user?token=%s"
	confirmEmailSubject = "Please confirm your KOTO account"
	confirmEmailBody    = `Hi there!<p>Thanks for registering.</p>Please click the link below to confirm your account:</p>
<p><a href="%s" target="_blank">Click here</a>.</p><p>Thanks!</p>`

	registerFrontendPath            = "/registration?email=%s&invite=%s"
	inviteUnregisteredUserEmailBody = `<p>To accept the invitation, click on the link below, register, and visit the friends page:</p>
<p><a href="%s" target="_blank">Click here</a>.</p><p>Thanks!</p>`

	invitationsFrontendPath       = "/friends/invitations"
	inviteRegisteredUserEmailBody = `<p>To accept the invitation, click on the link below, log in, and visit the friends page:</p>
<p><a href="%s" target="_blank">Click here</a>.</p><p>Thanks!</p>`
)

type Confirmation struct {
	frontendAddress string
	mailSender      *common.MailSender
	tokenGenerator  token.Generator
	tokenParser     token.Parser
	userRepo        repo.UserRepo
}

func NewConfirmation(frontendAddress string, mailSender *common.MailSender, tokenGenerator token.Generator, tokenParser token.Parser, userRepo repo.UserRepo) *Confirmation {
	return &Confirmation{
		frontendAddress: frontendAddress,
		mailSender:      mailSender,
		tokenGenerator:  tokenGenerator,
		tokenParser:     tokenParser,
		userRepo:        userRepo,
	}
}

func (c *Confirmation) SendConfirmLink(user repo.User) error {
	if user.ConfirmedAt.Valid {
		return nil
	}
	if !c.mailSender.Enabled() {
		return nil
	}

	confirmToken, err := c.tokenGenerator.Generate(user.ID, user.Name, "user-confirm",
		time.Now().Add(time.Hour*24*30*12),
		map[string]interface{}{
			"email": user.Email,
		})
	if err != nil {
		return merry.Wrap(err)
	}

	link := fmt.Sprintf("%s"+confirmFrontendPath, c.frontendAddress, confirmToken)
	return c.mailSender.SendHTMLEmail([]string{user.Email}, confirmEmailSubject, fmt.Sprintf(confirmEmailBody, link))
}

func (c *Confirmation) SendInviteLinkToUnregisteredUser(inviter repo.User, userEmail string) error {
	if !c.mailSender.Enabled() {
		return nil
	}

	inviteToken, err := c.tokenGenerator.Generate(inviter.ID, inviter.Name, "user-invite",
		time.Now().Add(time.Hour*24*30*12),
		map[string]interface{}{
			"email": userEmail,
		})
	if err != nil {
		return merry.Wrap(err)
	}

	link := fmt.Sprintf("%s"+registerFrontendPath, c.frontendAddress, url.QueryEscape(userEmail), inviteToken)
	return c.mailSender.SendHTMLEmail([]string{userEmail}, inviter.Name+" invited you to be friends on KOTO", fmt.Sprintf(inviteUnregisteredUserEmailBody, link))
}

func (c *Confirmation) SendInviteLinkToRegisteredUser(inviter repo.User, userEmail string) error {
	if !c.mailSender.Enabled() {
		return nil
	}

	link := fmt.Sprintf("%s"+invitationsFrontendPath, c.frontendAddress)
	return c.mailSender.SendHTMLEmail([]string{userEmail}, inviter.Name+" invited you to be friends on KOTO", fmt.Sprintf(inviteRegisteredUserEmailBody, link))
}

func (c *Confirmation) Confirm(confirmToken string) error {
	_, claims, err := c.tokenParser.Parse(confirmToken, "user-confirm")
	if err != nil {
		return merry.Wrap(err)
	}
	var userID string
	var ok bool
	if userID, ok = claims["id"].(string); !ok {
		return token.ErrInvalidToken.Here()
	}

	return c.userRepo.ConfirmUser(userID)
}

func (c *Confirmation) ConfirmInviteToken(user repo.User, confirmToken string) error {
	_, claims, err := c.tokenParser.Parse(confirmToken, "user-invite")
	if err != nil {
		return merry.Wrap(err)
	}
	var userEmail string
	var ok bool
	if userEmail, ok = claims["email"].(string); !ok || user.Email != userEmail {
		return token.ErrInvalidToken.Here()
	}

	return c.userRepo.ConfirmUser(user.ID)
}
