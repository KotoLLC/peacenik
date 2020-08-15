package message

import (
	"regexp"
)

var (
	userNameRe = regexp.MustCompile(`@(\w(\w|-|_|\.)+\w)`)
)

func FindUserTags(message string) []string {
	result := make([]string, 0, 2)
	for _, userNameMatch := range userNameRe.FindAllStringSubmatch(message, -1) {
		userName := userNameMatch[1]
		found := false
		for _, n := range result {
			if n == userName {
				found = true
			}
		}
		if !found {
			result = append(result, userName)
		}
	}
	return result
}
