'use client';

import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button/Button';
import Loader, { LoaderContainer } from '@/components/common/Loader';
import OauthButton from '@/components/signup/OauthButton';
import { OAUTH } from '@/constants/oauth';
import { SEND_COMPLETE_SUBTEXT } from '@/constants/send/message';
import { sendLetterState } from '@/recoil/letterStore';
import { letterFloat } from '@/styles/animation';
import { theme } from '@/styles/theme';
import { OAuthType } from '@/types/login';
import { clearAnonymousSendLetterCode } from '@/utils/storage';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const SendCompletePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';
  const { receiverName } = useRecoilValue(sendLetterState);
  const [isDisplayed, setIsDisplayed] = useState<boolean>(false);
  const [isBottomUp, setIsBottomUp] = useState<boolean>(false);

  const subText = isGuest
    ? SEND_COMPLETE_SUBTEXT.guest
    : SEND_COMPLETE_SUBTEXT.member;

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

  const handleComplete = () => {
    if (isGuest) {
      setIsBottomUp(true);
    } else {
      router.push('/planet');
    }
  };

  const handleExit = () => {
    router.push('/login');
    clearAnonymousSendLetterCode();
  };

  return (
    <>
      <Layout>
        {isGuest && (
          <button onClick={handleExit}>
            <CloseIcon
              src="/assets/icons/ic_x.svg"
              width={24}
              height={24}
              alt="나가기"
            />
          </button>
        )}
        <Container>
          <Title>
            {receiverName}에게
            <br />
            편지를 전달했어요!
            <Sub>{subText}</Sub>
          </Title>
          <ImageWrapper>
            <Image src="/assets/send/send_complete.png" fill alt="편지" />
          </ImageWrapper>
        </Container>
        <ButtonWrapper>
          <Button
            buttonType="primary"
            text={
              isGuest ? '회원가입하고 더 많은 기능 이용하기' : '홈으로 돌아가기'
            }
            onClick={handleComplete}
          />
        </ButtonWrapper>
        {isDisplayed && (
          <BottomSheet
            height={290}
            isOpen={isBottomUp}
            handleOpen={handleBottomUpChange}
          >
            <BottomWrapper>
              <SocialTitle>소셜로그인 선택</SocialTitle>
              <LoginList>
                {OAUTH.map((item) => (
                  <OauthButton
                    key={item.key}
                    shape="list"
                    loginType={item.key as OAuthType}
                    bgColor={item.bgColor}
                    icon={item.icon}
                    size={item.miniSize}
                    label={item.label}
                  />
                ))}
              </LoginList>
            </BottomWrapper>
          </BottomSheet>
        )}
      </Layout>
    </>
  );
};

export default function SendCompletePaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SendCompletePage />
    </Suspense>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  color: ${theme.colors.white};
  overflow-x: hidden;
  overflow-y: hidden;
  background: ${(props) => props.theme.colors.bg};
  background-image: url('/assets/send/img_send_background.png');
  background-size: cover;
  background-position: bottom 80px center;
  background-repeat: no-repeat;
  position: relative;
  z-index: 0;
`;

const CloseIcon = styled(Image)`
  width: 24px;
  height: 24px;
  position: absolute;
  top: 10px;
  right: 17px;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 76px 24px 54px 24px;
  gap: 80px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  ${theme.fonts.heading01};
`;

const Sub = styled.div`
  color: ${theme.colors.gray300};
  ${theme.fonts.body07};
`;

const ImageWrapper = styled.div`
  width: 480px;
  height: 460px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${letterFloat} 2s ease-in-out infinite;

  @media (max-height: 680px) {
    width: 400px;
    height: 380px;
    top: 55%;
  }

  @media (max-height: 580px) {
    width: 350px;
    height: 340px;
    top: 58%;
  }

  @media (max-height: 550px) {
    width: 300px;
    height: 290px;
    top: 58%;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  padding: 0 24px;
  bottom: 54px;
  left: 0;
`;

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 26px;
`;

const SocialTitle = styled.p`
  color: ${theme.colors.gray100};
  ${theme.fonts.title02};
`;

const LoginList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 14px;
  gap: 24px;
`;
