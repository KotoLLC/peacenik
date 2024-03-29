// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0-devel
// 	protoc        v3.17.1
// source: info.proto

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

type InfoPublicKeyResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	PublicKey string `protobuf:"bytes,1,opt,name=public_key,json=publicKey,proto3" json:"public_key,omitempty"`
}

func (x *InfoPublicKeyResponse) Reset() {
	*x = InfoPublicKeyResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_info_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *InfoPublicKeyResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*InfoPublicKeyResponse) ProtoMessage() {}

func (x *InfoPublicKeyResponse) ProtoReflect() protoreflect.Message {
	mi := &file_info_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use InfoPublicKeyResponse.ProtoReflect.Descriptor instead.
func (*InfoPublicKeyResponse) Descriptor() ([]byte, []int) {
	return file_info_proto_rawDescGZIP(), []int{0}
}

func (x *InfoPublicKeyResponse) GetPublicKey() string {
	if x != nil {
		return x.PublicKey
	}
	return ""
}

type InfoVersionResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	DockerUpdated string `protobuf:"bytes,1,opt,name=docker_updated,json=dockerUpdated,proto3" json:"docker_updated,omitempty"`
}

func (x *InfoVersionResponse) Reset() {
	*x = InfoVersionResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_info_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *InfoVersionResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*InfoVersionResponse) ProtoMessage() {}

func (x *InfoVersionResponse) ProtoReflect() protoreflect.Message {
	mi := &file_info_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use InfoVersionResponse.ProtoReflect.Descriptor instead.
func (*InfoVersionResponse) Descriptor() ([]byte, []int) {
	return file_info_proto_rawDescGZIP(), []int{1}
}

func (x *InfoVersionResponse) GetDockerUpdated() string {
	if x != nil {
		return x.DockerUpdated
	}
	return ""
}

var File_info_proto protoreflect.FileDescriptor

var file_info_proto_rawDesc = []byte{
	0x0a, 0x0a, 0x69, 0x6e, 0x66, 0x6f, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x03, 0x72, 0x70,
	0x63, 0x1a, 0x0b, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x36,
	0x0a, 0x15, 0x49, 0x6e, 0x66, 0x6f, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x4b, 0x65, 0x79, 0x52,
	0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x1d, 0x0a, 0x0a, 0x70, 0x75, 0x62, 0x6c, 0x69,
	0x63, 0x5f, 0x6b, 0x65, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x70, 0x75, 0x62,
	0x6c, 0x69, 0x63, 0x4b, 0x65, 0x79, 0x22, 0x3c, 0x0a, 0x13, 0x49, 0x6e, 0x66, 0x6f, 0x56, 0x65,
	0x72, 0x73, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x25, 0x0a,
	0x0e, 0x64, 0x6f, 0x63, 0x6b, 0x65, 0x72, 0x5f, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0d, 0x64, 0x6f, 0x63, 0x6b, 0x65, 0x72, 0x55, 0x70, 0x64,
	0x61, 0x74, 0x65, 0x64, 0x32, 0x73, 0x0a, 0x0b, 0x49, 0x6e, 0x66, 0x6f, 0x53, 0x65, 0x72, 0x76,
	0x69, 0x63, 0x65, 0x12, 0x33, 0x0a, 0x09, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x4b, 0x65, 0x79,
	0x12, 0x0a, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x1a, 0x1a, 0x2e, 0x72,
	0x70, 0x63, 0x2e, 0x49, 0x6e, 0x66, 0x6f, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x4b, 0x65, 0x79,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x2f, 0x0a, 0x07, 0x56, 0x65, 0x72, 0x73,
	0x69, 0x6f, 0x6e, 0x12, 0x0a, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x1a,
	0x18, 0x2e, 0x72, 0x70, 0x63, 0x2e, 0x49, 0x6e, 0x66, 0x6f, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6f,
	0x6e, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x08, 0x5a, 0x06, 0x2e, 0x2e, 0x2f,
	0x72, 0x70, 0x63, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_info_proto_rawDescOnce sync.Once
	file_info_proto_rawDescData = file_info_proto_rawDesc
)

func file_info_proto_rawDescGZIP() []byte {
	file_info_proto_rawDescOnce.Do(func() {
		file_info_proto_rawDescData = protoimpl.X.CompressGZIP(file_info_proto_rawDescData)
	})
	return file_info_proto_rawDescData
}

var file_info_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_info_proto_goTypes = []interface{}{
	(*InfoPublicKeyResponse)(nil), // 0: rpc.InfoPublicKeyResponse
	(*InfoVersionResponse)(nil),   // 1: rpc.InfoVersionResponse
	(*Empty)(nil),                 // 2: rpc.Empty
}
var file_info_proto_depIdxs = []int32{
	2, // 0: rpc.InfoService.PublicKey:input_type -> rpc.Empty
	2, // 1: rpc.InfoService.Version:input_type -> rpc.Empty
	0, // 2: rpc.InfoService.PublicKey:output_type -> rpc.InfoPublicKeyResponse
	1, // 3: rpc.InfoService.Version:output_type -> rpc.InfoVersionResponse
	2, // [2:4] is the sub-list for method output_type
	0, // [0:2] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_info_proto_init() }
func file_info_proto_init() {
	if File_info_proto != nil {
		return
	}
	file_model_proto_init()
	if !protoimpl.UnsafeEnabled {
		file_info_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*InfoPublicKeyResponse); i {
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
		file_info_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*InfoVersionResponse); i {
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
			RawDescriptor: file_info_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_info_proto_goTypes,
		DependencyIndexes: file_info_proto_depIdxs,
		MessageInfos:      file_info_proto_msgTypes,
	}.Build()
	File_info_proto = out.File
	file_info_proto_rawDesc = nil
	file_info_proto_goTypes = nil
	file_info_proto_depIdxs = nil
}
