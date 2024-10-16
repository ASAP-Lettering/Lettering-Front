import { deleteDraftLetter } from "@/api/send/send";
import { formatDate } from "@/lib/day";
import { draftState } from "@/recoil/letterStore";
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

  const [draftKeyState, setDraftKeyState] = useRecoilState(draftState);

  const handleSelect = (id: string) => {
    // 선택한 임시 저장 키 저장
    setDraftKeyState(id);
    onClose();
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
