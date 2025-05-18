'use client';

import Loader, { LoaderContainer } from '@/components/common/Loader';
import OauthButton from '@/components/signup/OauthButton';
import { OAUTH } from '@/constants/oauth';
import { sendLetterState } from '@/recoil/letterStore';
import { theme } from '@/styles/theme';
import { OAuthType } from '@/types/login';
import { clearAnonymousSendLetterCode } from '@/utils/storage';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

export default function Login() {
  const router = useRouter();
  const [, setSendState] = useRecoilState(sendLetterState);

  /* 로그인 페이지에서 편지 쓰기 store 초기화 */
  useEffect(() => {
    clearAnonymousSendLetterCode();
    setSendState({
      draftId: null,
      receiverName: '',
      content: '',
      images: [] as string[],
      previewImages: [] as string[],
      templateType: 0,
      letterId: null
    });
  }, []);

  const handleGuestLetterStart = () => {
    router.push('/send/receiver?guest=true');
  };

  return (
    <Container>
      <ImageWrapper>
        <LogoTitle data="/assets/login/login_text.svg" />
        <LogoText>편지로 수놓는 나의 스페이스</LogoText>
        <LogoImage src="/assets/login/login_logo.png" />
        <OauthWrapper>
          <Suspense
            fallback={
              <LoaderContainer>
                <Loader />
              </LoaderContainer>
            }
          >
            {OAUTH.map((item) => (
              <OauthButton
                key={item.key}
                loginType={item.key as OAuthType}
                bgColor={item.bgColor}
                icon={item.icon}
                size={item.size}
              />
            ))}
          </Suspense>
        </OauthWrapper>
        <LetterBtnText onClick={handleGuestLetterStart}>
          로그인 없이 편지 보내기
        </LetterBtnText>
      </ImageWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  background-image: url('/assets/login/login_bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  -webkit-scrollbar {
    display: none;
  }
`;

const LogoTitle = styled.object`
  display: flex;
  box-sizing: border-box;
  width: 70%;
  height: auto;
  max-width: 257px;
  max-height: 150px;
  //드래그방지
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
`;

const LogoText = styled.div`
  display: flex;
  width: 100%;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 134%; /* 26.8px */
  letter-spacing: -0.6px;
  ${theme.fonts.body07}
  justify-content: center;
  //드래그방지
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
`;

const LogoImage = styled.img`
  display: flex;
  width: auto;
  height: 100%;
  object-fit: cover;
  max-width: 520px;
  max-height: 520px;
  //드래그방지
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
`;

const ImageWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  padding-top: 100px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const OauthWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  gap: 24px;
  display: flex;
  position: absolute;
  bottom: 123px;
  justify-content: center;
`;

const LetterBtnText = styled.div`
  ${(props) => props.theme.fonts.caption02};
  color: ${theme.colors.gray400};
  position: absolute;
  bottom: 69px;
  text-decoration-line: underline;
  cursor: pointer;
`;
