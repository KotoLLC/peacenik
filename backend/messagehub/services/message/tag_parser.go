package message

import (
	"regexp"
)

var (
	userIDRe = regexp.MustCompile(`@([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\b`)
)

func FindUserTags(message string) []string {
	result := make([]string, 0, 2)
	for _, userIDMatch := range userIDRe.FindAllStringSubmatch(message, -1) {
		userID := userIDMatch[1]
		found := false
		for _, n := range result {
			if n == userID {
				found = true
			}
		}
		if !found {
			result = append(result, userID)
		}
	}
	return result
}
