// Code generated by protoc-gen-twirp v8.0.0, DO NOT EDIT.
// source: messagehub_internal.proto

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

// ===================================
// MessageHubInternalService Interface
// ===================================

type MessageHubInternalService interface {
	PostNotifications(context.Context, *MessageHubInternalPostNotificationsRequest) (*Empty, error)

	ExpirationDays(context.Context, *Empty) (*MessageHubInternalExpirationDaysResponse, error)

	SetUserAsPublic(context.Context, *MessageSetUserAsPublicRequest) (*Empty, error)
}

// =========================================
// MessageHubInternalService Protobuf Client
// =========================================

type messageHubInternalServiceProtobufClient struct {
	client      HTTPClient
	urls        [3]string
	interceptor twirp.Interceptor
	opts        twirp.ClientOptions
}

// NewMessageHubInternalServiceProtobufClient creates a Protobuf client that implements the MessageHubInternalService interface.
// It communicates using Protobuf and can be configured with a custom HTTPClient.
func NewMessageHubInternalServiceProtobufClient(baseURL string, client HTTPClient, opts ...twirp.ClientOption) MessageHubInternalService {
	if c, ok := client.(*http.Client); ok {
		client = withoutRedirects(c)
	}

	clientOpts := twirp.ClientOptions{}
	for _, o := range opts {
		o(&clientOpts)
	}

	// Build method URLs: <baseURL>[<prefix>]/<package>.<Service>/<Method>
	serviceURL := sanitizeBaseURL(baseURL)
	serviceURL += baseServicePath(clientOpts.PathPrefix(), "rpc", "MessageHubInternalService")
	urls := [3]string{
		serviceURL + "PostNotifications",
		serviceURL + "ExpirationDays",
		serviceURL + "SetUserAsPublic",
	}

	return &messageHubInternalServiceProtobufClient{
		client:      client,
		urls:        urls,
		interceptor: twirp.ChainInterceptors(clientOpts.Interceptors...),
		opts:        clientOpts,
	}
}

func (c *messageHubInternalServiceProtobufClient) PostNotifications(ctx context.Context, in *MessageHubInternalPostNotificationsRequest) (*Empty, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "MessageHubInternalService")
	ctx = ctxsetters.WithMethodName(ctx, "PostNotifications")
	caller := c.callPostNotifications
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *MessageHubInternalPostNotificationsRequest) (*Empty, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*MessageHubInternalPostNotificationsRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*MessageHubInternalPostNotificationsRequest) when calling interceptor")
					}
					return c.callPostNotifications(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*Empty)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*Empty) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *messageHubInternalServiceProtobufClient) callPostNotifications(ctx context.Context, in *MessageHubInternalPostNotificationsRequest) (*Empty, error) {
	out := new(Empty)
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

func (c *messageHubInternalServiceProtobufClient) ExpirationDays(ctx context.Context, in *Empty) (*MessageHubInternalExpirationDaysResponse, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "MessageHubInternalService")
	ctx = ctxsetters.WithMethodName(ctx, "ExpirationDays")
	caller := c.callExpirationDays
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *Empty) (*MessageHubInternalExpirationDaysResponse, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return c.callExpirationDays(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*MessageHubInternalExpirationDaysResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*MessageHubInternalExpirationDaysResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *messageHubInternalServiceProtobufClient) callExpirationDays(ctx context.Context, in *Empty) (*MessageHubInternalExpirationDaysResponse, error) {
	out := new(MessageHubInternalExpirationDaysResponse)
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

func (c *messageHubInternalServiceProtobufClient) SetUserAsPublic(ctx context.Context, in *MessageSetUserAsPublicRequest) (*Empty, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "MessageHubInternalService")
	ctx = ctxsetters.WithMethodName(ctx, "SetUserAsPublic")
	caller := c.callSetUserAsPublic
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *MessageSetUserAsPublicRequest) (*Empty, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*MessageSetUserAsPublicRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*MessageSetUserAsPublicRequest) when calling interceptor")
					}
					return c.callSetUserAsPublic(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*Empty)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*Empty) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *messageHubInternalServiceProtobufClient) callSetUserAsPublic(ctx context.Context, in *MessageSetUserAsPublicRequest) (*Empty, error) {
	out := new(Empty)
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

// =====================================
// MessageHubInternalService JSON Client
// =====================================

type messageHubInternalServiceJSONClient struct {
	client      HTTPClient
	urls        [3]string
	interceptor twirp.Interceptor
	opts        twirp.ClientOptions
}

// NewMessageHubInternalServiceJSONClient creates a JSON client that implements the MessageHubInternalService interface.
// It communicates using JSON and can be configured with a custom HTTPClient.
func NewMessageHubInternalServiceJSONClient(baseURL string, client HTTPClient, opts ...twirp.ClientOption) MessageHubInternalService {
	if c, ok := client.(*http.Client); ok {
		client = withoutRedirects(c)
	}

	clientOpts := twirp.ClientOptions{}
	for _, o := range opts {
		o(&clientOpts)
	}

	// Build method URLs: <baseURL>[<prefix>]/<package>.<Service>/<Method>
	serviceURL := sanitizeBaseURL(baseURL)
	serviceURL += baseServicePath(clientOpts.PathPrefix(), "rpc", "MessageHubInternalService")
	urls := [3]string{
		serviceURL + "PostNotifications",
		serviceURL + "ExpirationDays",
		serviceURL + "SetUserAsPublic",
	}

	return &messageHubInternalServiceJSONClient{
		client:      client,
		urls:        urls,
		interceptor: twirp.ChainInterceptors(clientOpts.Interceptors...),
		opts:        clientOpts,
	}
}

func (c *messageHubInternalServiceJSONClient) PostNotifications(ctx context.Context, in *MessageHubInternalPostNotificationsRequest) (*Empty, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "MessageHubInternalService")
	ctx = ctxsetters.WithMethodName(ctx, "PostNotifications")
	caller := c.callPostNotifications
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *MessageHubInternalPostNotificationsRequest) (*Empty, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*MessageHubInternalPostNotificationsRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*MessageHubInternalPostNotificationsRequest) when calling interceptor")
					}
					return c.callPostNotifications(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*Empty)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*Empty) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *messageHubInternalServiceJSONClient) callPostNotifications(ctx context.Context, in *MessageHubInternalPostNotificationsRequest) (*Empty, error) {
	out := new(Empty)
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

func (c *messageHubInternalServiceJSONClient) ExpirationDays(ctx context.Context, in *Empty) (*MessageHubInternalExpirationDaysResponse, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "MessageHubInternalService")
	ctx = ctxsetters.WithMethodName(ctx, "ExpirationDays")
	caller := c.callExpirationDays
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *Empty) (*MessageHubInternalExpirationDaysResponse, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return c.callExpirationDays(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*MessageHubInternalExpirationDaysResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*MessageHubInternalExpirationDaysResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *messageHubInternalServiceJSONClient) callExpirationDays(ctx context.Context, in *Empty) (*MessageHubInternalExpirationDaysResponse, error) {
	out := new(MessageHubInternalExpirationDaysResponse)
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

func (c *messageHubInternalServiceJSONClient) SetUserAsPublic(ctx context.Context, in *MessageSetUserAsPublicRequest) (*Empty, error) {
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "MessageHubInternalService")
	ctx = ctxsetters.WithMethodName(ctx, "SetUserAsPublic")
	caller := c.callSetUserAsPublic
	if c.interceptor != nil {
		caller = func(ctx context.Context, req *MessageSetUserAsPublicRequest) (*Empty, error) {
			resp, err := c.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*MessageSetUserAsPublicRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*MessageSetUserAsPublicRequest) when calling interceptor")
					}
					return c.callSetUserAsPublic(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*Empty)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*Empty) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}
	return caller(ctx, in)
}

func (c *messageHubInternalServiceJSONClient) callSetUserAsPublic(ctx context.Context, in *MessageSetUserAsPublicRequest) (*Empty, error) {
	out := new(Empty)
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

// ========================================
// MessageHubInternalService Server Handler
// ========================================

type messageHubInternalServiceServer struct {
	MessageHubInternalService
	interceptor      twirp.Interceptor
	hooks            *twirp.ServerHooks
	pathPrefix       string // prefix for routing
	jsonSkipDefaults bool   // do not include unpopulated fields (default values) in the response
}

// NewMessageHubInternalServiceServer builds a TwirpServer that can be used as an http.Handler to handle
// HTTP requests that are routed to the right method in the provided svc implementation.
// The opts are twirp.ServerOption modifiers, for example twirp.WithServerHooks(hooks).
func NewMessageHubInternalServiceServer(svc MessageHubInternalService, opts ...interface{}) TwirpServer {
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
			panic(fmt.Sprintf("Invalid option type %T on NewMessageHubInternalServiceServer", o))
		}
	}

	return &messageHubInternalServiceServer{
		MessageHubInternalService: svc,
		pathPrefix:                serverOpts.PathPrefix(),
		interceptor:               twirp.ChainInterceptors(serverOpts.Interceptors...),
		hooks:                     serverOpts.Hooks,
		jsonSkipDefaults:          serverOpts.JSONSkipDefaults,
	}
}

// writeError writes an HTTP response with a valid Twirp error format, and triggers hooks.
// If err is not a twirp.Error, it will get wrapped with twirp.InternalErrorWith(err)
func (s *messageHubInternalServiceServer) writeError(ctx context.Context, resp http.ResponseWriter, err error) {
	writeError(ctx, resp, err, s.hooks)
}

// handleRequestBodyError is used to handle error when the twirp server cannot read request
func (s *messageHubInternalServiceServer) handleRequestBodyError(ctx context.Context, resp http.ResponseWriter, msg string, err error) {
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

// MessageHubInternalServicePathPrefix is a convenience constant that could used to identify URL paths.
// Should be used with caution, it only matches routes generated by Twirp Go clients,
// that add a "/twirp" prefix by default, and use CamelCase service and method names.
// More info: https://twitchtv.github.io/twirp/docs/routing.html
const MessageHubInternalServicePathPrefix = "/twirp/rpc.MessageHubInternalService/"

func (s *messageHubInternalServiceServer) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	ctx = ctxsetters.WithPackageName(ctx, "rpc")
	ctx = ctxsetters.WithServiceName(ctx, "MessageHubInternalService")
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
	if pkgService != "rpc.MessageHubInternalService" {
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
	case "PostNotifications":
		s.servePostNotifications(ctx, resp, req)
		return
	case "ExpirationDays":
		s.serveExpirationDays(ctx, resp, req)
		return
	case "SetUserAsPublic":
		s.serveSetUserAsPublic(ctx, resp, req)
		return
	default:
		msg := fmt.Sprintf("no handler for path %q", req.URL.Path)
		s.writeError(ctx, resp, badRouteError(msg, req.Method, req.URL.Path))
		return
	}
}

func (s *messageHubInternalServiceServer) servePostNotifications(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	header := req.Header.Get("Content-Type")
	i := strings.Index(header, ";")
	if i == -1 {
		i = len(header)
	}
	switch strings.TrimSpace(strings.ToLower(header[:i])) {
	case "application/json":
		s.servePostNotificationsJSON(ctx, resp, req)
	case "application/protobuf":
		s.servePostNotificationsProtobuf(ctx, resp, req)
	default:
		msg := fmt.Sprintf("unexpected Content-Type: %q", req.Header.Get("Content-Type"))
		twerr := badRouteError(msg, req.Method, req.URL.Path)
		s.writeError(ctx, resp, twerr)
	}
}

func (s *messageHubInternalServiceServer) servePostNotificationsJSON(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "PostNotifications")
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
	reqContent := new(MessageHubInternalPostNotificationsRequest)
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}
	if err = unmarshaler.Unmarshal(rawReqBody, reqContent); err != nil {
		s.handleRequestBodyError(ctx, resp, "the json request could not be decoded", err)
		return
	}

	handler := s.MessageHubInternalService.PostNotifications
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *MessageHubInternalPostNotificationsRequest) (*Empty, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*MessageHubInternalPostNotificationsRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*MessageHubInternalPostNotificationsRequest) when calling interceptor")
					}
					return s.MessageHubInternalService.PostNotifications(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*Empty)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*Empty) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *Empty
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *Empty and nil error while calling PostNotifications. nil responses are not supported"))
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

func (s *messageHubInternalServiceServer) servePostNotificationsProtobuf(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "PostNotifications")
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
	reqContent := new(MessageHubInternalPostNotificationsRequest)
	if err = proto.Unmarshal(buf, reqContent); err != nil {
		s.writeError(ctx, resp, malformedRequestError("the protobuf request could not be decoded"))
		return
	}

	handler := s.MessageHubInternalService.PostNotifications
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *MessageHubInternalPostNotificationsRequest) (*Empty, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*MessageHubInternalPostNotificationsRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*MessageHubInternalPostNotificationsRequest) when calling interceptor")
					}
					return s.MessageHubInternalService.PostNotifications(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*Empty)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*Empty) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *Empty
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *Empty and nil error while calling PostNotifications. nil responses are not supported"))
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

func (s *messageHubInternalServiceServer) serveExpirationDays(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	header := req.Header.Get("Content-Type")
	i := strings.Index(header, ";")
	if i == -1 {
		i = len(header)
	}
	switch strings.TrimSpace(strings.ToLower(header[:i])) {
	case "application/json":
		s.serveExpirationDaysJSON(ctx, resp, req)
	case "application/protobuf":
		s.serveExpirationDaysProtobuf(ctx, resp, req)
	default:
		msg := fmt.Sprintf("unexpected Content-Type: %q", req.Header.Get("Content-Type"))
		twerr := badRouteError(msg, req.Method, req.URL.Path)
		s.writeError(ctx, resp, twerr)
	}
}

func (s *messageHubInternalServiceServer) serveExpirationDaysJSON(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "ExpirationDays")
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

	handler := s.MessageHubInternalService.ExpirationDays
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *Empty) (*MessageHubInternalExpirationDaysResponse, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return s.MessageHubInternalService.ExpirationDays(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*MessageHubInternalExpirationDaysResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*MessageHubInternalExpirationDaysResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *MessageHubInternalExpirationDaysResponse
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *MessageHubInternalExpirationDaysResponse and nil error while calling ExpirationDays. nil responses are not supported"))
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

func (s *messageHubInternalServiceServer) serveExpirationDaysProtobuf(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "ExpirationDays")
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

	handler := s.MessageHubInternalService.ExpirationDays
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *Empty) (*MessageHubInternalExpirationDaysResponse, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*Empty)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*Empty) when calling interceptor")
					}
					return s.MessageHubInternalService.ExpirationDays(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*MessageHubInternalExpirationDaysResponse)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*MessageHubInternalExpirationDaysResponse) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *MessageHubInternalExpirationDaysResponse
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *MessageHubInternalExpirationDaysResponse and nil error while calling ExpirationDays. nil responses are not supported"))
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

func (s *messageHubInternalServiceServer) serveSetUserAsPublic(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	header := req.Header.Get("Content-Type")
	i := strings.Index(header, ";")
	if i == -1 {
		i = len(header)
	}
	switch strings.TrimSpace(strings.ToLower(header[:i])) {
	case "application/json":
		s.serveSetUserAsPublicJSON(ctx, resp, req)
	case "application/protobuf":
		s.serveSetUserAsPublicProtobuf(ctx, resp, req)
	default:
		msg := fmt.Sprintf("unexpected Content-Type: %q", req.Header.Get("Content-Type"))
		twerr := badRouteError(msg, req.Method, req.URL.Path)
		s.writeError(ctx, resp, twerr)
	}
}

func (s *messageHubInternalServiceServer) serveSetUserAsPublicJSON(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "SetUserAsPublic")
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
	reqContent := new(MessageSetUserAsPublicRequest)
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}
	if err = unmarshaler.Unmarshal(rawReqBody, reqContent); err != nil {
		s.handleRequestBodyError(ctx, resp, "the json request could not be decoded", err)
		return
	}

	handler := s.MessageHubInternalService.SetUserAsPublic
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *MessageSetUserAsPublicRequest) (*Empty, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*MessageSetUserAsPublicRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*MessageSetUserAsPublicRequest) when calling interceptor")
					}
					return s.MessageHubInternalService.SetUserAsPublic(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*Empty)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*Empty) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *Empty
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *Empty and nil error while calling SetUserAsPublic. nil responses are not supported"))
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

func (s *messageHubInternalServiceServer) serveSetUserAsPublicProtobuf(ctx context.Context, resp http.ResponseWriter, req *http.Request) {
	var err error
	ctx = ctxsetters.WithMethodName(ctx, "SetUserAsPublic")
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
	reqContent := new(MessageSetUserAsPublicRequest)
	if err = proto.Unmarshal(buf, reqContent); err != nil {
		s.writeError(ctx, resp, malformedRequestError("the protobuf request could not be decoded"))
		return
	}

	handler := s.MessageHubInternalService.SetUserAsPublic
	if s.interceptor != nil {
		handler = func(ctx context.Context, req *MessageSetUserAsPublicRequest) (*Empty, error) {
			resp, err := s.interceptor(
				func(ctx context.Context, req interface{}) (interface{}, error) {
					typedReq, ok := req.(*MessageSetUserAsPublicRequest)
					if !ok {
						return nil, twirp.InternalError("failed type assertion req.(*MessageSetUserAsPublicRequest) when calling interceptor")
					}
					return s.MessageHubInternalService.SetUserAsPublic(ctx, typedReq)
				},
			)(ctx, req)
			if resp != nil {
				typedResp, ok := resp.(*Empty)
				if !ok {
					return nil, twirp.InternalError("failed type assertion resp.(*Empty) when calling interceptor")
				}
				return typedResp, err
			}
			return nil, err
		}
	}

	// Call service method
	var respContent *Empty
	func() {
		defer ensurePanicResponses(ctx, resp, s.hooks)
		respContent, err = handler(ctx, reqContent)
	}()

	if err != nil {
		s.writeError(ctx, resp, err)
		return
	}
	if respContent == nil {
		s.writeError(ctx, resp, twirp.InternalError("received a nil *Empty and nil error while calling SetUserAsPublic. nil responses are not supported"))
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

func (s *messageHubInternalServiceServer) ServiceDescriptor() ([]byte, int) {
	return twirpFileDescriptor5, 0
}

func (s *messageHubInternalServiceServer) ProtocGenTwirpVersion() string {
	return "v8.0.0"
}

// PathPrefix returns the base service path, in the form: "/<prefix>/<package>.<Service>/"
// that is everything in a Twirp route except for the <Method>. This can be used for routing,
// for example to identify the requests that are targeted to this service in a mux.
func (s *messageHubInternalServiceServer) PathPrefix() string {
	return baseServicePath(s.pathPrefix, "rpc", "MessageHubInternalService")
}

var twirpFileDescriptor5 = []byte{
	// 298 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x8c, 0x92, 0x51, 0x4b, 0xfb, 0x30,
	0x14, 0xc5, 0xe9, 0xff, 0x8f, 0x73, 0xbb, 0xe2, 0x86, 0x79, 0x71, 0x9b, 0x08, 0xa3, 0x08, 0x0e,
	0xc1, 0x0e, 0xf4, 0x13, 0x4c, 0x1c, 0x38, 0x44, 0x29, 0x29, 0x7b, 0xf1, 0xa5, 0xb4, 0xe9, 0x55,
	0x03, 0x6b, 0x13, 0x73, 0x53, 0xb1, 0x1f, 0x5e, 0x10, 0xbb, 0x2a, 0xad, 0x75, 0xe0, 0x63, 0xce,
	0x3d, 0xe7, 0x70, 0xf8, 0x11, 0x18, 0xa5, 0x48, 0x14, 0x3d, 0xe1, 0x73, 0x1e, 0x87, 0x32, 0xb3,
	0x68, 0xb2, 0x68, 0xed, 0x69, 0xa3, 0xac, 0x62, 0xff, 0x8d, 0x16, 0xe3, 0xbd, 0x54, 0x25, 0x58,
	0x29, 0x2e, 0x87, 0xb3, 0xbb, 0x8d, 0xfd, 0x26, 0x8f, 0x97, 0x95, 0xdb, 0x57, 0x64, 0xef, 0x95,
	0x95, 0x8f, 0x52, 0x44, 0x56, 0xaa, 0x8c, 0x38, 0xbe, 0xe4, 0x48, 0x96, 0x9d, 0xc0, 0x7e, 0x56,
	0xd7, 0x87, 0xce, 0xc4, 0x99, 0xf6, 0x78, 0x53, 0x74, 0x03, 0x98, 0xb6, 0x3b, 0x17, 0x6f, 0x5a,
	0x9a, 0xd2, 0x70, 0x1d, 0x15, 0xc4, 0x91, 0xb4, 0xca, 0x08, 0xd9, 0x29, 0x0c, 0xf0, 0xfb, 0x12,
	0x26, 0x51, 0xb1, 0xe9, 0xdc, 0xe1, 0x7d, 0x6c, 0x04, 0xdc, 0x15, 0x1c, 0x57, 0xa5, 0x01, 0xda,
	0x15, 0xa1, 0x99, 0x93, 0x9f, 0xc7, 0x6b, 0x29, 0xbe, 0xb6, 0x1d, 0xc2, 0x6e, 0x4e, 0x68, 0x42,
	0x99, 0x54, 0xab, 0x3a, 0x9f, 0xcf, 0x65, 0xc2, 0x8e, 0xa0, 0x27, 0x29, 0xd4, 0xa5, 0x79, 0xf8,
	0x6f, 0xe2, 0x4c, 0xbb, 0xbc, 0x2b, 0xab, 0xf0, 0xc5, 0xbb, 0x03, 0xa3, 0xf6, 0xd8, 0x00, 0xcd,
	0xab, 0x14, 0xc8, 0x7c, 0x38, 0x68, 0xb1, 0x60, 0x33, 0xcf, 0x68, 0xe1, 0xfd, 0x9d, 0xda, 0x18,
	0xca, 0xc0, 0x22, 0xd5, 0xb6, 0x60, 0xb7, 0xd0, 0x6f, 0x92, 0x60, 0xb5, 0xeb, 0xf8, 0x7c, 0x4b,
	0xf5, 0x16, 0x78, 0x73, 0x18, 0xfc, 0x80, 0xc1, 0xdc, 0x7a, 0xc3, 0xef, 0xa4, 0xea, 0x7b, 0xae,
	0xba, 0x0f, 0x1d, 0xcf, 0x9b, 0x19, 0x2d, 0xe2, 0x4e, 0xf9, 0x21, 0x2e, 0x3f, 0x02, 0x00, 0x00,
	0xff, 0xff, 0x17, 0xf8, 0x7c, 0x0a, 0x3f, 0x02, 0x00, 0x00,
}
