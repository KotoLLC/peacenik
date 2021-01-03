package common

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"io/ioutil"

	"github.com/ansel1/merry"
	"github.com/dgrijalva/jwt-go"
)

func LoadRSAKey(settingRepo SettingRepo, keyPath string) (string, error) {
	const privateKeyID = "private-key"
	privateKey, exists, err := settingRepo.Get(privateKeyID)
	if err != nil {
		return "", merry.Wrap(err)
	}
	if exists {
		return privateKey, nil
	}

	var keyContent []byte
	if keyPath != "" {
		keyContent, err = ioutil.ReadFile(keyPath)
		if err != nil {
			keyContent = nil
		}
	}

	if len(keyContent) == 0 {
		const bitSize = 1024
		reader := rand.Reader
		key, err := rsa.GenerateKey(reader, bitSize)
		if err != nil {
			return "", merry.Wrap(err)
		}
		var privateKey = &pem.Block{
			Type:  "PRIVATE KEY",
			Bytes: x509.MarshalPKCS1PrivateKey(key),
		}

		var b bytes.Buffer
		err = pem.Encode(&b, privateKey)
		if err != nil {
			return "", merry.Wrap(err)
		}
		keyContent = b.Bytes()
	}

	err = settingRepo.Add(privateKeyID, string(keyContent))
	if err != nil {
		return "", merry.Wrap(err)
	}
	return string(keyContent), nil
}

func RSAKeysFromPrivateKeyContent(privateKeyContent string) (privateKey *rsa.PrivateKey, publicKey *rsa.PublicKey, publicKeyPEM []byte, err error) {
	privateKey, err = jwt.ParseRSAPrivateKeyFromPEM([]byte(privateKeyContent))
	if err != nil {
		return nil, nil, nil, merry.Wrap(err)
	}

	publicKeyDer, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		return nil, nil, nil, merry.Wrap(err)
	}
	pubKeyBlock := pem.Block{
		Type:    "PUBLIC KEY",
		Headers: nil,
		Bytes:   publicKeyDer,
	}
	publicKeyPEM = pem.EncodeToMemory(&pubKeyBlock)
	publicKey, err = jwt.ParseRSAPublicKeyFromPEM(publicKeyPEM)
	if err != nil {
		return nil, nil, nil, merry.Wrap(err)
	}
	return privateKey, publicKey, publicKeyPEM, nil
}
