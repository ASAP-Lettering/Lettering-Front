'use client';

import React, { Suspense, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState, useRecoilValue } from 'recoil';
import { draftState, registerLetterState } from '@/recoil/letterStore';
import Loader, { LoaderContainer } from '@/components/common/Loader';
import Header from '@/components/store/Header';
import DraftButton from '@/components/draft/DraftButton';
import { draftModalState } from '@/recoil/draftStore';
import { useToast } from '@/hooks/useToast';
import DraftBottom from '@/components/draft/DraftBottom';
import ConfirmModal from '@/components/common/ConfirmModal';
import {
  deleteDraftPhysicalLetter,
  getDraftPhysicalCount,
  getDraftPhysicalLetter,
  postDraftPhysicalKey,
  postDraftPhysicalLetter
} from '@/api/draft/store';

const LetterSenderPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [sender, setSender] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<string[]>([]); // 서버 전송용
  const [previewImages, setPreviewImages] = useState<string[]>([]); // 미리보기용

  const [isImageUploadLoading, setImageUploadLoading] =
    useState<boolean>(false); // 서버 이미지 업로드 상태

  const [draftModal, setDraftModal] = useRecoilState(draftModalState);
  const [letterState, setLetterState] = useRecoilState(registerLetterState);
  const [tempCount, setTempCount] = useState<number>(0);
  const [isDraftBottom, setIsDraftBottom] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const letterId = searchParams.get('letterId');
  const independent = searchParams.get('independent');

  const draftKey = useRecoilValue(draftState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isDraftDisabled = isLoading || (!sender && (!content || !images));

  useEffect(() => {
    if (letterState) {
      setSender(letterState.senderName);
    }
  }, [letterState]);

  const fetchGetDraft = async () => {
    if (draftKey) {
      try {
        const response = await getDraftPhysicalLetter(draftKey);
        console.log('임시 저장 편지 조회 성공', response);
      } catch {
        console.log('임시 저장 편지 조회 실패');
      }
    }
  };

  useEffect(() => {
    const fetchGetDraftCount = async () => {
      try {
        const response = await getDraftPhysicalCount();
        setTempCount(response.data.count);
        console.log('임시 저장 개수 조회 성공', response);
      } catch {
        console.log('임시 저장 개수 조회 실패');
      }
    };

    fetchGetDraftCount();

    if (draftKey) {
      fetchGetDraft();
    }

    if (letterState) {
      setDraftId(letterState.draftId);
      setSender(letterState.senderName);
      setContent(letterState.content);
      setImages(letterState.images);
      setPreviewImages(letterState.images);
    }
  }, [draftKey]);

  const handleSenderChange = (newValue: string) => {
    setSender(newValue);
    setLetterState((prevState) => ({
      ...prevState,
      senderName: newValue
    }));
  };

  /* 임시 저장 */
  const handleSaveLetter = async () => {
    if (!sender) {
      return;
    }

    try {
      setIsLoading(true);

      // 이미지 업로드 상태 확인
      while (isImageUploadLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log('이미지 업로드 완료. 임시 저장 진행 중...');

      // 1. 임시 저장 키 발급
      const draftKeyResponse = await postDraftPhysicalKey();
      const newDraftId = draftKeyResponse.data.draftId;
      setDraftId(newDraftId);
      console.log('임시 저장 키 발급 성공', newDraftId);

      // 2. 발급된 임시 저장 키로 임시 저장 API 호출
      await postDraftPhysicalLetter({
        draftId: newDraftId,
        content: content,
        senderName: sender,
        images: images
      });
      console.log('임시 저장 성공');
      setTempCount(tempCount + 1);

      // 3. 토스트 메세지
      showToast('작성하던 편지가 임시 저장됐어요.', {
        icon: true,
        iconType: 'message',
        close: true,
        bottom: '113px'
      });
    } catch (error) {
      console.error('임시 저장 실패', error);
    } finally {
      setIsLoading(false);
    }
  };

  /* 임시 저장 목록 */
  const handleDraftBottom = () => {
    setIsDraftBottom(!isDraftBottom);
  };

  const handleAddNext = async () => {
    /* 다음 페이지 */
    setLetterState((prevState) => ({
      ...prevState,
      senderName: sender
    }));
    if (letterId) {
      if (independent === 'true') {
        router.push(`/store/content?letterId=${letterId}&independent=true`);
      } else {
        router.push(`/store/content?letterId=${letterId}`);
      }
    } else {
      router.push('/store/content');
    }
  };

  /* 임시 저장 삭제 핸들러 */
  const handleDeleteDraft = async (draftId: string) => {
    try {
      await deleteDraftPhysicalLetter(draftId);
      setTempCount((prevCount) => prevCount - 1);
      console.log('임시 저장 편지가 삭제 성공');
    } catch (error) {
      console.error('임시 저장 편지 삭제 실패', error);
    }
  };

  const handleCancelModal = () => {
    setDraftModal({ id: draftModal.id, isOpen: !draftModal.isOpen });
  };

  const handleSelect = async () => {
    if (!draftModal.id) return;
    await handleSaveLetter();

    try {
      const response = await getDraftPhysicalLetter(draftModal.id);
      console.log('임시 저장 조회 성공', response.data);

      console.log('상태 변경됨');
      setLetterState({
        draftId: response.data.draftKey,
        senderName: response.data.senderName,
        content: response.data.content,
        images: response.data.images,
        previewImages: response.data.images,
        templateType: 0
      });

      // 각 input 상태 업데이트
      setDraftId(response.data.draftKey);
      setSender(response.data.senderName);
      setContent(response.data.content);
      setImages(response.data.images);
      setPreviewImages(response.data.images);

      // 모달 닫기
      setDraftModal({ id: null, isOpen: false });
      setIsDraftBottom(false);
    } catch {
      console.log('임시 저장 조회 실패');
    }
  };

  return (
    <>
      <Header current={1} edit={!!letterId} />
      <DraftButton
        handleSaveLetter={handleSaveLetter}
        handleDraftBottom={handleDraftBottom}
        isDraftDisabled={isDraftDisabled}
        isImageUploadLoading={isImageUploadLoading}
        tempCount={tempCount}
      />
      <Container>
        <Column>
          <Label>나에게 편지 보낸 사람</Label>
          <Input
            inputType="boxText"
            value={sender}
            onChange={handleSenderChange}
            placeholder="'성 + 이름' 의 실명을 입력해주세요"
          />
        </Column>
      </Container>
      <ButtonWrapper>
        <Button
          buttonType="primary"
          size="large"
          text={isImageUploadLoading ? 'Loading...' : '다음'}
          disabled={!sender}
          onClick={handleAddNext}
        />
      </ButtonWrapper>
      {isDraftBottom && (
        <BottomWrapper>
          <DraftBottom
            draftType="store"
            onClose={handleDraftBottom}
            handleDeleteDraft={handleDeleteDraft}
          />
        </BottomWrapper>
      )}
      {draftModal.isOpen && (
        <ConfirmModal
          title={`작성 중인 편지를 임시저장하고\n선택한 편지를 불러올까요?`}
          onConfirm={handleSelect}
          onCancel={handleCancelModal}
          confirmText="불러오기"
          cancelText="취소"
        />
      )}
    </>
  );
};

export default function LetterReceiverPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <LetterSenderPage />
    </Suspense>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-height: 628px) {
    position: relative;
  }
`;

const Column = styled.div<{ $position?: boolean }>`
  margin-bottom: 40px;

  @media (max-height: 710px) {
    margin-bottom: 20px;
  }

  @media (max-height: 628px) {
    ${({ $position }) =>
      $position &&
      css`
        width: 100%;
        position: absolute;
        top: 300px;
      `}
  }

  @media (max-height: 580px) {
    ${({ $position }) =>
      $position &&
      css`
        width: 100%;
        position: absolute;
        top: 280px;
      `}
  }
`;

const Label = styled.div<{ $show?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
  margin-bottom: 12px;

  @media (max-height: 628px) {
    ${theme.fonts.body6}
    margin-bottom: 12px;
    ${({ $show }) =>
      $show === false &&
      css`
        display: none;
        margin-bottom: 0px;
      `}
  }

  @media (max-height: 580px) {
    ${theme.fonts.body10};
    margin-bottom: 8px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
  z-index: 1000;
`;

const BottomWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  position: absolute;
  bottom: 0px;
  z-index: 1000;
`;
