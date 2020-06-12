package token

import (
	"crypto/rsa"
	"errors"

	"github.com/dgrijalva/jwt-go"
)

var (
	ErrInvalidToken = errors.New("invalid token")
)

type Parser interface {
	Parse(rawToken string) (token *jwt.Token, err error)
}

type parser struct {
	publicKey *rsa.PublicKey
}

func NewParser(publicKey *rsa.PublicKey) Parser {
	return &parser{
		publicKey: publicKey,
	}
}

func (p *parser) Parse(rawToken string) (token *jwt.Token, err error) {
	jwtToken, err := jwt.Parse(rawToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, ErrInvalidToken
		}
		return p.publicKey, nil
	})
	if err != nil {
		return nil, err
	}
	if !jwtToken.Valid {
		return jwtToken, ErrInvalidToken
	}

	return jwtToken, nil
}
