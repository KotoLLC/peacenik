package common

import (
	"database/sql"
	"time"
)

const (
	rpcTimeLayout = "2006-01-02T15:04:05.000Z07:00"
)

func RPCStringToTime(s string) (time.Time, error) {
	layout := rpcTimeLayout
	if len(s) < len(layout) {
		layout = layout[:len(s)]
	}
	return time.Parse(layout, s)
}

func TimeToRPCString(t time.Time) string {
	return t.Format(rpcTimeLayout)
}

func NullTimeToRPCString(t sql.NullTime) string {
	if !t.Valid {
		return ""
	}
	return t.Time.Format(rpcTimeLayout)
}

func CurrentTimestamp() time.Time {
	return time.Now()
}
