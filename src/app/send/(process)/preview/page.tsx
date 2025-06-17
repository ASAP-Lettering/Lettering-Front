'use client';

import React, { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Button from '@/components/common/Button/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Letter from '@/components/letter/Letter';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postAnonymousSendLetter, postSendLetter } from '@/api/send/send';
import { sendLetterState } from '@/recoil/letterStore';
import useKakaoSDK from '@/hooks/useKakaoSDK';
import { userState } from '@/recoil/userStore';
import { getLetterShareStatus } from '@/api/letter/share';
import Loader, { LoaderContainer } from '@/components/common/Loader';
import { setAnonymousSendLetterCode } from '@/utils/storage';

const SendPreviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isKakaoLoaded = useKakaoSDK();
  const [letterState, setLetterState] = useRecoilState(sendLetterState);
  const {
    draftId,
    senderName,
    receiverName,
    content,
    images,
    templateType,
    letterId
  } = useRecoilValue(sendLetterState);
  const { name } = useRecoilValue(userState);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [letterCode, setLetterCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [maxLinesPerPage, setMaxLinesPerPage] = useState(12);
  const [fontSize, setFontSize] = useState<string>('16px');

  const isGuest = searchParams.get('guest') === 'true';

  useEffect(() => {
    setIsImage(!!!(content.length > 0));
  }, []);

  useEffect(() => {
    const updateMaxLines = () => {
      if (window.innerHeight > 660) {
        setMaxLinesPerPage(12);
        setFontSize('16px');
      } else if (window.innerHeight > 628) {
        setMaxLinesPerPage(8);
        setFontSize('16px');
      } else if (window.innerHeight > 580) {
        setMaxLinesPerPage(7);
        setFontSize('16px');
      } else {
        setMaxLinesPerPage(9);
        setFontSize('11px');
      }
    };

    updateMaxLines();
    window.addEventListener('resize', updateMaxLines);

    return () => {
      window.removeEventListener('resize', updateMaxLines);
    };
  }, []);

  const handleFlipLetter = () => {
    setIsImage(!isImage);
  };

  const handleSendLetterAndShare = async () => {
    /* 편지 전송 및 카카오 공유 */
    if (isSharing) return; // 중복 실행 방지

    setIsSharing(true);
    setIsLoading(true);

    const { Kakao, location } = window;

    if (!isKakaoLoaded) {
      console.error('Kakao SDK is not loaded yet');
      return;
    }

    try {
      let letterCode = '';
      // 1. 편지 전송 API 요청
      if (isGuest) {
        // 비회원 편지 저장 API 연동
        const response = await postAnonymousSendLetter({
          senderName,
          receiverName,
          content,
          images,
          templateType
        });
        setLetterState((prevState) => ({
          ...prevState,
          letterId: response.data.letterCode
        }));
        letterCode = response.data.letterCode;
        setLetterCode(response.data.letterCode);
        setAnonymousSendLetterCode(response.data.letterCode);
      } else {
        const response = await postSendLetter({
          draftId,
          receiverName,
          content,
          images,
          templateType
        });
        console.log('편지 쓰기 성공');
        setLetterState((prevState) => ({
          ...prevState,
          letterId: response.data.letterCode
        }));
        letterCode = response.data.letterCode;
        setLetterCode(response.data.letterCode);
      }

      // 2. 카카오 공유 로직 실행 (letterId 상태와 무관하게 항상 실행)
      Kakao.Share.sendScrap({
        requestUrl: location.origin + location.pathname,
        templateId: 112798,
        templateArgs: {
          senderName: `${isGuest ? senderName : name}`,
          id: letterCode
        },
        serverCallbackArgs: {
          requestType: 'SHARE',
          requestId: letterCode
        },
        // 카카오톡 미설치 시 카카오톡 설치 경로이동
        installTalk: true
      });
      setIsLoading(false);
      setIsSharing(false);
    } catch (error) {
      console.log('편지 전송 또는 카카오 공유 실패:', error);
    }
  };

  // 3. 공유 완료 상태 폴링
  useEffect(() => {
    if (letterCode.length > 0) {
      console.log('letterCode', letterCode);
      let intervalTime = 300;
      const interval = setInterval(async () => {
        try {
          const status = await getLetterShareStatus(letterCode || '');
          console.log(status);
          if (status.isShared) {
            console.log('완료');
            router.push(`/send/complete${isGuest ? '?guest=true' : ''}`);
            clearInterval(interval); // 폴링 중단
          }
        } catch (error) {
          console.error('공유 상태 조회 실패:', error);
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [letterCode]);

  return (
    <>
      <Container>
        <Column>
          <LetterWrapper>
            <LetterContainer
              $hasChangeButton={content.length > 0 && images.length > 0}
            >
              <Letter
                key={`${maxLinesPerPage}`}
                showType="send"
                contentType="all"
                id={'0'}
                templateType={templateType}
                name={receiverName}
                content={content}
                images={images}
                isImage={isImage}
                width="100%"
                height="100%"
                padding="38px 28px"
                nameSize="18px"
                maxLines={maxLinesPerPage}
                fontSize={fontSize}
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
            text="카카오로 편지 보내기"
            onClick={handleSendLetterAndShare}
            disabled={
              isGuest
                ? !receiverName || !content || !senderName || isLoading
                : !receiverName || !content || isLoading
            }
          >
            <Image
              src="/assets/icons/ic_kakao_talk.svg"
              width={24}
              height={24}
              alt="카카오"
            />
          </Button>
        </ButtonWrapper>
      </Container>
    </>
  );
};

export default function SendPreviewPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SendPreviewPage />
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
  align-items: center;
  width: 100%;
  max-width: 345px;
  min-height: 443px;
  max-height: 443px;
  margin-bottom: ${({ $hasChangeButton }) => ($hasChangeButton ? '0' : '80px')};

  @media (max-height: 660px) {
    min-height: 350px;
    max-height: 350px;
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
