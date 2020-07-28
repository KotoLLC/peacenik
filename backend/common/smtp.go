package common

import (
	"net/smtp"
	"strconv"
	"strings"
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

func NewMailSender(cfg SMTPConfig) *MailSender {
	return &MailSender{
		cfg: cfg,
	}
}

func (m *MailSender) Enabled() bool {
	return m.cfg.Host != ""
}

func (m *MailSender) SendTextEmail(recipients []string, subject string, message string) error {
	return m.sendEmail(recipients, subject, false, message)
}

func (m *MailSender) SendHTMLEmail(recipients []string, subject string, message string) error {
	return m.sendEmail(recipients, subject, true, message)
}

func (m *MailSender) sendEmail(recipients []string, subject string, isHTML bool, message string) error {
	from := m.cfg.From
	if from == "" {
		from = m.cfg.User
	}

	var msg strings.Builder
	msg.WriteString("From: ")
	msg.WriteString(from)
	msg.WriteRune('\n')
	msg.WriteString("To: ")
	msg.WriteString(strings.Join(recipients, ","))
	msg.WriteRune('\n')
	msg.WriteString("Subject: ")
	msg.WriteString(subject)
	msg.WriteRune('\n')

	if isHTML {
		msg.WriteString("MIME-version: 1.0;")
		msg.WriteRune('\n')
		msg.WriteString(`Content-Type: text/html; charset="UTF-8";`)
		msg.WriteRune('\n')
	}

	msg.WriteRune('\n')
	msg.WriteString(message)

	return smtp.SendMail(m.cfg.Host+":"+strconv.Itoa(m.cfg.Port),
		smtp.PlainAuth("", m.cfg.User, m.cfg.Password, m.cfg.Host), m.cfg.User, recipients, []byte(msg.String()))
}
