'use client';

import React, { Suspense, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendLetterState } from '@/recoil/letterStore';
import { useRecoilState } from 'recoil';
import { useToast } from '@/hooks/useToast';
import Loader, { LoaderContainer } from '@/components/common/Loader';

const SendSenderPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [sender, setSender] = useState<string>('');
  const [receiver, setReceiver] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<string[]>([]); // 서버 전송용
  const [previewImages, setPreviewImages] = useState<string[]>([]); // 미리보기용

  const isGuest = searchParams.get('guest') === 'true';
  const [letterState, setLetterState] = useRecoilState(sendLetterState);

  useEffect(() => {
    if (letterState) {
      setDraftId(letterState.draftId);
      setSender(letterState.senderName);
      setReceiver(letterState.receiverName);
      setContent(letterState.content);
      setImages(letterState.images);
      setPreviewImages(letterState.images);
    }
  }, [letterState]);

  const handleSenderChange = (newValue: string) => {
    setSender(newValue);
    setLetterState((prevState) => ({
      ...prevState,
      senderName: newValue
    }));
  };

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

    router.push(`/send/template${isGuest ? '?guest=true' : ''}`);
  };

  return (
    <>
      <Container>
        <Column>
          <Label>From. 편지를 보내는 사람</Label>
          <Input
            inputType="boxText"
            value={sender}
            onChange={handleSenderChange}
            placeholder="작성자 본인의 '성 + 이름' 의 실명을 입력해주세요"
          />
        </Column>
      </Container>
      <ButtonWrapper>
        <Button
          buttonType="primary"
          size="large"
          text={'다음'}
          disabled={!sender}
          onClick={handleAddNext}
        />
      </ButtonWrapper>
    </>
  );
};

export default function SendSenderPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SendSenderPage />
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
