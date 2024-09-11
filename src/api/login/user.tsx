import { RegisterDataType } from "@/types/user";
import client from "../client";

// 로그인
export const login = async (loginType: string, accessToken: string) => {
  return await client.post(`/api/v1/auth/login/${loginType}`, {
    accessToken: accessToken,
  });
};

export const signup = async ({
  registerToken,
  servicePermission,
  privatePermission,
  marketingPermission,
  birthday,
  realName,
}: RegisterDataType) => {
  return await client.post(`/api/v1/users`, {
    registerToken: registerToken,
    servicePermission: servicePermission,
    privatePermission: privatePermission,
    marketingPermission: marketingPermission,
    birthday: birthday,
    realName: realName,
  });
};
