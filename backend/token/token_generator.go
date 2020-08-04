package token

import (
	"crypto/rsa"
	"time"

	"github.com/ansel1/merry"
	"github.com/dgrijalva/jwt-go"
)

type Generator interface {
	Generate(userID, userName, scope string, exp time.Time, claims map[string]interface{}) (token string, err error)
}

type generator struct {
	privateKey *rsa.PrivateKey
}

func NewGenerator(privateKey *rsa.PrivateKey) Generator {
	return &generator{
		privateKey: privateKey,
	}
}

func (g *generator) Generate(userID, userName, scope string, exp time.Time, claims map[string]interface{}) (token string, err error) {
	tokenClaims := jwt.MapClaims{}
	for k, v := range claims {
		tokenClaims[k] = v
	}

	tokenClaims["id"] = userID
	tokenClaims["name"] = userName
	tokenClaims["scope"] = scope
	tokenClaims["exp"] = exp.Unix()
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodRS256, tokenClaims)
	token, err = jwtToken.SignedString(g.privateKey)
	if err != nil {
		return "", merry.Wrap(err)
	}
	return token, nil
}
