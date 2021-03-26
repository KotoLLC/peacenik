import React, { useCallback } from "react";

interface UserInfo {
  fullName: string;
  name: string;
  id: string;
  avatarUrl: string;
  status: string;
}

const useGetUserInfoById = () => {
  return useCallback((userId: string): UserInfo => {
    return {
      fullName: "Ada Eliot",
      name: userId,
      id: userId,
      avatarUrl: userId,
      status: "online",
    };
  }, []);
};

export default useGetUserInfoById;
