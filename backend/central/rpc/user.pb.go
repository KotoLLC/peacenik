// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.23.0
// 	protoc        v3.12.3
// source: user.proto

package rpc

import (
	proto "github.com/golang/protobuf/proto"
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

// This is a compile-time assertion that a sufficiently up-to-date version
// of the legacy proto package is being used.
const _ = proto.ProtoPackageIsVersion4

type UserFriendsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Friends []*User `protobuf:"bytes,1,rep,name=friends,proto3" json:"friends,omitempty"`
}

func (x *UserFriendsResponse) Reset() {
	*x = UserFriendsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_user_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *UserFriendsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UserFriendsResponse) ProtoMessage() {}

func (x *UserFriendsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_user_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UserFriendsResponse.ProtoReflect.Descriptor instead.
func (*UserFriendsResponse) Descriptor() ([]byte, []int) {
	return file_user_proto_rawDescGZIP(), []int{0}
}

func (x *UserFriendsResponse) GetFriends() []*User {
	if x != nil {
		return x.Friends
	}
	return nil
}

type UserFriendsOfFriendsResponseFriend struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	User    *User   `protobuf:"bytes,1,opt,name=user,proto3" json:"user,omitempty"`
	Friends []*User `protobuf:"bytes,2,rep,name=friends,proto3" json:"friends,omitempty"`
}

func (x *UserFriendsOfFriendsResponseFriend) Reset() {
	*x = UserFriendsOfFriendsResponseFriend{}
	if protoimpl.UnsafeEnabled {
		mi := &file_user_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *UserFriendsOfFriendsResponseFriend) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UserFriendsOfFriendsResponseFriend) ProtoMessage() {}

func (x *UserFriendsOfFriendsResponseFriend) ProtoReflect() protoreflect.Message {
	mi := &file_user_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UserFriendsOfFriendsResponseFriend.ProtoReflect.Descriptor instead.
func (*UserFriendsOfFriendsResponseFriend) Descriptor() ([]byte, []int) {
	return file_user_proto_rawDescGZIP(), []int{1}
}

func (x *UserFriendsOfFriendsResponseFriend) GetUser() *User {
	if x != nil {
		return x.User
	}
	return nil
}

func (x *UserFriendsOfFriendsResponseFriend) GetFriends() []*User {
	if x != nil {
		return x.Friends
	}
	return nil
}

type UserFriendsOfFriendsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Friends []*UserFriendsOfFriendsResponseFriend `protobuf:"bytes,1,rep,name=friends,proto3" json:"friends,omitempty"`
}

func (x *UserFriendsOfFriendsResponse) Reset() {
	*x = UserFriendsOfFriendsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_user_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *UserFriendsOfFriendsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UserFriendsOfFriendsResponse) ProtoMessage() {}

func (x *UserFriendsOfFriendsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_user_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UserFriendsOfFriendsResponse.ProtoReflect.Descriptor instead.
func (*UserFriendsOfFriendsResponse) Descriptor() ([]byte, []int) {
	return file_user_proto_rawDescGZIP(), []int{2}
}

func (x *UserFriendsOfFriendsResponse) GetFriends() []*UserFriendsOfFriendsResponseFriend {
	if x != nil {
		return x.Friends
	}
	return nil
}

var File_user_proto protoreflect.FileDescriptor

var file_user_proto_rawDesc = []byte{
	0x0a, 0x0a, 0x75, 0x73, 0x65, 0x72, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x03, 0x72, 0x70,
	0x63, 0x1a, 0x0b, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x3a,
	0x0a, 0x13, 0x55, 0x73, 0x65, 0x72, 0x46, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x52, 0x65, 0x73,
	0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x23, 0x0a, 0x07, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73,
	0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x09, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x55, 0x73, 0x65,
	0x72, 0x52, 0x07, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x22, 0x68, 0x0a, 0x22, 0x55, 0x73,
	0x65, 0x72, 0x46, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x4f, 0x66, 0x46, 0x72, 0x69, 0x65, 0x6e,
	0x64, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x46, 0x72, 0x69, 0x65, 0x6e, 0x64,
	0x12, 0x1d, 0x0a, 0x04, 0x75, 0x73, 0x65, 0x72, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x09,
	0x2e, 0x72, 0x70, 0x63, 0x2e, 0x55, 0x73, 0x65, 0x72, 0x52, 0x04, 0x75, 0x73, 0x65, 0x72, 0x12,
	0x23, 0x0a, 0x07, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x18, 0x02, 0x20, 0x03, 0x28, 0x0b,
	0x32, 0x09, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x55, 0x73, 0x65, 0x72, 0x52, 0x07, 0x66, 0x72, 0x69,
	0x65, 0x6e, 0x64, 0x73, 0x22, 0x61, 0x0a, 0x1c, 0x55, 0x73, 0x65, 0x72, 0x46, 0x72, 0x69, 0x65,
	0x6e, 0x64, 0x73, 0x4f, 0x66, 0x46, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x41, 0x0a, 0x07, 0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x18,
	0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x27, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x55, 0x73, 0x65, 0x72,
	0x46, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x4f, 0x66, 0x46, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x46, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x52, 0x07,
	0x66, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x32, 0x81, 0x01, 0x0a, 0x0b, 0x55, 0x73, 0x65, 0x72,
	0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x2f, 0x0a, 0x07, 0x46, 0x72, 0x69, 0x65, 0x6e,
	0x64, 0x73, 0x12, 0x0a, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x1a, 0x18,
	0x2e, 0x72, 0x70, 0x63, 0x2e, 0x55, 0x73, 0x65, 0x72, 0x46, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x41, 0x0a, 0x10, 0x46, 0x72, 0x69, 0x65,
	0x6e, 0x64, 0x73, 0x4f, 0x66, 0x46, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x12, 0x0a, 0x2e, 0x72,
	0x70, 0x63, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x1a, 0x21, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x55,
	0x73, 0x65, 0x72, 0x46, 0x72, 0x69, 0x65, 0x6e, 0x64, 0x73, 0x4f, 0x66, 0x46, 0x72, 0x69, 0x65,
	0x6e, 0x64, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x08, 0x5a, 0x06, 0x2e,
	0x2e, 0x2f, 0x72, 0x70, 0x63, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_user_proto_rawDescOnce sync.Once
	file_user_proto_rawDescData = file_user_proto_rawDesc
)

func file_user_proto_rawDescGZIP() []byte {
	file_user_proto_rawDescOnce.Do(func() {
		file_user_proto_rawDescData = protoimpl.X.CompressGZIP(file_user_proto_rawDescData)
	})
	return file_user_proto_rawDescData
}

var file_user_proto_msgTypes = make([]protoimpl.MessageInfo, 3)
var file_user_proto_goTypes = []interface{}{
	(*UserFriendsResponse)(nil),                // 0: rpc.UserFriendsResponse
	(*UserFriendsOfFriendsResponseFriend)(nil), // 1: rpc.UserFriendsOfFriendsResponseFriend
	(*UserFriendsOfFriendsResponse)(nil),       // 2: rpc.UserFriendsOfFriendsResponse
	(*User)(nil),                               // 3: rpc.User
	(*Empty)(nil),                              // 4: rpc.Empty
}
var file_user_proto_depIdxs = []int32{
	3, // 0: rpc.UserFriendsResponse.friends:type_name -> rpc.User
	3, // 1: rpc.UserFriendsOfFriendsResponseFriend.user:type_name -> rpc.User
	3, // 2: rpc.UserFriendsOfFriendsResponseFriend.friends:type_name -> rpc.User
	1, // 3: rpc.UserFriendsOfFriendsResponse.friends:type_name -> rpc.UserFriendsOfFriendsResponseFriend
	4, // 4: rpc.UserService.Friends:input_type -> rpc.Empty
	4, // 5: rpc.UserService.FriendsOfFriends:input_type -> rpc.Empty
	0, // 6: rpc.UserService.Friends:output_type -> rpc.UserFriendsResponse
	2, // 7: rpc.UserService.FriendsOfFriends:output_type -> rpc.UserFriendsOfFriendsResponse
	6, // [6:8] is the sub-list for method output_type
	4, // [4:6] is the sub-list for method input_type
	4, // [4:4] is the sub-list for extension type_name
	4, // [4:4] is the sub-list for extension extendee
	0, // [0:4] is the sub-list for field type_name
}

func init() { file_user_proto_init() }
func file_user_proto_init() {
	if File_user_proto != nil {
		return
	}
	file_model_proto_init()
	if !protoimpl.UnsafeEnabled {
		file_user_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*UserFriendsResponse); i {
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
		file_user_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*UserFriendsOfFriendsResponseFriend); i {
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
		file_user_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*UserFriendsOfFriendsResponse); i {
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
			RawDescriptor: file_user_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   3,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_user_proto_goTypes,
		DependencyIndexes: file_user_proto_depIdxs,
		MessageInfos:      file_user_proto_msgTypes,
	}.Build()
	File_user_proto = out.File
	file_user_proto_rawDesc = nil
	file_user_proto_goTypes = nil
	file_user_proto_depIdxs = nil
}