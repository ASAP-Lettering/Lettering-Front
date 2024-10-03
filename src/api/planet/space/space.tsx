import { authClient } from "@/api/client";

// 메인 스페이스 아이디 조회
export const getMainId = async () => {
  return await authClient.get(`/api/v1/spaces/main`);
};

// 전체 스페이스 목록 조회
export const getSpaceList = async () => {
  return await authClient.get(`/api/v1/spaces`);
};

// 스페이스 생성
export const postNewSpace = async ({
  spaceName,
  templateType,
}: {
  spaceName: string;
  templateType: number;
}) => {
  return await authClient.post(`/api/v1/spaces`, {
    spaceName: spaceName,
    templateType: templateType,
  });
};

// 스페이스 삭제
export const deleteSpace = async ({ spaceId }: { spaceId: string }) => {
  return await authClient.delete(`/api/v1/spaces/${spaceId}`);
};

// 여러 스페이스 삭제
export const deleteSpaces = async ({ spaceIds }: { spaceIds: string[] }) => {
  return await authClient.delete(`/api/v1/spaces`, {
    data: { spaceIds },
  });
};

// 스페이스 이름 수정
export const putSpace = async ({
  spaceId,
  spaceName,
}: {
  spaceId: string;
  spaceName: string;
}) => {
  return await authClient.put(`/api/v1/spaces/${spaceId}/name`, {
    spaceName,
  });
};

// 스페이스 순서 변경
export const putSpacesOrder = async ({
  orders,
}: {
  orders: { spaceId: string; index: number }[];
}) => {
  return await authClient.put(`/api/v1/spaces/order`, {
    orders,
  });
};
