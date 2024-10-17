import { deleteDraftLetter, getDraftLetter } from "@/api/send/send";
import { formatDate } from "@/lib/day";
import { draftState, sendLetterState } from "@/recoil/letterStore";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

interface DraftListProps {
  id: string;
  name: string;
  content: string;
  timestamp: string;
  isDeleteMode: boolean;
  onDelete: (draftId: string) => void;
  onClose: () => void;
}

const DraftList = (props: DraftListProps) => {
  const { id, name, content, timestamp, isDeleteMode, onDelete, onClose } =
    props;

  const [sendLetter, setSendLetter] = useRecoilState(sendLetterState);

  const handleSelect = async (id: string) => {
    try {
      const response = await getDraftLetter(id);
      console.log("임시 저장 조회 성공", response.data);

      setSendLetter({
        draftId: response.data.draftKey,
        receiverName: response.data.receiverName,
        content: response.data.content,
        images: response.data.images,
        templateType: 0,
      });

      onClose();
    } catch {
      console.log("임시 저장 조회 실패");
    }
  };

  const handleDeleteDraft = async (
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    event.stopPropagation();

    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <Container
      onClick={() => {
        handleSelect(id);
      }}
    >
      <Top>
        <Name>{name}</Name>
        {` `}|{` `} <Content>{content}</Content>
      </Top>
      <TimeStamp>{formatDate(timestamp)}</TimeStamp>
      {isDeleteMode && (
        <DeleteIcon
          src="/assets/icons/ic_delete_mode.svg"
          width={20}
          height={20}
          alt="삭제"
          onClick={handleDeleteDraft}
        />
      )}
    </Container>
  );
};

export default DraftList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  height: 76px;
  padding: 16px 25px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: ${theme.colors.gray800};
  position: relative;
  overflow: visible;
`;

const Top = styled.div`
  width: 100%;
  color: ${theme.colors.white};
  ${theme.fonts.caption01};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Name = styled.span`
  white-space: nowrap;
`;

const Content = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: auto;
`;

const TimeStamp = styled.div`
  width: 100%;
  color: ${theme.colors.gray300};
  ${theme.fonts.caption04};
  text-align: left;
`;

const DeleteIcon = styled(Image)`
  position: absolute;
  top: -4px;
  right: -2px;
  overflow: visible;
`;
