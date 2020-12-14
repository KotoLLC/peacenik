package common

import (
	"fmt"
	"time"

	"github.com/ansel1/merry"
	"github.com/xhit/go-simple-mail/v2"
)

type SMTPConfig struct {
	Host     string `yaml:"host" env:"KOTO_SMTP_HOST"`
	Port     int    `yaml:"port" default:"587" env:"KOTO_SMTP_PORT"`
	User     string `yaml:"user" env:"KOTO_SMTP_USER"`
	Password string `yaml:"password"  env:"KOTO_SMTP_PASSWORD"`
	From     string `yaml:"from"  env:"KOTO_SMTP_FROM"`
}

type MailSender struct {
	cfg SMTPConfig
}

type MailAttachment struct {
	Inline   bool
	Data     []byte
	FileName string
	MIMEType string
}

func (ma MailAttachment) InlineHTML() string {
	return fmt.Sprintf(`<img src="cid:%s" alt="%s" />`, ma.FileName, ma.FileName)
}

type MailAttachmentList map[string]MailAttachment

func (ma MailAttachmentList) InlineHTML(key string) string {
	if a, ok := ma[key]; ok {
		return a.InlineHTML()
	}
	return ""
}

func NewMailSender(cfg SMTPConfig) *MailSender {
	return &MailSender{
		cfg: cfg,
	}
}

func (m *MailSender) connect() (*mail.SMTPClient, error) {
	server := mail.NewSMTPClient()

	server.Host = m.cfg.Host
	server.Port = m.cfg.Port
	server.Username = m.cfg.User
	server.Password = m.cfg.Password
	server.Encryption = mail.EncryptionTLS
	server.Authentication = mail.AuthPlain

	server.KeepAlive = false
	server.ConnectTimeout = 30 * time.Second
	server.SendTimeout = 30 * time.Second

	smtpClient, err := server.Connect()
	if err != nil {
		return nil, merry.Wrap(err)
	}
	return smtpClient, nil
}

func (m *MailSender) Enabled() bool {
	return m != nil && m.cfg.Host != ""
}

func (m *MailSender) SendTextEmail(recipients []string, subject string, message string) error {
	return m.sendEmail(recipients, subject, false, message, nil)
}

func (m *MailSender) SendHTMLEmail(recipients []string, subject string, message string, attachments MailAttachmentList) error {
	return m.sendEmail(recipients, subject, true, message, attachments)
}

func (m *MailSender) sendEmail(recipients []string, subject string, isHTML bool, message string, attachments MailAttachmentList) error {
	from := m.cfg.From
	if from == "" {
		from = m.cfg.User
	}

	msg := mail.NewMSG()
	msg.SetFrom(from).AddTo(recipients...).SetSubject(subject)

	if isHTML {
		msg.SetBody(mail.TextHTML, message)
		for _, attachment := range attachments {
			if attachment.Inline {
				msg.AddInlineData(attachment.Data, attachment.FileName, attachment.MIMEType)
			} else {
				msg.AddAttachmentData(attachment.Data, attachment.FileName, attachment.MIMEType)
			}
		}
	} else {
		msg.SetBody(mail.TextPlain, message)
	}

	client, err := m.connect()
	if err != nil {
		return merry.Wrap(err)
	}

	err = msg.Send(client)
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}
