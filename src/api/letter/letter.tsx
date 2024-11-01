import { getAccessToken } from "@/utils/storage";
import client, { authClient } from "../client";

// 편지 조회
export const getLetter = async (letterId: string) => {
  return await authClient.get(`/api/v1/letters/${letterId}`, {});
};

export const getSpaceLetter = async (letterId: string) => {
  return await authClient.get(`/api/v1/spaces/letters/${letterId}`, {});
};

// 무소속편지 조회
export const getIndependentLetter = async (letterId: string) => {
  return await authClient.get(`/api/v1/letters/independent/${letterId}`);
};

// 실물 편지 내용 추가
export const postPhysicalLetter = async ({
  senderName,
  content,
  images,
  templateType,
}: {
  senderName: string;
  content: string;
  images: string[];
  templateType: number;
}) => {
  return await authClient.post(`/api/v1/letters/physical/receive`, {
    senderName,
    content,
    images,
    templateType,
  });
};

// 이미지 업로드
export const uploadImage = async ({ imageUrl }: { imageUrl: string }) => {
  return await authClient.post(`/api/v1/images`, {
    imageUrl,
  });
};

// 편지 열람 가능 검증
export const verifyLetter = async (letterCode: string, accessToken: string) => {
  return await client.put(`/api/v1/letters/verify`, {
    letterCode: letterCode,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// 검증된 편지 열람
export const getVerifyedLetter = async (letterId: string) => {
  return await authClient.get(`/api/v1/letters/${letterId}/verify`);
};

// 편지 수령
export const saveVerifyedLetter = async (letterId: string) => {
  return await authClient.post(`/api/v1/letters/verify/receive`, {
    letterId: letterId,
  });
};

// 행성 편지 수정
export const putLetter = async ({
  letterId,
  senderName,
  content,
  images,
  templateType,
}: {
  letterId: string;
  senderName: string;
  content: string;
  images: string[];
  templateType: number;
}) => {
  return await authClient.put(`/api/v1/spaces/letters/${letterId}/content`, {
    senderName,
    content,
    images,
    templateType,
  });
};

// 행성 편지 수정
export const putIndependentLetter = async ({
  letterId,
  senderName,
  content,
  images,
  templateType,
}: {
  letterId: string;
  senderName: string;
  content: string;
  images: string[];
  templateType: number;
}) => {
  return await authClient.put(
    `/api/v1/letters/independent/${letterId}/content`,
    {
      senderName,
      content,
      images,
      templateType,
    }
  );
};

// 궤도 편지 삭제
export const deleteIndependentLetter = async (letterId: string) => {
  return await authClient.delete(`/api/v1/letters/independent/${letterId}`);
};

// 행성 편지 삭제
export const deleteLetter = async (letterId: string) => {
  return await authClient.delete(`/api/v1/spaces/letters/${letterId}`);
};
// 모든 편지 수 조회
export const getLetterCount = async () => {
  return await authClient.get(`/api/v1/letters/count`);
};
