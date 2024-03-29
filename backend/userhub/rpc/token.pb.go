// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0-devel
// 	protoc        v3.17.1
// source: token.proto

package rpc

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type TokenAuthResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Token string `protobuf:"bytes,1,opt,name=token,proto3" json:"token,omitempty"`
}

func (x *TokenAuthResponse) Reset() {
	*x = TokenAuthResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_token_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TokenAuthResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TokenAuthResponse) ProtoMessage() {}

func (x *TokenAuthResponse) ProtoReflect() protoreflect.Message {
	mi := &file_token_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TokenAuthResponse.ProtoReflect.Descriptor instead.
func (*TokenAuthResponse) Descriptor() ([]byte, []int) {
	return file_token_proto_rawDescGZIP(), []int{0}
}

func (x *TokenAuthResponse) GetToken() string {
	if x != nil {
		return x.Token
	}
	return ""
}

type TokenPostMessageRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	GroupId  string `protobuf:"bytes,1,opt,name=group_id,json=groupId,proto3" json:"group_id,omitempty"`
	FriendId string `protobuf:"bytes,2,opt,name=friend_id,json=friendId,proto3" json:"friend_id,omitempty"`
}

func (x *TokenPostMessageRequest) Reset() {
	*x = TokenPostMessageRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_token_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TokenPostMessageRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TokenPostMessageRequest) ProtoMessage() {}

func (x *TokenPostMessageRequest) ProtoReflect() protoreflect.Message {
	mi := &file_token_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TokenPostMessageRequest.ProtoReflect.Descriptor instead.
func (*TokenPostMessageRequest) Descriptor() ([]byte, []int) {
	return file_token_proto_rawDescGZIP(), []int{1}
}

func (x *TokenPostMessageRequest) GetGroupId() string {
	if x != nil {
		return x.GroupId
	}
	return ""
}

func (x *TokenPostMessageRequest) GetFriendId() string {
	if x != nil {
		return x.FriendId
	}
	return ""
}

type TokenPostMessageResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Tokens     map[string]string `protobuf:"bytes,1,rep,name=tokens,proto3" json:"tokens,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
	MessageKey string            `protobuf:"bytes,2,opt,name=message_key,json=messageKey,proto3" json:"message_key,omitempty"`
}

func (x *TokenPostMessageResponse) Reset() {
	*x = TokenPostMessageResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_token_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TokenPostMessageResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TokenPostMessageResponse) ProtoMessage() {}

func (x *TokenPostMessageResponse) ProtoReflect() protoreflect.Message {
	mi := &file_token_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TokenPostMessageResponse.ProtoReflect.Descriptor instead.
func (*TokenPostMessageResponse) Descriptor() ([]byte, []int) {
	return file_token_proto_rawDescGZIP(), []int{2}
}

func (x *TokenPostMessageResponse) GetTokens() map[string]string {
	if x != nil {
		return x.Tokens
	}
	return nil
}

func (x *TokenPostMessageResponse) GetMessageKey() string {
	if x != nil {
		return x.MessageKey
	}
	return ""
}

type TokenGetMessagesResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Tokens map[string]string `protobuf:"bytes,1,rep,name=tokens,proto3" json:"tokens,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
}

func (x *TokenGetMessagesResponse) Reset() {
	*x = TokenGetMessagesResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_token_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TokenGetMessagesResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TokenGetMessagesResponse) ProtoMessage() {}

func (x *TokenGetMessagesResponse) ProtoReflect() protoreflect.Message {
	mi := &file_token_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TokenGetMessagesResponse.ProtoReflect.Descriptor instead.
func (*TokenGetMessagesResponse) Descriptor() ([]byte, []int) {
	return file_token_proto_rawDescGZIP(), []int{3}
}

func (x *TokenGetMessagesResponse) GetTokens() map[string]string {
	if x != nil {
		return x.Tokens
	}
	return nil
}

type TokenGetPublicMessagesRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	UserId string `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
}

func (x *TokenGetPublicMessagesRequest) Reset() {
	*x = TokenGetPublicMessagesRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_token_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TokenGetPublicMessagesRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TokenGetPublicMessagesRequest) ProtoMessage() {}

func (x *TokenGetPublicMessagesRequest) ProtoReflect() protoreflect.Message {
	mi := &file_token_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TokenGetPublicMessagesRequest.ProtoReflect.Descriptor instead.
func (*TokenGetPublicMessagesRequest) Descriptor() ([]byte, []int) {
	return file_token_proto_rawDescGZIP(), []int{4}
}

func (x *TokenGetPublicMessagesRequest) GetUserId() string {
	if x != nil {
		return x.UserId
	}
	return ""
}

type TokenGetPublicMessagesResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Tokens map[string]string `protobuf:"bytes,1,rep,name=tokens,proto3" json:"tokens,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
}

func (x *TokenGetPublicMessagesResponse) Reset() {
	*x = TokenGetPublicMessagesResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_token_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TokenGetPublicMessagesResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TokenGetPublicMessagesResponse) ProtoMessage() {}

func (x *TokenGetPublicMessagesResponse) ProtoReflect() protoreflect.Message {
	mi := &file_token_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TokenGetPublicMessagesResponse.ProtoReflect.Descriptor instead.
func (*TokenGetPublicMessagesResponse) Descriptor() ([]byte, []int) {
	return file_token_proto_rawDescGZIP(), []int{5}
}

func (x *TokenGetPublicMessagesResponse) GetTokens() map[string]string {
	if x != nil {
		return x.Tokens
	}
	return nil
}

var File_token_proto protoreflect.FileDescriptor

var file_token_proto_rawDesc = []byte{
	0x0a, 0x0b, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x03, 0x72,
	0x70, 0x63, 0x1a, 0x0b, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22,
	0x29, 0x0a, 0x11, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x41, 0x75, 0x74, 0x68, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x14, 0x0a, 0x05, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x05, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x22, 0x51, 0x0a, 0x17, 0x54, 0x6f,
	0x6b, 0x65, 0x6e, 0x50, 0x6f, 0x73, 0x74, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x52, 0x65,
	0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x19, 0x0a, 0x08, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x5f, 0x69,
	0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x49, 0x64,
	0x12, 0x1b, 0x0a, 0x09, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x5f, 0x69, 0x64, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x08, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x49, 0x64, 0x22, 0xb9, 0x01,
	0x0a, 0x18, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x50, 0x6f, 0x73, 0x74, 0x4d, 0x65, 0x73, 0x73, 0x61,
	0x67, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x41, 0x0a, 0x06, 0x74, 0x6f,
	0x6b, 0x65, 0x6e, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x29, 0x2e, 0x72, 0x70, 0x63,
	0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x50, 0x6f, 0x73, 0x74, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67,
	0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x73,
	0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x06, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x73, 0x12, 0x1f, 0x0a,
	0x0b, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x5f, 0x6b, 0x65, 0x79, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0a, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x4b, 0x65, 0x79, 0x1a, 0x39,
	0x0a, 0x0b, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x10, 0x0a,
	0x03, 0x6b, 0x65, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x6b, 0x65, 0x79, 0x12,
	0x14, 0x0a, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05,
	0x76, 0x61, 0x6c, 0x75, 0x65, 0x3a, 0x02, 0x38, 0x01, 0x22, 0x98, 0x01, 0x0a, 0x18, 0x54, 0x6f,
	0x6b, 0x65, 0x6e, 0x47, 0x65, 0x74, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x41, 0x0a, 0x06, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x73,
	0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x29, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x54, 0x6f, 0x6b,
	0x65, 0x6e, 0x47, 0x65, 0x74, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 0x52, 0x65, 0x73,
	0x70, 0x6f, 0x6e, 0x73, 0x65, 0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x73, 0x45, 0x6e, 0x74, 0x72,
	0x79, 0x52, 0x06, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x73, 0x1a, 0x39, 0x0a, 0x0b, 0x54, 0x6f, 0x6b,
	0x65, 0x6e, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x10, 0x0a, 0x03, 0x6b, 0x65, 0x79, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x6b, 0x65, 0x79, 0x12, 0x14, 0x0a, 0x05, 0x76, 0x61,
	0x6c, 0x75, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65,
	0x3a, 0x02, 0x38, 0x01, 0x22, 0x38, 0x0a, 0x1d, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x47, 0x65, 0x74,
	0x50, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 0x52, 0x65,
	0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x17, 0x0a, 0x07, 0x75, 0x73, 0x65, 0x72, 0x5f, 0x69, 0x64,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x22, 0xa4,
	0x01, 0x0a, 0x1e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x47, 0x65, 0x74, 0x50, 0x75, 0x62, 0x6c, 0x69,
	0x63, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73,
	0x65, 0x12, 0x47, 0x0a, 0x06, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28,
	0x0b, 0x32, 0x2f, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x47, 0x65, 0x74,
	0x50, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x73, 0x45, 0x6e, 0x74,
	0x72, 0x79, 0x52, 0x06, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x73, 0x1a, 0x39, 0x0a, 0x0b, 0x54, 0x6f,
	0x6b, 0x65, 0x6e, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x10, 0x0a, 0x03, 0x6b, 0x65, 0x79,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x6b, 0x65, 0x79, 0x12, 0x14, 0x0a, 0x05, 0x76,
	0x61, 0x6c, 0x75, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x76, 0x61, 0x6c, 0x75,
	0x65, 0x3a, 0x02, 0x38, 0x01, 0x32, 0x9e, 0x02, 0x0a, 0x0c, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x53,
	0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x2a, 0x0a, 0x04, 0x41, 0x75, 0x74, 0x68, 0x12, 0x0a,
	0x2e, 0x72, 0x70, 0x63, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x1a, 0x16, 0x2e, 0x72, 0x70, 0x63,
	0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x41, 0x75, 0x74, 0x68, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x12, 0x4a, 0x0a, 0x0b, 0x50, 0x6f, 0x73, 0x74, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67,
	0x65, 0x12, 0x1c, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x50, 0x6f, 0x73,
	0x74, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a,
	0x1d, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x50, 0x6f, 0x73, 0x74, 0x4d,
	0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x38,
	0x0a, 0x0b, 0x47, 0x65, 0x74, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 0x12, 0x0a, 0x2e,
	0x72, 0x70, 0x63, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x1a, 0x1d, 0x2e, 0x72, 0x70, 0x63, 0x2e,
	0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x47, 0x65, 0x74, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x5c, 0x0a, 0x11, 0x47, 0x65, 0x74, 0x50,
	0x75, 0x62, 0x6c, 0x69, 0x63, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 0x12, 0x22, 0x2e,
	0x72, 0x70, 0x63, 0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x47, 0x65, 0x74, 0x50, 0x75, 0x62, 0x6c,
	0x69, 0x63, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x23, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x47, 0x65, 0x74,
	0x50, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x08, 0x5a, 0x06, 0x2e, 0x2e, 0x2f, 0x72, 0x70, 0x63,
	0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_token_proto_rawDescOnce sync.Once
	file_token_proto_rawDescData = file_token_proto_rawDesc
)

func file_token_proto_rawDescGZIP() []byte {
	file_token_proto_rawDescOnce.Do(func() {
		file_token_proto_rawDescData = protoimpl.X.CompressGZIP(file_token_proto_rawDescData)
	})
	return file_token_proto_rawDescData
}

var file_token_proto_msgTypes = make([]protoimpl.MessageInfo, 9)
var file_token_proto_goTypes = []interface{}{
	(*TokenAuthResponse)(nil),              // 0: rpc.TokenAuthResponse
	(*TokenPostMessageRequest)(nil),        // 1: rpc.TokenPostMessageRequest
	(*TokenPostMessageResponse)(nil),       // 2: rpc.TokenPostMessageResponse
	(*TokenGetMessagesResponse)(nil),       // 3: rpc.TokenGetMessagesResponse
	(*TokenGetPublicMessagesRequest)(nil),  // 4: rpc.TokenGetPublicMessagesRequest
	(*TokenGetPublicMessagesResponse)(nil), // 5: rpc.TokenGetPublicMessagesResponse
	nil,                                    // 6: rpc.TokenPostMessageResponse.TokensEntry
	nil,                                    // 7: rpc.TokenGetMessagesResponse.TokensEntry
	nil,                                    // 8: rpc.TokenGetPublicMessagesResponse.TokensEntry
	(*Empty)(nil),                          // 9: rpc.Empty
}
var file_token_proto_depIdxs = []int32{
	6, // 0: rpc.TokenPostMessageResponse.tokens:type_name -> rpc.TokenPostMessageResponse.TokensEntry
	7, // 1: rpc.TokenGetMessagesResponse.tokens:type_name -> rpc.TokenGetMessagesResponse.TokensEntry
	8, // 2: rpc.TokenGetPublicMessagesResponse.tokens:type_name -> rpc.TokenGetPublicMessagesResponse.TokensEntry
	9, // 3: rpc.TokenService.Auth:input_type -> rpc.Empty
	1, // 4: rpc.TokenService.PostMessage:input_type -> rpc.TokenPostMessageRequest
	9, // 5: rpc.TokenService.GetMessages:input_type -> rpc.Empty
	4, // 6: rpc.TokenService.GetPublicMessages:input_type -> rpc.TokenGetPublicMessagesRequest
	0, // 7: rpc.TokenService.Auth:output_type -> rpc.TokenAuthResponse
	2, // 8: rpc.TokenService.PostMessage:output_type -> rpc.TokenPostMessageResponse
	3, // 9: rpc.TokenService.GetMessages:output_type -> rpc.TokenGetMessagesResponse
	5, // 10: rpc.TokenService.GetPublicMessages:output_type -> rpc.TokenGetPublicMessagesResponse
	7, // [7:11] is the sub-list for method output_type
	3, // [3:7] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_token_proto_init() }
func file_token_proto_init() {
	if File_token_proto != nil {
		return
	}
	file_model_proto_init()
	if !protoimpl.UnsafeEnabled {
		file_token_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TokenAuthResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_token_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TokenPostMessageRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_token_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TokenPostMessageResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_token_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TokenGetMessagesResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_token_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TokenGetPublicMessagesRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_token_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TokenGetPublicMessagesResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_token_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   9,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_token_proto_goTypes,
		DependencyIndexes: file_token_proto_depIdxs,
		MessageInfos:      file_token_proto_msgTypes,
	}.Build()
	File_token_proto = out.File
	file_token_proto_rawDesc = nil
	file_token_proto_goTypes = nil
	file_token_proto_depIdxs = nil
}
