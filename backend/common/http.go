package common

import (
	"strings"
)

func CleanPublicURL(url string) string {
	if url == "" {
		return ""
	}

	url = strings.TrimSuffix(url, "/")
	if !strings.HasPrefix(url, "https://") && !strings.HasPrefix(url, "http://") {
		url = "https://" + url
	}
	return url
}
