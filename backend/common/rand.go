package common

import (
	"crypto/rand"

	"github.com/ansel1/merry"
)

// https://gist.github.com/dopey/c69559607800d2f2f90b1b1ed4e550fb
func GenerateRandomString(n int) (string, error) {
	const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	bytes, err := GenerateRandomBytes(n)
	if err != nil {
		return "", merry.Wrap(err)
	}
	for i, b := range bytes {
		bytes[i] = letters[b%byte(len(letters))]
	}
	return string(bytes), nil
}

func GenerateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	return b, nil
}
