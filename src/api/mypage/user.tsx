import { authClient } from "../client";

// 로그아웃
export const logout = async (refreshToken: string) => {
  return await authClient.delete(`/api/v1/users/logout`, {
    data: { refreshToken: refreshToken },
  });
};

// 회원 탈퇴
export const deleteUser = async () => {
  return await authClient.delete(`/api/v1/users`);
};
