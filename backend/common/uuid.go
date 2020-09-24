package common

import (
	"github.com/gofrs/uuid"
)

func GenerateUUID() string {
	newID, err := uuid.NewV4()
	if err != nil {
		panic(err)
	}
	return newID.String()
}
