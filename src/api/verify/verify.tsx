import client, { authClient } from "../client";

//편지 검증 - > 여기서 id를 받음
export const verifyLetter = async (letterCode: string) => {
  return await authClient.put(`/api/v1/letters/verify`, {
    letterCode: letterCode,
  });
};

//편지 수령 처리
export const receiveVerifyLetter = async (
  letterId: string,
  accessToken: string
) => {
  return await client.post(
    `/api/v1/letters/verify/receive`,
    {
      letterId: letterId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

//검증된 편자 열람 -> 받은 id를 바탕으로 편지 열람
export const getverifyLetter = async (
  letterId: string,
  accessToken: string
) => {
  return await client.get(`/api/v1/letters/${letterId}/verify`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
