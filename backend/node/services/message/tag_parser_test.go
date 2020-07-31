package message_test

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/mreider/koto/backend/node/services/message"
)

func TestFindUserTags(t *testing.T) {
	assert.Empty(t, message.FindUserTags(""))
	assert.Equal(t, []string{"andrey"}, message.FindUserTags("hi @andrey! I'm here"))
	assert.Equal(t, []string{"andrey", "matt", "dima"}, message.FindUserTags("hi @andrey and @matt! I'm here with @andrey and @dima"))
}
