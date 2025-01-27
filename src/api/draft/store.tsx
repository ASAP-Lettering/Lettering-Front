import { authClient } from '@/api/client';

// 실물 편지 임시 저장하기
export const postDraftPhysicalLetter = async ({
  draftId,
  content,
  senderName,
  images
}: {
  draftId: string;
  content: string;
  senderName: string;
  images: string[];
}) => {
  return await authClient.post(`/api/v1/letters/drafts/physical/${draftId}`, {
    content,
    senderName,
    images
  });
};

// 실물 편지 임시 저장 삭제
export const deleteDraftPhysicalLetter = async (draftId: string) => {
  return await authClient.delete(`/api/v1/letters/drafts/physical/${draftId}`);
};

// 실물 편지 임시 저장 키 발급
export const postDraftPhysicalKey = async () => {
  return await authClient.post(`/api/v1/letters/drafts/physical/key`);
};

// 실물 편지 임시 저장 목록 조회
export const getDraftPhysicalList = async () => {
  return await authClient.get(`/api/v1/letters/drafts/physical`);
};

// 실물 편지 임시 저장 조회
export const getDraftPhysicalLetter = async (draftKey: string) => {
  return await authClient.get(`/api/v1/letters/drafts/physical/${draftKey}`);
};

// 실물 편지 임시 저장 개수 조회
export const getDraftPhysicalCount = async () => {
  return await authClient.get(`/api/v1/letters/drafts/physical/count`);
};
