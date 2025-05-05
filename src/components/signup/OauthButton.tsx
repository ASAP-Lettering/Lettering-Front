import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { getRecentLogin, setLetterUrl } from '@/utils/storage';
import { OAuthType } from '@/types/login';
import { theme } from '@/styles/theme';
import { float } from '@/styles/animation';

interface OauthButtonProps {
  loginType: OAuthType;
  bgColor: string;
  icon: string;
  size: number;
}
const OauthButton = (props: OauthButtonProps) => {
  const { loginType, bgColor, icon, size } = props;

  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [redirectUri, setRedirectUri] = useState<string>('');
  const [recentLogin, setRecentLogin] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRecentLogin(getRecentLogin());
      setRedirectUri(
        window.location.protocol +
          '//' +
          window.location.host +
          `/login/auth?type=${loginType}`
      );
    }
  }, []);

  const handleLogin = () => {
    if (url) {
      setLetterUrl(url);
    }
    let authUrl = '';

    switch (loginType) {
      case 'google': {
        const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const scope = 'openid profile email';
        authUrl = [
          'https://accounts.google.com/o/oauth2/v2/auth',
          `?client_id=${GOOGLE_CLIENT_ID}`,
          `&redirect_uri=${encodeURIComponent(redirectUri)}`,
          `&response_type=code`,
          `&scope=${encodeURIComponent(scope)}`,
          `&access_type=offline`,
          `&prompt=consent`
        ].join('');
        break;
      }

      case 'kakao': {
        const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
        authUrl = [
          'https://kauth.kakao.com/oauth/authorize',
          `?client_id=${KAKAO_CLIENT_ID}`,
          `&redirect_uri=${encodeURIComponent(redirectUri)}`,
          `&response_type=code`
        ].join('');
        break;
      }

      case 'naver': {
        const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
        const state = Math.random().toString(36).substring(2);
        authUrl = [
          'https://nid.naver.com/oauth2.0/authorize',
          `?client_id=${NAVER_CLIENT_ID}`,
          `&redirect_uri=${redirectUri}`,
          `&response_type=code`,
          `&state=${state}`
        ].join('');
        break;
      }
    }

    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <Wrapper>
      {recentLogin === loginType && <Bubble>최근에 로그인했어요</Bubble>}
      <SocialButton $bgColor={bgColor} onClick={handleLogin}>
        <SocialIcon src={icon} width={size} height={size} alt={loginType} />
      </SocialButton>
    </Wrapper>
  );
};

export default OauthButton;

const Wrapper = styled.div`
  width: 69px;
  height: 69px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SocialButton = styled.button<{ $bgColor: string }>`
  width: 69px;
  height: 69px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: none;
  background-color: ${({ $bgColor }) => $bgColor};
  cursor: pointer;
  transition: background-color 0.3s;
`;

const SocialIcon = styled(Image)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
  object-fit: contain;
`;

const Bubble = styled.div`
  height: 28px;
  position: absolute;
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${theme.colors.blue};
  color: ${theme.colors.white};
  padding: 5px 10px;
  border-radius: 8px;
  ${theme.fonts.caption03};
  white-space: nowrap;
  animation: ${float} 2s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    bottom: -9px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-width: 10px 6px 0 6px;
    border-style: solid;
    border-color: ${theme.colors.blue} transparent transparent transparent;
  }
`;
