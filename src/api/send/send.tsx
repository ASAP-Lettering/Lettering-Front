import { authClient } from '@/api/client';

// 편지 쓰기
export const postSendLtter = async ({
  receiverName,
  content,
  images,
  templateType,
  draftId
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
    draftId
  });
};
