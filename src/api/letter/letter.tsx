import client from "../client";

//편지 조회
export const getLetter = async (letterId: string, accessToken: string) => {
  return await client.get(`/api/v1/letters/${letterId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

//편지 삭제
export const deleteLetter = async (letterId: string, accessToken: string) => {
  return await client.delete(`/api/v1/letters/${letterId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
