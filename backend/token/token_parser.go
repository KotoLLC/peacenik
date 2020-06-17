package token

import (
	"crypto/rsa"
	"errors"
	"fmt"

	"github.com/dgrijalva/jwt-go"
)

var (
	ErrInvalidToken = errors.New("invalid token")
)

type Parser interface {
	Parse(rawToken string, scope string) (token *jwt.Token, claims jwt.MapClaims, err error)
}

type parser struct {
	publicKey *rsa.PublicKey
}

func NewParser(publicKey *rsa.PublicKey) Parser {
	return &parser{
		publicKey: publicKey,
	}
}

func (p *parser) Parse(rawToken string, scope string) (token *jwt.Token, claims jwt.MapClaims, err error) {
	fmt.Println(rawToken)
	jwtToken, err := jwt.Parse(rawToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, ErrInvalidToken
		}
		return p.publicKey, nil
	})
	if err != nil {
		return nil, nil, err
	}

	claims = jwtToken.Claims.(jwt.MapClaims)
	if !jwtToken.Valid {
		return jwtToken, claims, ErrInvalidToken
	}

	if scope != claims["scope"].(string) {
		return jwtToken, claims, ErrInvalidToken
	}
	return jwtToken, claims, nil
}
