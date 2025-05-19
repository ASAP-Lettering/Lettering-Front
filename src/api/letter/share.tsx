import client, { authClient } from '../client';

export const getLetterShareStatus = async (
  letterCode: string
): Promise<ShareStatusData> => {
  const response = await client.get(
    `/api/v1/letters/logs/share/status?letterCode=${letterCode}`
  );
  return response.data;
};

export type shareStatusType =
  | 'MEMO_CHAT'
  | 'DIRECT_CHAT'
  | 'MULTI_CHAT'
  | 'OPEN_DIRECT_CHAT'
  | 'OPEN_MULTI_CHAT';

export type ShareStatusData = {
  isShared: boolean;
  letterId: string;
  shareTarget: shareStatusType;
};
