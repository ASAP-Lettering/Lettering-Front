import { formatDate } from '@/lib/day';
import { theme } from '@/styles/theme';
import Image from 'next/image';
import React from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { draftModalState } from '@/recoil/draftStore';
import { registerLetterState, sendLetterState } from '@/recoil/letterStore';
import { getDraftPhysicalLetter } from '@/api/draft/store';
import { getDraftLetter } from '@/api/draft/send';

interface DraftListProps {
  draftType: 'send' | 'store';
  id: string;
  name: string;
  content: string;
  timestamp: string;
  isDeleteMode: boolean;
  onDelete: (draftId: string) => void;
  onClose: () => void;
}

const DraftList = (props: DraftListProps) => {
  const {
    draftType,
    id,
    name,
    content,
    timestamp,
    isDeleteMode,
    onDelete,
    onClose
  } = props;

  const [draftModal, setDraftModal] = useRecoilState(draftModalState);
  const [letterState, setLetterState] = useRecoilState(sendLetterState);
  const [registerState, setRegisterState] = useRecoilState(registerLetterState);

  const handleConfirmModal = async () => {
    if (!letterState.receiverName && !letterState.content) {
      try {
        const response =
          draftType === 'send'
            ? await await getDraftLetter(id)
            : await getDraftPhysicalLetter(id);
        console.log('임시 저장 조회 성공', response.data);

        draftType === 'send'
          ? setLetterState({
              draftId: response.data.draftKey,
              senderName: '',
              receiverName: response.data.receiverName,
              content: response.data.content,
              images: response.data.images,
              previewImages: response.data.images, // 미리보기로 이미지 불러오기
              templateType: 0,
              letterId: null
            })
          : setRegisterState({
              draftId: response.data.draftKey,
              senderName: response.data.senderName,
              content: response.data.content,
              images: response.data.images,
              previewImages: response.data.images, // 미리보기로 이미지 불러오기
              templateType: 0
            });

        onClose();
      } catch {
        console.log('임시 저장 조회 실패');
      }
    } else {
      setDraftModal({ id: id, isOpen: !draftModal.isOpen });
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
    <>
      <Container onClick={handleConfirmModal}>
        <Top>
          {name && name.length > 0 ? (
            <Name>{name}</Name>
          ) : (
            <Blank>이름 없음</Blank>
          )}
          |
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

  @media (max-height: 580px) {
    height: 60px;
  }
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

  @media (max-height: 580px) {
    ${(props) => props.theme.fonts.body13};
  }
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

  @media (max-height: 580px) {
    ${(props) => props.theme.fonts.caption05};
  }
`;

const DeleteIcon = styled(Image)`
  position: absolute;
  top: -4px;
  right: -2px;
  overflow: visible;
`;
