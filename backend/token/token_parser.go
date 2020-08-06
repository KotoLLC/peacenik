package token

import (
	"crypto/rsa"

	"github.com/ansel1/merry"
	"github.com/dgrijalva/jwt-go"
)

var (
	ErrInvalidToken = merry.New("invalid token")
)

type Parser interface {
	Parse(rawToken string, scope string) (token *jwt.Token, claims jwt.MapClaims, err error)
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
			return nil, ErrInvalidToken.Here()
		}
		return p.getPublicKey(), nil
	})
	if err != nil {
		return nil, nil, ErrInvalidToken.Here()
	}

	claims = jwtToken.Claims.(jwt.MapClaims)
	if !jwtToken.Valid {
		return jwtToken, claims, ErrInvalidToken.Here()
	}

	if scope != claims["scope"].(string) {
		return jwtToken, claims, ErrInvalidToken.Here()
	}
	return jwtToken, claims, nil
}
