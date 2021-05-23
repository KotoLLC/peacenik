package services

import (
	"context"
	"crypto/rsa"
	"sync"

	"github.com/mreider/koto/backend/token"
)

func NewTokenParsers(primary token.Parser) *TokenParsers {
	return &TokenParsers{
		primary:         primary,
		hubTokenParsers: make(map[string]token.Parser),
	}
}

type TokenParsers struct {
	primary           token.Parser
	hubTokenParsers   map[string]token.Parser
	hubTokenParsersMu sync.Mutex
}

func (tp *TokenParsers) Primary() token.Parser {
	return tp.primary
}

func (tp *TokenParsers) Hub(ctx context.Context, hubAddress string) token.Parser {
	tp.hubTokenParsersMu.Lock()
	defer tp.hubTokenParsersMu.Unlock()

	if parser, ok := tp.hubTokenParsers[hubAddress]; ok {
		return parser
	}
	nodePublicKey, err := loadNodePublicKey(ctx, hubAddress)
	if err != nil {
		panic(err)
	}
	parser := token.NewParser(func() *rsa.PublicKey {
		return nodePublicKey
	})
	tp.hubTokenParsers[hubAddress] = parser
	return parser
}
