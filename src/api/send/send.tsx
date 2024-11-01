import { authClient } from "@/api/client";

// 편지 쓰기
export const postSendLtter = async ({
  receiverName,
  content,
  images,
  templateType,
  draftId,
}: {
  receiverName: string;
  content: string;
  images: string[];
  templateType: number;
  draftId: string | null;
}) => {
  return await authClient.post(`/api/v1/letters/send`, {
    receiverName,
    content,
    images,
    templateType,
    draftId,
  });
};

// 임시 저장하기
export const postDraftLetter = async ({
  draftId,
  content,
  receiverName,
  images,
}: {
  draftId: string;
  content: string;
  receiverName: string;
  images: string[];
}) => {
  return await authClient.post(`/api/v1/letters/drafts/${draftId}`, {
    content,
    receiverName,
    images,
  });
};

// 임시 저장 삭제
export const deleteDraftLetter = async (draftId: string) => {
  return await authClient.delete(`/api/v1/letters/drafts/${draftId}`);
};

// 임시 저장 키 발급
export const postDraftKey = async () => {
  return await authClient.post(`/api/v1/letters/drafts/key`);
};

// 임시 저장 목록 조회
export const getDraftList = async () => {
  return await authClient.get(`/api/v1/letters/drafts`);
};

// 임시 저장 조회
export const getDraftLetter = async (draftKey: string) => {
  return await authClient.get(`/api/v1/letters/drafts/${draftKey}`);
};

// 임시 저장 개수 조회
export const getDraftCount = async () => {
  return await authClient.get(`/api/v1/letters/drafts/count`);
};
