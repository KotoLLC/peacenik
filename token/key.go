package token

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"io/ioutil"

	"github.com/dgrijalva/jwt-go"
)

func RSAKeysFromPrivateKeyFile(privateKeyPath string) (privateKey *rsa.PrivateKey, publicKey *rsa.PublicKey, publicKeyPEM []byte, err error) {
	privateKeyBytes, err := ioutil.ReadFile(privateKeyPath)
	if err != nil {
		return nil, nil, nil, err
	}
	privateKey, err = jwt.ParseRSAPrivateKeyFromPEM(privateKeyBytes)
	if err != nil {
		return nil, nil, nil, err
	}

	publicKeyDer, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		return nil, nil, nil, err
	}
	pubKeyBlock := pem.Block{
		Type:    "PUBLIC KEY",
		Headers: nil,
		Bytes:   publicKeyDer,
	}
	publicKeyPEM = pem.EncodeToMemory(&pubKeyBlock)
	publicKey, err = jwt.ParseRSAPublicKeyFromPEM(publicKeyPEM)
	if err != nil {
		return nil, nil, nil, err
	}
	return privateKey, publicKey, publicKeyPEM, nil
}
