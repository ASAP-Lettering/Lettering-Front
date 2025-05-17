'use client';

import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  deleteDraftLetter,
  getDraftCount,
  getDraftLetter,
  postDraftKey,
  postDraftLetter
} from '@/api/draft/send';
import DraftBottom from '@/components/draft/DraftBottom';
import { draftState, sendLetterState } from '@/recoil/letterStore';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useToast } from '@/hooks/useToast';
import ConfirmModal from '@/components/common/ConfirmModal';
import { draftModalState } from '@/recoil/draftStore';
import BottomSheet from '@/components/common/BottomSheet';
import { checkKorean } from '@/utils/checkKorean';
import DraftButton from '@/components/draft/DraftButton';

const SendReceiverPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [receiver, setReceiver] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<string[]>([]); // 서버 전송용
  const [previewImages, setPreviewImages] = useState<string[]>([]); // 미리보기용

  const [isImageUploadLoading, setImageUploadLoading] =
    useState<boolean>(false); // 서버 이미지 업로드 상태

  const isGuest = searchParams.get('guest') === 'true';

  const [draftModal, setDraftModal] = useRecoilState(draftModalState);
  const [letterState, setLetterState] = useRecoilState(sendLetterState);
  const [tempCount, setTempCount] = useState<number>(0);
  const [isDraftBottom, setIsDraftBottom] = useState<boolean>(false);

  const [isDisplayed, setIsDisplayed] = useState<boolean>(false);
  const [isBottomUp, setIsBottomUp] = useState<boolean>(false);

  const draftKey = useRecoilValue(draftState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isDraftDisabled = isLoading || (!receiver && (!content || !images));

  useEffect(() => {
    if (letterState) {
      setDraftId(letterState.draftId);
      setReceiver(letterState.receiverName);
      setContent(letterState.content);
      setImages(letterState.images);
      setPreviewImages(letterState.images);
    }
  }, [letterState]);

  const fetchGetDraft = async () => {
    if (draftKey) {
      try {
        const response = await getDraftLetter(draftKey);
        console.log('임시 저장 편지 조회 성공', response);
      } catch {
        console.log('임시 저장 편지 조회 실패');
      }
    }
  };

  useEffect(() => {
    const fetchGetDraftCount = async () => {
      try {
        const response = await getDraftCount();
        setTempCount(response.data.count);
        console.log('임시 저장 개수 조회 성공', response);
      } catch {
        console.log('임시 저장 개수 조회 실패');
      }
    };

    if (!isGuest) fetchGetDraftCount();

    if (draftKey) {
      fetchGetDraft();
    }

    if (letterState) {
      setDraftId(letterState.draftId);
      setReceiver(letterState.receiverName);
      setContent(letterState.content);
      setImages(letterState.images);
      setPreviewImages(letterState.images);
    }
  }, [draftKey]);

  const handleReceiverChange = (newValue: string) => {
    setReceiver(newValue);
    setLetterState((prevState) => ({
      ...prevState,
      receiverName: newValue
    }));
  };

  /* 임시 저장 */
  const handleSaveLetter = async () => {
    if (!receiver) {
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
      const draftKeyResponse = await postDraftKey();
      const newDraftId = draftKeyResponse.data.draftId;
      setDraftId(newDraftId);
      console.log('임시 저장 키 발급 성공', newDraftId);

      // 2. 발급된 임시 저장 키로 임시 저장 API 호출
      await postDraftLetter({
        draftId: newDraftId,
        content: content,
        receiverName: receiver,
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

  /* 실명 확인 BottomSheet 관련 */
  const handleBottomUpChange = (state: boolean) => {
    setIsBottomUp(state);
  };

  useEffect(() => {
    if (isBottomUp) {
      setIsDisplayed(true);
    } else {
      setTimeout(() => {
        setIsDisplayed(false);
      }, 490);
    }
  }, [isBottomUp]);

  const handleAddNext = async () => {
    /* 다음 페이지 */
    setLetterState((prevState) => ({
      ...prevState,
      draftId: draftId,
      receiverName: receiver,
      content: content,
      images: images,
      previewImages: previewImages
    }));

    router.push(`/send/content${isGuest ? '?guest=true' : ''}`);
  };

  /* 임시 저장 삭제 핸들러 */
  const handleDeleteDraft = async (draftId: string) => {
    try {
      await deleteDraftLetter(draftId);
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
      const response = await getDraftLetter(draftModal.id);
      console.log('임시 저장 조회 성공', response.data);

      console.log('상태 변경됨');
      setLetterState({
        draftId: response.data.draftKey,
        receiverName: response.data.receiverName,
        content: response.data.content,
        images: response.data.images,
        previewImages: response.data.images,
        templateType: 0,
        letterId: null
      });

      // 각 input 상태 업데이트
      setDraftId(response.data.draftKey);
      setReceiver(response.data.receiverName);
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
      {!isGuest && (
        <DraftButton
          handleSaveLetter={handleSaveLetter}
          handleDraftBottom={handleDraftBottom}
          isDraftDisabled={isDraftDisabled}
          isImageUploadLoading={isImageUploadLoading}
          tempCount={tempCount}
        />
      )}
      <Container>
        <Column>
          <Label>편지를 받는 사람</Label>
          <Input
            inputType="boxText"
            value={receiver}
            onChange={handleReceiverChange}
            placeholder="'성 + 이름' 의 실명을 입력해주세요"
          />
        </Column>
      </Container>
      <ButtonWrapper>
        <DescriptionText onClick={() => router.push('/info')}>
          왜 실명으로 해야 하나요?
        </DescriptionText>
        <Button
          buttonType="primary"
          size="large"
          text={isImageUploadLoading ? 'Loading...' : '다음'}
          disabled={!receiver}
          onClick={() => {
            setIsBottomUp(true);
          }}
        />
      </ButtonWrapper>
      {isDraftBottom && (
        <BottomWrapper>
          <DraftBottom
            draftType="send"
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
      {isDisplayed && (
        <BottomSheet
          height={353}
          title={`'${receiver}'${checkKorean(
            receiver
          )} 받는 분의 실명이 맞나요?`}
          subtitle={`수신인이 편지를 열어보려면,\n반드시 실명으로 편지를 보내야 해요.`}
          isOpen={isBottomUp}
          confirmText="네, 맞아요"
          handleOpen={handleBottomUpChange}
          onConfirm={handleAddNext}
        />
      )}
    </>
  );
};

export default SendReceiverPage;

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
    ${theme.fonts.body10}
    margin-bottom: 8px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;

const DescriptionText = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 23px;
  text-decoration: underline;
  ${theme.fonts.body09};
  color: ${(props) => props.theme.colors.gray400};
`;

const BottomWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  position: absolute;
  bottom: 0px;
  z-index: 1000;
`;
