package message_test

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/mreider/koto/backend/messagehub/services/message"
)

func TestFindUserTags(t *testing.T) {
	assert.Empty(t, message.FindUserTags(""))
	assert.Equal(t, []string{"606f399f-2ffc-4b46-bd5c-f77d240e85d0"}, message.FindUserTags("hi @606f399f-2ffc-4b46-bd5c-f77d240e85d0! I'm here"))
	assert.Equal(t, []string{"606f399f-2ffc-4b46-bd5c-f77d240e85d0", "dd4d0749-32cf-4857-81ba-f9379a691627", "3056a081-8303-4065-a854-ae03b2be42c1"}, message.FindUserTags("hi @606f399f-2ffc-4b46-bd5c-f77d240e85d0 and @dd4d0749-32cf-4857-81ba-f9379a691627! I'm here with @606f399f-2ffc-4b46-bd5c-f77d240e85d0 and @3056a081-8303-4065-a854-ae03b2be42c1"))
}
