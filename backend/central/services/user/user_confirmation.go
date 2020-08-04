package user

import (
	"fmt"
	"html"
	"time"

	"github.com/ansel1/merry"

	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
)

const (
	frontendPath = "/confirm-user?token=%s"
	emailSubject = "Please validate your KOTO account"
	emailBody    = `<p>To complete your account sign-up, please click on the link below to confirm your email:</p>
<p><a href="%s" target="_blank">%s</a></p>`
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

	link := fmt.Sprintf("%s"+frontendPath, c.frontendAddress, confirmToken)
	return c.mailSender.SendHTMLEmail([]string{user.Email}, emailSubject, fmt.Sprintf(emailBody, link, html.EscapeString(link)))
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
