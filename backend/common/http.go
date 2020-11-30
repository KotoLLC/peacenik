package common

import (
	"net/url"
	"strings"

	"github.com/ansel1/merry"
	"golang.org/x/net/publicsuffix"
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

func GetEffectiveTLDPlusOne(rawURL string) (string, error) {
	if rawURL == "" {
		return "", nil
	}

	u, err := url.Parse(rawURL)
	if err != nil {
		return "", merry.Wrap(err)
	}

	domain, err := publicsuffix.EffectiveTLDPlusOne(u.Hostname())
	if err != nil {
		return "", merry.Wrap(err)
	}

	return domain, nil
}
