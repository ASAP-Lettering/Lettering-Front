import { RegisterDataType } from "@/types/user";
import client, { authClient } from "../client";
import { getRefreshToken, setTokens } from "@/utils/storage";
import memoize from "memoize";

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

//Refresh 재발급, 중복 처리 방지
export const getNewTokens = memoize(
  async () => {
    const storedRefreshToken = getRefreshToken();
    if (storedRefreshToken) {
      const response = await client.post("/api/v1/auth/reissue", {
        refreshToken: storedRefreshToken,
      });
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      return accessToken;
    }
    return null;
  },
  { maxAge: 1000 }
);

//테스트용 api
export const getAllSpaceName = async () => {
  return await authClient.get(`/api/v1/spaces`);
};
