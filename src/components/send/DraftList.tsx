import { formatDate } from "@/lib/day";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { draftModalState } from "@/recoil/draftStore";

interface DraftListProps {
  id: string;
  name: string;
  content: string;
  timestamp: string;
  isDeleteMode: boolean;
  onDelete: (draftId: string) => void;
}

const DraftList = (props: DraftListProps) => {
  const { id, name, content, timestamp, isDeleteMode, onDelete } = props;

  const [draftModal, setDraftModal] = useRecoilState(draftModalState);

  const handleConfirmModal = () => {
    setDraftModal({ id: id, isOpen: !draftModal.isOpen });
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
    <>
      <Container onClick={handleConfirmModal}>
        <Top>
          {name.length > 0 ? <Name>{name}</Name> : <Blank>이름 없음</Blank>}|
          {content && content.length > 0 ? (
            <Content>{content}</Content>
          ) : (
            <Blank>작성된 내용이 없어요</Blank>
          )}
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
    </>
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
  display: flex;
  align-items: center;
  gap: 8px;
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

const Blank = styled.div`
  color: ${theme.colors.gray500};
  white-space: nowrap;
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
