'use client';

import React, { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Button from '@/components/common/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Letter from '@/components/letter/Letter';
import {
  postPhysicalLetter,
  putIndependentLetter,
  putLetter
} from '@/api/letter/letter';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { registerLetterState } from '@/recoil/letterStore';
import Loader, { LoaderContainer } from '@/components/common/Loader';
import Header from '@/components/store/Header';

const LetterPreviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const letterId = searchParams.get('letterId');
  const independent = searchParams.get('independent');
  const { draftId, senderName, content, images, templateType } =
    useRecoilValue(registerLetterState);

  const [isImage, setIsImage] = useState<boolean>(false);
  const resetLetterState = useResetRecoilState(registerLetterState);

  useEffect(() => {
    setIsImage(!!!(content.length > 0));
  }, []);

  const handleFlipLetter = () => {
    setIsImage(!isImage);
  };

  const handleRegisterLetter = async () => {
    if (letterId) {
      /* 편지 수정 */
      if (independent === 'true') {
        try {
          await putIndependentLetter({
            letterId,
            senderName,
            content,
            images,
            templateType
          });
          console.log('궤도 편지 수정 성공');
          router.push(`/independent/${letterId}`);
          resetLetterState();
        } catch {
          console.log('궤도 편지 수정 실패');
        }
      } else {
        try {
          await putLetter({
            letterId,
            senderName,
            content,
            images,
            templateType
          });
          console.log('행성 편지 수정 성공');
          resetLetterState();
          router.push(`/letter/${letterId}`);
        } catch {
          console.log('행성 편지 수정 실패');
        }
      }
    } else {
      /* 편지 등록 */
      try {
        await postPhysicalLetter({
          draftId,
          senderName,
          content,
          images,
          templateType
        });
        console.log('실물 편지 등록 성공');
        router.push('/planet');
        resetLetterState();
      } catch {
        console.log('실물 편지 등록 실패');
      }
    }
  };

  return (
    <>
      <Header current={null} edit={!!letterId} />
      <Container>
        <Column>
          <LetterWrapper>
            <LetterContainer
              $hasChangeButton={content.length > 0 && images.length > 0}
            >
              <Letter
                showType="receive"
                contentType="all"
                id={'0'}
                templateType={templateType}
                name={senderName}
                content={content}
                images={images}
                isImage={isImage}
                width="100%"
                height="100%"
                padding="38px 28px"
                nameSize="18px"
              />
            </LetterContainer>
            {content.length > 0 && images.length > 0 && (
              <ChangeButton onClick={handleFlipLetter}>
                <Image
                  src="/assets/icons/ic_change.svg"
                  width={20}
                  height={20}
                  alt="클릭"
                />
                클릭하면 {isImage ? '편지 내용' : '사진'}을 확인할 수 있어요
              </ChangeButton>
            )}
          </LetterWrapper>
        </Column>
        <ButtonWrapper>
          <Button
            buttonType="primary"
            size="large"
            text={letterId ? '수정 완료' : '등록 완료'}
            onClick={handleRegisterLetter}
          />
        </ButtonWrapper>
      </Container>
    </>
  );
};

export default function LetterPreviewPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <LetterPreviewPage />
    </Suspense>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`;

const LetterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 49px;

  @media (max-height: 780px) {
    gap: 20px;
  }

  @media (max-height: 628px) {
    gap: 20px;
  }

  @media (max-height: 580px) {
    gap: 30px;
  }
`;

const LetterContainer = styled.div<{ $hasChangeButton: boolean }>`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 345px;
  min-height: 443px;
  max-height: 443px;
  margin-bottom: ${({ $hasChangeButton }) => ($hasChangeButton ? '0' : '80px')};

  @media (max-height: 660px) {
    min-height: 350px;
  }

  @media (max-height: 628px) {
    min-height: 320px;
    max-height: 320px;
  }

  @media (max-height: 580px) {
    min-height: 300px;
    max-height: 300px;
  }

  @media (max-height: 550px) {
    min-height: 280px;
    max-height: 280px;
    margin-bottom: ${({ $hasChangeButton }) =>
      $hasChangeButton ? '0' : '55px'};
  }
`;

const ChangeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.caption02};

  @media (max-height: 730px) {
    flex-direction: row;
    margin-bottom: 50px;
    gap: 10px;
  }

  @media (max-height: 628px) {
    flex-direction: row;
    margin-bottom: 50px;
    gap: 6px;
    ${theme.fonts.body12};
  }

  @media (max-height: 580px) {
    flex-direction: row;
    margin-bottom: 50px;
    gap: 6px;
    ${theme.fonts.body12};
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
