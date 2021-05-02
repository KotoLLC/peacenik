// Code generated by protoc-gen-twirp v7.2.0, DO NOT EDIT.
// source: messagehub_internal.proto

package rpc

import bytes "bytes"
import strings "strings"
import context "context"
import fmt "fmt"
import ioutil "io/ioutil"
import http "net/http"
import strconv "strconv"

import jsonpb "github.com/golang/protobuf/jsonpb"
import proto "github.com/golang/protobuf/proto"
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
}

// =========================================
// MessageHubInternalService Protobuf Client
// =========================================

type messageHubInternalServiceProtobufClient struct {
	client      HTTPClient
	urls        [2]string
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
	urls := [2]string{
		serviceURL + "PostNotifications",
		serviceURL + "ExpirationDays",
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

// =====================================
// MessageHubInternalService JSON Client
// =====================================

type messageHubInternalServiceJSONClient struct {
	client      HTTPClient
	urls        [2]string
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
	urls := [2]string{
		serviceURL + "PostNotifications",
		serviceURL + "ExpirationDays",
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

	reqContent := new(MessageHubInternalPostNotificationsRequest)
	unmarshaler := jsonpb.Unmarshaler{AllowUnknownFields: true}
	if err = unmarshaler.Unmarshal(req.Body, reqContent); err != nil {
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

	var buf bytes.Buffer
	marshaler := &jsonpb.Marshaler{OrigName: true, EmitDefaults: !s.jsonSkipDefaults}
	if err = marshaler.Marshal(&buf, respContent); err != nil {
		s.writeError(ctx, resp, wrapInternal(err, "failed to marshal json response"))
		return
	}

	ctx = ctxsetters.WithStatusCode(ctx, http.StatusOK)
	respBytes := buf.Bytes()
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

	reqContent := new(Empty)
	unmarshaler := jsonpb.Unmarshaler{AllowUnknownFields: true}
	if err = unmarshaler.Unmarshal(req.Body, reqContent); err != nil {
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

	var buf bytes.Buffer
	marshaler := &jsonpb.Marshaler{OrigName: true, EmitDefaults: !s.jsonSkipDefaults}
	if err = marshaler.Marshal(&buf, respContent); err != nil {
		s.writeError(ctx, resp, wrapInternal(err, "failed to marshal json response"))
		return
	}

	ctx = ctxsetters.WithStatusCode(ctx, http.StatusOK)
	respBytes := buf.Bytes()
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

func (s *messageHubInternalServiceServer) ServiceDescriptor() ([]byte, int) {
	return twirpFileDescriptor5, 0
}

func (s *messageHubInternalServiceServer) ProtocGenTwirpVersion() string {
	return "v7.2.0"
}

// PathPrefix returns the base service path, in the form: "/<prefix>/<package>.<Service>/"
// that is everything in a Twirp route except for the <Method>. This can be used for routing,
// for example to identify the requests that are targeted to this service in a mux.
func (s *messageHubInternalServiceServer) PathPrefix() string {
	return baseServicePath(s.pathPrefix, "rpc", "MessageHubInternalService")
}

var twirpFileDescriptor5 = []byte{
	// 232 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x92, 0xcc, 0x4d, 0x2d, 0x2e,
	0x4e, 0x4c, 0x4f, 0xcd, 0x28, 0x4d, 0x8a, 0xcf, 0xcc, 0x2b, 0x49, 0x2d, 0xca, 0x4b, 0xcc, 0xd1,
	0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17, 0x62, 0x2e, 0x2a, 0x48, 0x96, 0xe2, 0xce, 0xcd, 0x4f, 0x49,
	0x85, 0x8a, 0x28, 0x05, 0x71, 0x69, 0xf9, 0x42, 0x94, 0x7b, 0x94, 0x26, 0x79, 0x42, 0x55, 0x07,
	0xe4, 0x17, 0x97, 0xf8, 0xe5, 0x97, 0x64, 0xa6, 0x65, 0x26, 0x27, 0x96, 0x64, 0xe6, 0xe7, 0x15,
	0x07, 0xa5, 0x16, 0x96, 0xa6, 0x16, 0x97, 0x08, 0xa9, 0x70, 0xf1, 0xe6, 0x21, 0x8b, 0x4b, 0x30,
	0x2a, 0x30, 0x6a, 0x70, 0x06, 0xa1, 0x0a, 0x2a, 0x05, 0x73, 0x69, 0x60, 0x9a, 0xe9, 0x5a, 0x51,
	0x90, 0x59, 0x04, 0x56, 0xe0, 0x92, 0x58, 0x59, 0x1c, 0x94, 0x5a, 0x5c, 0x90, 0x9f, 0x57, 0x9c,
	0x2a, 0xa4, 0xce, 0xc5, 0x9f, 0x0a, 0x97, 0x89, 0x4f, 0x49, 0xac, 0x84, 0x98, 0xc9, 0x1a, 0xc4,
	0x97, 0x8a, 0xa2, 0xc1, 0x68, 0x17, 0x23, 0x97, 0x24, 0xa6, 0xa9, 0xc1, 0xa9, 0x45, 0x65, 0x99,
	0xc9, 0xa9, 0x42, 0x01, 0x5c, 0x82, 0x18, 0x8e, 0x16, 0xd2, 0xd7, 0x2b, 0x2a, 0x48, 0xd6, 0x23,
	0xde, 0x7b, 0x52, 0x5c, 0x60, 0x0d, 0xae, 0xb9, 0x05, 0x25, 0x95, 0x42, 0xde, 0x5c, 0x7c, 0xa8,
	0x4e, 0x16, 0x42, 0x92, 0x95, 0xd2, 0xc5, 0x61, 0x34, 0x76, 0x5f, 0x3a, 0x71, 0x44, 0xb1, 0xe9,
	0xe9, 0xe9, 0x17, 0x15, 0x24, 0x27, 0xb1, 0x81, 0x83, 0xdd, 0x18, 0x10, 0x00, 0x00, 0xff, 0xff,
	0xcd, 0xd9, 0xe8, 0xee, 0xa5, 0x01, 0x00, 0x00,
}
