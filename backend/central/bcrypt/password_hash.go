package bcrypt

import (
	"github.com/ansel1/merry"
	"golang.org/x/crypto/bcrypt"

	"github.com/mreider/koto/backend/central/services"
)

type passwordHash struct{}

func NewPasswordHash() services.PasswordHash {
	return &passwordHash{}
}

func (h *passwordHash) GenerateHash(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", merry.Wrap(err)
	}
	return string(hash), nil
}

func (h *passwordHash) CompareHashAndPassword(hash, password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}
