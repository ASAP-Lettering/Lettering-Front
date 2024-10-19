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

//화원 정보 조회
export const getUserInfo = async () => {
  return await authClient.get(`/api/v1/users/info/me`);
};

//생일 수정
export const putUserBirthday = async (birthday: string) => {
  return await authClient.put(`/api/v1/users/info/me/birthday`, {
    birthday: birthday,
  });
};
