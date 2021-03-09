package common

import (
	"errors"
	"strconv"

	"github.com/AlecAivazis/survey/v2"
)

type PostgresConfiguration struct {
	InsideDocker bool
	Host         string
	Port         int
	DBName       string
	User         string
	Password     string
	SSLRequired  bool
}

func ConfigurePostgres(defaultDBName string) (PostgresConfiguration, error) {
	options := []string{
		"Install (new Docker container)",
		"Provide your own connection info",
	}
	prompt := &survey.Select{
		Message: "Do you want to install PostgreSQL or provide your own connection info?",
		Options: options,
		Default: options[0],
	}
	var postgresOption string
	err := survey.AskOne(prompt, &postgresOption)
	if err != nil {
		return PostgresConfiguration{}, err
	}

	if postgresOption == options[0] {
		return PostgresConfiguration{
			InsideDocker: true,
			Host:         "db",
			Port:         5432,
			DBName:       defaultDBName,
			User:         "postgres",
			Password:     GeneratePassword(16),
			SSLRequired:  false,
		}, nil
	}

	var host, user, password, dbName string
	var port int

	err = survey.AskOne(&survey.Input{
		Message: "PostgreSQL Host",
	}, &host, survey.WithValidator(survey.Required))
	if err != nil {
		return PostgresConfiguration{}, err
	}

	err = survey.AskOne(&survey.Input{
		Message: "PostgreSQL Port",
		Default: "5432",
	}, &port, survey.WithValidator(survey.Required), survey.WithValidator(func(v interface{}) error {
		value, _ := v.(string)
		_, err := strconv.Atoi(value)
		if err != nil {
			return errors.New("not a number")
		}
		return nil
	}))
	if err != nil {
		return PostgresConfiguration{}, err
	}

	err = survey.AskOne(&survey.Input{
		Message: "PostgreSQL User",
		Default: "postgres",
	}, &user, survey.WithValidator(survey.Required))
	if err != nil {
		return PostgresConfiguration{}, err
	}

	err = survey.AskOne(&survey.Password{
		Message: "PostgreSQL Password",
	}, &password, survey.WithValidator(survey.Required))
	if err != nil {
		return PostgresConfiguration{}, err
	}

	err = survey.AskOne(&survey.Input{
		Message: "PostgreSQL Database",
		Default: defaultDBName,
	}, &dbName, survey.WithValidator(survey.Required))
	if err != nil {
		return PostgresConfiguration{}, err
	}

	return PostgresConfiguration{
		InsideDocker: false,
		Host:         host,
		Port:         port,
		User:         user,
		Password:     password,
		SSLRequired:  true,
		DBName:       dbName,
	}, nil
}
