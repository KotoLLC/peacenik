package common

import (
	"time"
)

func CurrentTimestamp() string {
	return time.Now().UTC().Format("2006-01-02T15:04:05.000Z07:00")
}
