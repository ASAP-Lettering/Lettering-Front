import { authClient } from "@/api/client";

// 행성 편지 목록 조회
export const getPlanetLetterList = async ({
  spaceId,
  page,
  size,
}: {
  spaceId: string;
  page: number;
  size: number;
}) => {
  return await authClient.get(
    `/api/v1/spaces/${spaceId}/letters?page=${page}&size=${size}`
  );
};

// 궤도 편지 행성으로 이동
export const putLetterToPlanet = async ({
  letterId,
  spaceId,
}: {
  letterId: string;
  spaceId: string;
}) => {
  return await authClient.put(`/api/v1/spaces/letters/${letterId}`, {
    spaceId: spaceId,
  });
};

// 행성 편지 독립 편지로 이동
export const putLetterToIndep = async (letterId: string) => {
  return await authClient.put(`/api/v1/spaces/letters/${letterId}/independent`);
};

// 행성 편지 상세 조회
export const getPlanetLetter = async (letterId: string) => {
  return await authClient.get(`/api/v1/spaces/letters/${letterId}`);
};

// 행성 편지 삭제
export const deletePlanetLetter = async (letterId: string) => {
  return await authClient.delete(`/api/v1/spaces/letters/${letterId}`);
};

// 궤도 편지 목록 조회
export const getOrbitLetter = async () => {
  return await authClient.get(`/api/v1/letters/independent`);
};

// 궤도 편지 삭제
export const deleteOrbitLetter = async (letterId: string) => {
  return await authClient.delete(`/api/v1/letters/independent/${letterId}`);
};
