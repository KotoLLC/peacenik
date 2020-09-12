package common

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"io/ioutil"
	"os"

	"github.com/ansel1/merry"
	"github.com/dgrijalva/jwt-go"
)

func GenerateRSAKey(keyPath string) error {
	_, err := os.Stat(keyPath)
	if err == nil {
		return nil
	}
	if !os.IsNotExist(err) {
		return merry.Wrap(err)
	}

	const bitSize = 1024
	reader := rand.Reader
	key, err := rsa.GenerateKey(reader, bitSize)
	if err != nil {
		return err
	}

	outFile, err := os.Create(keyPath)
	if err != nil {
		return err
	}
	defer func() {
		_ = outFile.Close()
	}()

	var privateKey = &pem.Block{
		Type:  "PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(key),
	}

	err = pem.Encode(outFile, privateKey)
	if err != nil {
		return err
	}
	return nil
}

func RSAKeysFromPrivateKeyFile(privateKeyPath string) (privateKey *rsa.PrivateKey, publicKey *rsa.PublicKey, publicKeyPEM []byte, err error) {
	privateKeyBytes, err := ioutil.ReadFile(privateKeyPath)
	if err != nil {
		return nil, nil, nil, merry.Wrap(err)
	}
	privateKey, err = jwt.ParseRSAPrivateKeyFromPEM(privateKeyBytes)
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
