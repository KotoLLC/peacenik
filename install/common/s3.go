package common

import (
	"github.com/AlecAivazis/survey/v2"
)

type S3Configuration struct {
	InsideDocker bool
	Endpoint     string
	Region       string
	Key          string
	Secret       string
	Bucket       string
}

func ConfigureS3(defaultBucketName string) (S3Configuration, error) {
	options := []string{
		"Install (new Docker container)",
		"Provide your own s3 information",
	}
	prompt := &survey.Select{
		Message: "Do you want to install minio for local s3 storage or provide your own s3 information?",
		Options: options,
		Default: options[0],
	}
	var s3Option string
	err := survey.AskOne(prompt, &s3Option)
	if err != nil {
		return S3Configuration{}, err
	}

	if s3Option == options[0] {
		return S3Configuration{
			InsideDocker: true,
			Endpoint:     "http://s3:9000",
			Region:       "",
			Key:          "minioadmin",
			Secret:       GeneratePassword(16),
			Bucket:       defaultBucketName,
		}, nil
	}

	var endpoint, region, key, secret, bucketName string

	err = survey.AskOne(&survey.Input{
		Message: "S3 Endpoint",
	}, &endpoint, survey.WithValidator(survey.Required))
	if err != nil {
		return S3Configuration{}, err
	}

	endpoint = PrependHTTPS(endpoint)

	err = survey.AskOne(&survey.Input{
		Message: "S3 Region",
	}, &region)
	if err != nil {
		return S3Configuration{}, err
	}

	err = survey.AskOne(&survey.Input{
		Message: "S3 Key",
	}, &key, survey.WithValidator(survey.Required))
	if err != nil {
		return S3Configuration{}, err
	}

	err = survey.AskOne(&survey.Password{
		Message: "S3 Secret",
	}, &secret, survey.WithValidator(survey.Required))
	if err != nil {
		return S3Configuration{}, err
	}

	err = survey.AskOne(&survey.Input{
		Message: "S3 Bucket",
		Default: defaultBucketName,
	}, &bucketName, survey.WithValidator(survey.Required))
	if err != nil {
		return S3Configuration{}, err
	}

	return S3Configuration{
		InsideDocker: false,
		Endpoint:     endpoint,
		Region:       region,
		Key:          key,
		Secret:       secret,
		Bucket:       bucketName,
	}, nil
}
