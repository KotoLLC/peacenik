package token

import (
	"crypto/rsa"
	"errors"
	"fmt"

	"github.com/dgrijalva/jwt-go"
)

type Parser interface {
	Parse(rawToken string, scope string) (token *jwt.Token, claims jwt.MapClaims, err error)
	ParseUnverified(rawToken string) (token *jwt.Token, claims jwt.MapClaims, err error)
}

type parser struct {
	getPublicKey func() *rsa.PublicKey
}

func NewParser(getPublicKey func() *rsa.PublicKey) Parser {
	return &parser{
		getPublicKey: getPublicKey,
	}
}

func (p *parser) Parse(rawToken string, scope string) (token *jwt.Token, claims jwt.MapClaims, err error) {
	jwtToken, err := jwt.Parse(rawToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, errors.New("invalid token: signing method")
		}
		return p.getPublicKey(), nil
	})
	if err != nil {
		return nil, nil, fmt.Errorf("invalid token: %w", err)
	}

	claims = jwtToken.Claims.(jwt.MapClaims)
	if !jwtToken.Valid {
		return jwtToken, claims, errors.New("invalid token: not valid")
	}

	if scope != claims["scope"].(string) {
		return jwtToken, claims, fmt.Errorf("invalid token (expected scope %s, was %s)", scope, claims["scope"].(string))
	}
	return jwtToken, claims, nil
}

func (p *parser) ParseUnverified(rawToken string) (token *jwt.Token, claims jwt.MapClaims, err error) {
	claims = jwt.MapClaims{}
	jwtToken, _, err := new(jwt.Parser).ParseUnverified(rawToken, claims)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid token: %w", err)
	}
	return jwtToken, claims, nil
}
