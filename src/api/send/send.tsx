import client, { authClient } from '@/api/client';

// 편지 쓰기
export const postSendLetter = async ({
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

// 비회원 편지 쓰기
export const postAnonymousSendLetter = async ({
  senderName,
  receiverName,
  content,
  images,
  templateType
}: {
  senderName: string;
  receiverName: string;
  content: string;
  images: string[];
  templateType: number;
}) => {
  return await client.post(`/api/v1/letters/anonymous/send`, {
    senderName,
    receiverName,
    content,
    images,
    templateType
  });
};
