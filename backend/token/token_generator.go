package token

import (
	"crypto/rsa"
	"time"

	"github.com/dgrijalva/jwt-go"

	"github.com/mreider/koto/backend/central/repo"
)

type Generator interface {
	Generate(user repo.User, scope string, exp time.Time, claims map[string]interface{}) (token string, err error)
}

type generator struct {
	privateKey *rsa.PrivateKey
}

func NewGenerator(privateKey *rsa.PrivateKey) Generator {
	return &generator{
		privateKey: privateKey,
	}
}

func (g *generator) Generate(user repo.User, scope string, exp time.Time, claims map[string]interface{}) (token string, err error) {
	tokenClaims := jwt.MapClaims{}
	for k, v := range claims {
		tokenClaims[k] = v
	}

	tokenClaims["id"] = user.ID
	tokenClaims["name"] = user.Name
	tokenClaims["scope"] = scope
	tokenClaims["exp"] = exp.Unix()
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodRS256, tokenClaims)
	token, err = jwtToken.SignedString(g.privateKey)
	if err != nil {
		return "", err
	}
	return token, nil
}
