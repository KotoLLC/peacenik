// Code generated by protoc-gen-twirp v8.0.0, DO NOT EDIT.
// source: token.proto

package rpc

import context "context"
import fmt "fmt"
import http "net/http"
import ioutil "io/ioutil"
import json "encoding/json"
import strconv "strconv"
import strings "strings"

import protojson "google.golang.org/protobuf/encoding/protojson"
import proto "google.golang.org/protobuf/proto"
import twirp "github.com/twitchtv/twirp"
import ctxsetters "github.com/twitchtv/twirp/ctxsetters"

// This is a compile-time assertion to ensure that this generated file
// is compatible with the twirp package used in your project.
// A compilation error at this line likely means your copy of the
// twirp package needs to be updated.
const _ = twirp.TwirpPackageIsVersion7

// ======================
// TokenService Interface
// ======================

type TokenService interface {
	Auth(context.Context, *Empty) (*TokenAuthResponse, error)

	PostMessage(context.Context, *TokenPostMessageRequest) (*TokenPostMessageResponse, error)

	GetMessages(context.Context, *Empty) (*TokenGetMessagesResponse, error)
}

// ============================
// TokenService Protobuf Client
// ============================

type tokenServiceProtobufClient struct {
	client      HTTPClient
	urls        [3]string
	interceptor twirp.Interceptor
	opts        twirp.ClientOptions
}

// NewTokenServiceProtobufClient creates a Protobuf client that implements the TokenService interface.
// It communicates using Protobuf and can be configured with a custom HTTPClient.
func NewTokenServiceProtobufClient(baseURL string, client HTTPClient, opts ...twirp.ClientOption) TokenService {
	if c, ok := client.(*http.Client); ok {
		client = withoutRedirects(c)
	}

	clientOpts := twirp.ClientOptions{}
	for _, o := range opts {
		o(&clientOpts)
	}

	// Build method URLs: <baseURL>[<prefix>]/<package>.<Service>/<Method>
	serviceURL := sanitizeBaseURL(baseURL)
	serviceURL += baseServicePath(clientOpts.PathPrefix(), "rpc", "TokenService")
	urls := [3]string{
		serviceURL + "Auth",
		serviceURL + "PostMessage",
		serviceURL + "GetMessages",
	}

	return &tokenServiceProtobufClient{
		client:      client,
		urls:        urls,
		interceptor: twirp.ChainInterceptors(clientOpts.Interceptors...),
		opts:        clientOpts,
	}
}

func (c *tokenServiceProtobufClient) Auth(ctx context.Context, in *Empty) (*TokenAuthResponse, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "TokenService")
	ctx = ctxsetters.WithMethodName(ctx, "Auth")
	caller := c.callAuth
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *Empty) (*TokenAuthResponse, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return c.callAuth(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenAuthResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenAuthResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *tokenServiceProtobufClient) callAuth(ctx context.Context, in *Empty) (*TokenAuthResponse, error) {
	out := new(TokenAuthResponse)
	ctx, err := doProtobufRequest(ctx, c.client, c.opts.Hooks, c.urls[0], in, out)
	if err != nil {
		twerr, ok := err.(twirp.Error)
		if !ok {
			twerr = twirp.InternalErrorWith(err)
		}
		callClientError(ctx, c.opts.Hooks, twerr)
		return nil, err
	}

	callClientResponseReceived(ctx, c.opts.Hooks)

	return out, nil
}

func (c *tokenServiceProtobufClient) PostMessage(ctx context.Context, in *TokenPostMessageRequest) (*TokenPostMessageResponse, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "TokenService")
	ctx = ctxsetters.WithMethodName(ctx, "PostMessage")
	caller := c.callPostMessage
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *TokenPostMessageRequest) (*TokenPostMessageResponse, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*TokenPostMessageRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*TokenPostMessageRequest) when calling interceptor")
					}
					return c.callPostMessage(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenPostMessageResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenPostMessageResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *tokenServiceProtobufClient) callPostMessage(ctx context.Context, in *TokenPostMessageRequest) (*TokenPostMessageResponse, error) {
	out := new(TokenPostMessageResponse)
	ctx, err := doProtobufRequest(ctx, c.client, c.opts.Hooks, c.urls[1], in, out)
	if err != nil {
		twerr, ok := err.(twirp.Error)
		if !ok {
			twerr = twirp.InternalErrorWith(err)
		}
		callClientError(ctx, c.opts.Hooks, twerr)
		return nil, err
	}

	callClientResponseReceived(ctx, c.opts.Hooks)

	return out, nil
}

func (c *tokenServiceProtobufClient) GetMessages(ctx context.Context, in *Empty) (*TokenGetMessagesResponse, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "TokenService")
	ctx = ctxsetters.WithMethodName(ctx, "GetMessages")
	caller := c.callGetMessages
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *Empty) (*TokenGetMessagesResponse, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return c.callGetMessages(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenGetMessagesResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenGetMessagesResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *tokenServiceProtobufClient) callGetMessages(ctx context.Context, in *Empty) (*TokenGetMessagesResponse, error) {
	out := new(TokenGetMessagesResponse)
	ctx, err := doProtobufRequest(ctx, c.client, c.opts.Hooks, c.urls[2], in, out)
	if err != nil {
		twerr, ok := err.(twirp.Error)
		if !ok {
			twerr = twirp.InternalErrorWith(err)
		}
		callClientError(ctx, c.opts.Hooks, twerr)
		return nil, err
	}

	callClientResponseReceived(ctx, c.opts.Hooks)

	return out, nil
}

// ========================
// TokenService JSON Client
// ========================

type tokenServiceJSONClient struct {
	client      HTTPClient
	urls        [3]string
	interceptor twirp.Interceptor
	opts        twirp.ClientOptions
}

// NewTokenServiceJSONClient creates a JSON client that implements the TokenService interface.
// It communicates using JSON and can be configured with a custom HTTPClient.
func NewTokenServiceJSONClient(baseURL string, client HTTPClient, opts ...twirp.ClientOption) TokenService {
	if c, ok := client.(*http.Client); ok {
		client = withoutRedirects(c)
	}

	clientOpts := twirp.ClientOptions{}
	for _, o := range opts {
		o(&clientOpts)
	}

	// Build method URLs: <baseURL>[<prefix>]/<package>.<Service>/<Method>
	serviceURL := sanitizeBaseURL(baseURL)
	serviceURL += baseServicePath(clientOpts.PathPrefix(), "rpc", "TokenService")
	urls := [3]string{
		serviceURL + "Auth",
		serviceURL + "PostMessage",
		serviceURL + "GetMessages",
	}

	return &tokenServiceJSONClient{
		client:      client,
		urls:        urls,
		interceptor: twirp.ChainInterceptors(clientOpts.Interceptors...),
		opts:        clientOpts,
	}
}

func (c *tokenServiceJSONClient) Auth(ctx context.Context, in *Empty) (*TokenAuthResponse, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "TokenService")
	ctx = ctxsetters.WithMethodName(ctx, "Auth")
	caller := c.callAuth
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *Empty) (*TokenAuthResponse, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return c.callAuth(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenAuthResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenAuthResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *tokenServiceJSONClient) callAuth(ctx context.Context, in *Empty) (*TokenAuthResponse, error) {
	out := new(TokenAuthResponse)
	ctx, err := doJSONRequest(ctx, c.client, c.opts.Hooks, c.urls[0], in, out)
	if err != nil {
		twerr, ok := err.(twirp.Error)
		if !ok {
			twerr = twirp.InternalErrorWith(err)
		}
		callClientError(ctx, c.opts.Hooks, twerr)
		return nil, err
	}

	callClientResponseReceived(ctx, c.opts.Hooks)

	return out, nil
}

func (c *tokenServiceJSONClient) PostMessage(ctx context.Context, in *TokenPostMessageRequest) (*TokenPostMessageResponse, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "TokenService")
	ctx = ctxsetters.WithMethodName(ctx, "PostMessage")
	caller := c.callPostMessage
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *TokenPostMessageRequest) (*TokenPostMessageResponse, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*TokenPostMessageRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*TokenPostMessageRequest) when calling interceptor")
					}
					return c.callPostMessage(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenPostMessageResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenPostMessageResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *tokenServiceJSONClient) callPostMessage(ctx context.Context, in *TokenPostMessageRequest) (*TokenPostMessageResponse, error) {
	out := new(TokenPostMessageResponse)
	ctx, err := doJSONRequest(ctx, c.client, c.opts.Hooks, c.urls[1], in, out)
	if err != nil {
		twerr, ok := err.(twirp.Error)
		if !ok {
			twerr = twirp.InternalErrorWith(err)
		}
		callClientError(ctx, c.opts.Hooks, twerr)
		return nil, err
	}

	callClientResponseReceived(ctx, c.opts.Hooks)

	return out, nil
}

func (c *tokenServiceJSONClient) GetMessages(ctx context.Context, in *Empty) (*TokenGetMessagesResponse, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "TokenService")
	ctx = ctxsetters.WithMethodName(ctx, "GetMessages")
	caller := c.callGetMessages
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *Empty) (*TokenGetMessagesResponse, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return c.callGetMessages(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenGetMessagesResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenGetMessagesResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *tokenServiceJSONClient) callGetMessages(ctx context.Context, in *Empty) (*TokenGetMessagesResponse, error) {
	out := new(TokenGetMessagesResponse)
	ctx, err := doJSONRequest(ctx, c.client, c.opts.Hooks, c.urls[2], in, out)
	if err != nil {
		twerr, ok := err.(twirp.Error)
		if !ok {
			twerr = twirp.InternalErrorWith(err)
		}
		callClientError(ctx, c.opts.Hooks, twerr)
		return nil, err
	}

	callClientResponseReceived(ctx, c.opts.Hooks)

	return out, nil
}

// ===========================
// TokenService Server Handler
// ===========================

type tokenServiceServer struct {
	TokenService
	interceptor      twirp.Interceptor
	hooks            *twirp.ServerHooks
	pathPrefix       string // prefix for routing
	jsonSkipDefaults bool   // do not include unpopulated fields (default values) in the response
}

// NewTokenServiceServer builds a TwirpServer that can be used as an http.Handler to handle
// HTTP requests that are routed to the right method in the provided svc implementation.
// The opts are twirp.ServerOption modifiers, for example twirp.WithServerHooks(hooks).
func NewTokenServiceServer(svc TokenService, opts ...interface{}) TwirpServer {
	serverOpts := twirp.ServerOptions{}
	for _, opt := range opts {
		switch o := opt.(type) {
		case twirp.ServerOption:
			o(&serverOpts)
		case *twirp.ServerHooks: // backwards compatibility, allow to specify hooks as an argument
			twirp.WithServerHooks(o)(&serverOpts)
		case nil: // backwards compatibility, allow nil value for the argument
			continue
		default:
			panic(fmt.Sprintf("Invalid option type %T on NewTokenServiceServer", o))
		}
	}

	return &tokenServiceServer{
		TokenService:     svc,
		pathPrefix:       serverOpts.PathPrefix(),
		interceptor:      twirp.ChainInterceptors(serverOpts.Interceptors...),
		hooks:            serverOpts.Hooks,
		jsonSkipDefaults: serverOpts.JSONSkipDefaults,
	}
}

// writeError writes an HTTP response with a valid Twirp error format, and triggers hooks.
// If err is not a twirp.Error, it will get wrapped with twirp.InternalErrorWith(err)
func (s *tokenServiceServer) writeError(ctx context.Context, resp http.ResponseWriter, err error) {
	writeError(ctx, resp, err, s.hooks)
}

// handleRequestBodyError is used to handle error when the twirp server cannot read request
func (s *tokenServiceServer) handleRequestBodyError(ctx context.Context, resp http.ResponseWriter, msg string, err error) {
	if context.Canceled == ctx.Err() {
		s.writeError(ctx, resp, twirp.NewError(twirp.Canceled, "failed to read request: context canceled"))
		return
	}
	if context.DeadlineExceeded == ctx.Err() {
		s.writeError(ctx, resp, twirp.NewError(twirp.DeadlineExceeded, "failed to read request: deadline exceeded"))
		return
	}
	s.writeError(ctx, resp, twirp.WrapError(malformedRequestError(msg), err))
}

// TokenServicePathPrefix is a convenience constant that could used to identify URL paths.
// Should be used with caution, it only matches routes generated by Twirp Go clients,
// that add a "/twirp" prefix by default, and use CamelCase service and method names.
// More info: https://twitchtv.github.io/twirp/docs/routing.html
const TokenServicePathPrefix = "/twirp/rpc.TokenService/"

func (s *tokenServiceServer) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "TokenService")
	ctx = ctxsetters.WithResponseWriter(ctx, resp)

	var err error
	ctx, err = callRequestReceived(ctx, s.hooks)
	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}

	if req.Method != "POST" {
		msg := fmt.Sprintf("unsupported method %q (only POST is allowed)", req.Method)
		s.writeError(ctx, resp, badRouteError(msg, req.Method, req.URL.Path))
		return
	}

	// Verify path format: [<prefix>]/<package>.<Service>/<Method>
	prefix, pkgService, method := parseTwirpPath(req.URL.Path)
	if pkgService != "rpc.TokenService" {
		msg := fmt.Sprintf("no handler for path %q", req.URL.Path)
		s.writeError(ctx, resp, badRouteError(msg, req.Method, req.URL.Path))
		return
	}
	if prefix != s.pathPrefix {
		msg := fmt.Sprintf("invalid path prefix %q, expected %q, on path %q", prefix, s.pathPrefix, req.URL.Path)
		s.writeError(ctx, resp, badRouteError(msg, req.Method, req.URL.Path))
		return
	}

	switch method {
	case "Auth":
		s.serveAuth(ctx, resp, req)
		return
	case "PostMessage":
		s.servePostMessage(ctx, resp, req)
		return
	case "GetMessages":
		s.serveGetMessages(ctx, resp, req)
		return
	default:
		msg := fmt.Sprintf("no handler for path %q", req.URL.Path)
		s.writeError(ctx, resp, badRouteError(msg, req.Method, req.URL.Path))
		return
	}
}

func (s *tokenServiceServer) serveAuth(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	header := req.Header.Get("Content-Type")
	i := strings.Index(header, ";")
	if i == -1 {
		i = len(header)
	}
	switch strings.TrimSpace(strings.ToLower(header[:i])) {
	case "application/json":
		s.serveAuthJSON(ctx, resp, req)
	case "application/protobuf":
		s.serveAuthProtobuf(ctx, resp, req)
	default:
		msg := fmt.Sprintf("unexpected Content-Type: %q", req.Header.Get("Content-Type"))
		twerr := badRouteError(msg, req.Method, req.URL.Path)
		s.writeError(ctx, resp, twerr)
	}
}

func (s *tokenServiceServer) serveAuthJSON(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "Auth")
	ctx, err = callRequestRouted(ctx, s.hooks)
	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}

	d := json.NewDecoder(req.Body)
	rawReqBody := json.RawMessage{}
	if err := d.Decode(&rawReqBody); err != nil {
		s.handleRequestBodyError(ctx, resp, "the json request could not be decoded", err)
		return
	}
	reqContent := new(Empty)
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}
	if err = unmarshaler.Unmarshal(rawReqBody, reqContent); err != nil {
		s.handleRequestBodyError(ctx, resp, "the json request could not be decoded", err)
		return
	}

	handler := s.TokenService.Auth
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *Empty) (*TokenAuthResponse, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return s.TokenService.Auth(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenAuthResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenAuthResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *TokenAuthResponse
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *TokenAuthResponse and nil error while calling Auth. nil responses are not supported"))
		return
	}

	ctx = callResponsePrepared(ctx, s.hooks)

	marshaler := &protojson.MarshalOptions{UseProtoNames: true, EmitUnpopulated: !s.jsonSkipDefaults}
	respBytes, err := marshaler.Marshal(respContent)
	if err != nil {
		s.writeError(ctx, resp, wrapInternal(err, "failed to marshal json response"))
		return
	}

	ctx = ctxsetters.WithStatusCode(ctx, http.StatusOK)
	resp.Header().Set("Content-Type", "application/json")
	resp.Header().Set("Content-Length", strconv.Itoa(len(respBytes)))
	resp.WriteHeader(http.StatusOK)

	if n, err := resp.Write(respBytes); err != nil {
		msg := fmt.Sprintf("failed to write response, %d of %d bytes written: %s", n, len(respBytes), err.Error())
		twerr := twirp.NewError(twirp.Unknown, msg)
		ctx = callError(ctx, s.hooks, twerr)
	}
	callResponseSent(ctx, s.hooks)
}

func (s *tokenServiceServer) serveAuthProtobuf(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "Auth")
	ctx, err = callRequestRouted(ctx, s.hooks)
	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}

	buf, err := ioutil.ReadAll(req.Body)
	if err != nil {
		s.handleRequestBodyError(ctx, resp, "failed to read request body", err)
		return
	}
	reqContent := new(Empty)
	if err = proto.Unmarshal(buf, reqContent); err != nil {
		s.writeError(ctx, resp, malformedRequestError("the protobuf request could not be decoded"))
		return
	}

	handler := s.TokenService.Auth
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *Empty) (*TokenAuthResponse, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return s.TokenService.Auth(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenAuthResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenAuthResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *TokenAuthResponse
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *TokenAuthResponse and nil error while calling Auth. nil responses are not supported"))
		return
	}

	ctx = callResponsePrepared(ctx, s.hooks)

	respBytes, err := proto.Marshal(respContent)
	if err != nil {
		s.writeError(ctx, resp, wrapInternal(err, "failed to marshal proto response"))
		return
	}

	ctx = ctxsetters.WithStatusCode(ctx, http.StatusOK)
	resp.Header().Set("Content-Type", "application/protobuf")
	resp.Header().Set("Content-Length", strconv.Itoa(len(respBytes)))
	resp.WriteHeader(http.StatusOK)
	if n, err := resp.Write(respBytes); err != nil {
		msg := fmt.Sprintf("failed to write response, %d of %d bytes written: %s", n, len(respBytes), err.Error())
		twerr := twirp.NewError(twirp.Unknown, msg)
		ctx = callError(ctx, s.hooks, twerr)
	}
	callResponseSent(ctx, s.hooks)
}

func (s *tokenServiceServer) servePostMessage(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	header := req.Header.Get("Content-Type")
	i := strings.Index(header, ";")
	if i == -1 {
		i = len(header)
	}
	switch strings.TrimSpace(strings.ToLower(header[:i])) {
	case "application/json":
		s.servePostMessageJSON(ctx, resp, req)
	case "application/protobuf":
		s.servePostMessageProtobuf(ctx, resp, req)
	default:
		msg := fmt.Sprintf("unexpected Content-Type: %q", req.Header.Get("Content-Type"))
		twerr := badRouteError(msg, req.Method, req.URL.Path)
		s.writeError(ctx, resp, twerr)
	}
}

func (s *tokenServiceServer) servePostMessageJSON(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "PostMessage")
	ctx, err = callRequestRouted(ctx, s.hooks)
	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}

	d := json.NewDecoder(req.Body)
	rawReqBody := json.RawMessage{}
	if err := d.Decode(&rawReqBody); err != nil {
		s.handleRequestBodyError(ctx, resp, "the json request could not be decoded", err)
		return
	}
	reqContent := new(TokenPostMessageRequest)
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}
	if err = unmarshaler.Unmarshal(rawReqBody, reqContent); err != nil {
		s.handleRequestBodyError(ctx, resp, "the json request could not be decoded", err)
		return
	}

	handler := s.TokenService.PostMessage
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *TokenPostMessageRequest) (*TokenPostMessageResponse, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*TokenPostMessageRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*TokenPostMessageRequest) when calling interceptor")
					}
					return s.TokenService.PostMessage(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenPostMessageResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenPostMessageResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *TokenPostMessageResponse
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *TokenPostMessageResponse and nil error while calling PostMessage. nil responses are not supported"))
		return
	}

	ctx = callResponsePrepared(ctx, s.hooks)

	marshaler := &protojson.MarshalOptions{UseProtoNames: true, EmitUnpopulated: !s.jsonSkipDefaults}
	respBytes, err := marshaler.Marshal(respContent)
	if err != nil {
		s.writeError(ctx, resp, wrapInternal(err, "failed to marshal json response"))
		return
	}

	ctx = ctxsetters.WithStatusCode(ctx, http.StatusOK)
	resp.Header().Set("Content-Type", "application/json")
	resp.Header().Set("Content-Length", strconv.Itoa(len(respBytes)))
	resp.WriteHeader(http.StatusOK)

	if n, err := resp.Write(respBytes); err != nil {
		msg := fmt.Sprintf("failed to write response, %d of %d bytes written: %s", n, len(respBytes), err.Error())
		twerr := twirp.NewError(twirp.Unknown, msg)
		ctx = callError(ctx, s.hooks, twerr)
	}
	callResponseSent(ctx, s.hooks)
}

func (s *tokenServiceServer) servePostMessageProtobuf(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "PostMessage")
	ctx, err = callRequestRouted(ctx, s.hooks)
	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}

	buf, err := ioutil.ReadAll(req.Body)
	if err != nil {
		s.handleRequestBodyError(ctx, resp, "failed to read request body", err)
		return
	}
	reqContent := new(TokenPostMessageRequest)
	if err = proto.Unmarshal(buf, reqContent); err != nil {
		s.writeError(ctx, resp, malformedRequestError("the protobuf request could not be decoded"))
		return
	}

	handler := s.TokenService.PostMessage
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *TokenPostMessageRequest) (*TokenPostMessageResponse, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*TokenPostMessageRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*TokenPostMessageRequest) when calling interceptor")
					}
					return s.TokenService.PostMessage(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenPostMessageResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenPostMessageResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *TokenPostMessageResponse
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *TokenPostMessageResponse and nil error while calling PostMessage. nil responses are not supported"))
		return
	}

	ctx = callResponsePrepared(ctx, s.hooks)

	respBytes, err := proto.Marshal(respContent)
	if err != nil {
		s.writeError(ctx, resp, wrapInternal(err, "failed to marshal proto response"))
		return
	}

	ctx = ctxsetters.WithStatusCode(ctx, http.StatusOK)
	resp.Header().Set("Content-Type", "application/protobuf")
	resp.Header().Set("Content-Length", strconv.Itoa(len(respBytes)))
	resp.WriteHeader(http.StatusOK)
	if n, err := resp.Write(respBytes); err != nil {
		msg := fmt.Sprintf("failed to write response, %d of %d bytes written: %s", n, len(respBytes), err.Error())
		twerr := twirp.NewError(twirp.Unknown, msg)
		ctx = callError(ctx, s.hooks, twerr)
	}
	callResponseSent(ctx, s.hooks)
}

func (s *tokenServiceServer) serveGetMessages(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	header := req.Header.Get("Content-Type")
	i := strings.Index(header, ";")
	if i == -1 {
		i = len(header)
	}
	switch strings.TrimSpace(strings.ToLower(header[:i])) {
	case "application/json":
		s.serveGetMessagesJSON(ctx, resp, req)
	case "application/protobuf":
		s.serveGetMessagesProtobuf(ctx, resp, req)
	default:
		msg := fmt.Sprintf("unexpected Content-Type: %q", req.Header.Get("Content-Type"))
		twerr := badRouteError(msg, req.Method, req.URL.Path)
		s.writeError(ctx, resp, twerr)
	}
}

func (s *tokenServiceServer) serveGetMessagesJSON(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "GetMessages")
	ctx, err = callRequestRouted(ctx, s.hooks)
	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}

	d := json.NewDecoder(req.Body)
	rawReqBody := json.RawMessage{}
	if err := d.Decode(&rawReqBody); err != nil {
		s.handleRequestBodyError(ctx, resp, "the json request could not be decoded", err)
		return
	}
	reqContent := new(Empty)
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}
	if err = unmarshaler.Unmarshal(rawReqBody, reqContent); err != nil {
		s.handleRequestBodyError(ctx, resp, "the json request could not be decoded", err)
		return
	}

	handler := s.TokenService.GetMessages
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *Empty) (*TokenGetMessagesResponse, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return s.TokenService.GetMessages(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenGetMessagesResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenGetMessagesResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *TokenGetMessagesResponse
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *TokenGetMessagesResponse and nil error while calling GetMessages. nil responses are not supported"))
		return
	}

	ctx = callResponsePrepared(ctx, s.hooks)

	marshaler := &protojson.MarshalOptions{UseProtoNames: true, EmitUnpopulated: !s.jsonSkipDefaults}
	respBytes, err := marshaler.Marshal(respContent)
	if err != nil {
		s.writeError(ctx, resp, wrapInternal(err, "failed to marshal json response"))
		return
	}

	ctx = ctxsetters.WithStatusCode(ctx, http.StatusOK)
	resp.Header().Set("Content-Type", "application/json")
	resp.Header().Set("Content-Length", strconv.Itoa(len(respBytes)))
	resp.WriteHeader(http.StatusOK)

	if n, err := resp.Write(respBytes); err != nil {
		msg := fmt.Sprintf("failed to write response, %d of %d bytes written: %s", n, len(respBytes), err.Error())
		twerr := twirp.NewError(twirp.Unknown, msg)
		ctx = callError(ctx, s.hooks, twerr)
	}
	callResponseSent(ctx, s.hooks)
}

func (s *tokenServiceServer) serveGetMessagesProtobuf(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "GetMessages")
	ctx, err = callRequestRouted(ctx, s.hooks)
	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}

	buf, err := ioutil.ReadAll(req.Body)
	if err != nil {
		s.handleRequestBodyError(ctx, resp, "failed to read request body", err)
		return
	}
	reqContent := new(Empty)
	if err = proto.Unmarshal(buf, reqContent); err != nil {
		s.writeError(ctx, resp, malformedRequestError("the protobuf request could not be decoded"))
		return
	}

	handler := s.TokenService.GetMessages
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *Empty) (*TokenGetMessagesResponse, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return s.TokenService.GetMessages(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*TokenGetMessagesResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*TokenGetMessagesResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *TokenGetMessagesResponse
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *TokenGetMessagesResponse and nil error while calling GetMessages. nil responses are not supported"))
		return
	}

	ctx = callResponsePrepared(ctx, s.hooks)

	respBytes, err := proto.Marshal(respContent)
	if err != nil {
		s.writeError(ctx, resp, wrapInternal(err, "failed to marshal proto response"))
		return
	}

	ctx = ctxsetters.WithStatusCode(ctx, http.StatusOK)
	resp.Header().Set("Content-Type", "application/protobuf")
	resp.Header().Set("Content-Length", strconv.Itoa(len(respBytes)))
	resp.WriteHeader(http.StatusOK)
	if n, err := resp.Write(respBytes); err != nil {
		msg := fmt.Sprintf("failed to write response, %d of %d bytes written: %s", n, len(respBytes), err.Error())
		twerr := twirp.NewError(twirp.Unknown, msg)
		ctx = callError(ctx, s.hooks, twerr)
	}
	callResponseSent(ctx, s.hooks)
}

func (s *tokenServiceServer) ServiceDescriptor() ([]byte, int) {
	return twirpFileDescriptor8, 0
}

func (s *tokenServiceServer) ProtocGenTwirpVersion() string {
	return "v8.0.0"
}

// PathPrefix returns the base service path, in the form: "/<prefix>/<package>.<Service>/"
// that is everything in a Twirp route except for the <Method>. This can be used for routing,
// for example to identify the requests that are targeted to this service in a mux.
func (s *tokenServiceServer) PathPrefix() string {
	return baseServicePath(s.pathPrefix, "rpc", "TokenService")
}

var twirpFileDescriptor8 = []byte{
	// 335 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xa4, 0x92, 0xc1, 0x4e, 0xc2, 0x40,
	0x10, 0x86, 0x53, 0x50, 0x84, 0x59, 0x0f, 0xba, 0x31, 0x8a, 0x55, 0x22, 0xe9, 0x09, 0x3c, 0xd4,
	0x04, 0x2f, 0xe8, 0x0d, 0x13, 0x62, 0xd0, 0x98, 0x68, 0xf5, 0xe4, 0x85, 0x60, 0x3b, 0x22, 0x01,
	0xba, 0xeb, 0xee, 0x96, 0xa4, 0x6f, 0xe2, 0xab, 0x78, 0xf3, 0xd1, 0x4c, 0x77, 0x97, 0x58, 0x22,
	0x10, 0x13, 0x6f, 0x9d, 0x99, 0xff, 0xef, 0x7c, 0x33, 0xb3, 0x40, 0x14, 0x1b, 0x63, 0xec, 0x73,
	0xc1, 0x14, 0xa3, 0x45, 0xc1, 0x43, 0x97, 0x4c, 0x59, 0x84, 0x13, 0x93, 0xf1, 0x9a, 0xb0, 0xfb,
	0x94, 0x09, 0x3a, 0x89, 0x7a, 0x0b, 0x50, 0x72, 0x16, 0x4b, 0xa4, 0x7b, 0xb0, 0xa9, 0x5d, 0x55,
	0xa7, 0xee, 0x34, 0x2a, 0x81, 0x09, 0xbc, 0x07, 0x38, 0xd0, 0xd2, 0x7b, 0x26, 0xd5, 0x1d, 0x4a,
	0x39, 0x18, 0x62, 0x80, 0xef, 0x09, 0x4a, 0x45, 0x0f, 0xa1, 0x3c, 0x14, 0x2c, 0xe1, 0xfd, 0x51,
	0x64, 0x3d, 0x5b, 0x3a, 0xee, 0x45, 0xf4, 0x08, 0x2a, 0xaf, 0x62, 0x84, 0x71, 0x94, 0xd5, 0x0a,
	0xba, 0x56, 0x36, 0x89, 0x5e, 0xe4, 0x7d, 0x3a, 0x50, 0xfd, 0xfd, 0x4f, 0x4b, 0xd1, 0x81, 0x92,
	0x6e, 0x2c, 0xab, 0x4e, 0xbd, 0xd8, 0x20, 0xad, 0xa6, 0x2f, 0x78, 0xe8, 0xaf, 0x92, 0x9b, 0x82,
	0xec, 0xc6, 0x4a, 0xa4, 0x81, 0x35, 0xd2, 0x13, 0x20, 0x53, 0x23, 0xeb, 0x8f, 0x31, 0xb5, 0xed,
	0xc1, 0xa6, 0x6e, 0x31, 0x75, 0x2f, 0x80, 0xe4, 0x7c, 0x74, 0x07, 0x8a, 0x99, 0xce, 0x8c, 0x90,
	0x7d, 0x66, 0xab, 0x98, 0x0d, 0x26, 0x09, 0x5a, 0xaf, 0x09, 0x2e, 0x0b, 0x6d, 0xc7, 0xfb, 0x98,
	0xb3, 0x5f, 0xe3, 0x9c, 0x45, 0xfe, 0x85, 0x7d, 0x89, 0x7c, 0x19, 0xfb, 0x3f, 0xd0, 0x5a, 0x5f,
	0x0e, 0x6c, 0x6b, 0xef, 0x23, 0x8a, 0xd9, 0x28, 0x44, 0x7a, 0x0a, 0x1b, 0xd9, 0x81, 0x29, 0x68,
	0x8c, 0xee, 0x94, 0xab, 0xd4, 0xdd, 0xff, 0x41, 0x5a, 0x38, 0xfe, 0x0d, 0x90, 0xdc, 0x7a, 0xe9,
	0xf1, 0x8a, 0xad, 0xeb, 0xc3, 0xbb, 0xb5, 0xb5, 0x37, 0xa1, 0x6d, 0x20, 0xb9, 0x71, 0x17, 0xda,
	0xd7, 0xd6, 0x6e, 0xe4, 0xaa, 0xfc, 0x5c, 0xf2, 0xfd, 0x33, 0xc1, 0xc3, 0x97, 0x92, 0x7e, 0xa8,
	0xe7, 0xdf, 0x01, 0x00, 0x00, 0xff, 0xff, 0x1c, 0xe1, 0x33, 0xc7, 0xc9, 0x02, 0x00, 0x00,
}
