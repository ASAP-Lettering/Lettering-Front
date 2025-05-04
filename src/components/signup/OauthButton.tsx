import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { setLetterUrl } from '@/utils/storage';
import { OAuthType } from '@/types/login';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    <SocialButton $bgColor={bgColor} onClick={handleLogin}>
      <SocialIcon src={icon} width={size} height={size} alt={loginType} />
    </SocialButton>
  );
};

export default OauthButton;

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
