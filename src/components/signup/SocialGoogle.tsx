import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { setLetterUrl } from '@/utils/storage';
import Loader, { LoaderContainer } from '../common/Loader';

const SocialGoogle = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [absoluteUrl, setabsoluteUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setabsoluteUrl(
        window.location.protocol +
          '//' +
          window.location.host +
          '/login/auth?type=google'
      );
    }
  }, []);

  const handleLogin = () => {
    if (url) {
      setLetterUrl(url);
    }
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const scope = 'openid profile email';

    const authUrl = [
      'https://accounts.google.com/o/oauth2/v2/auth',
      `?client_id=${GOOGLE_CLIENT_ID}`,
      `&redirect_uri=${encodeURIComponent(absoluteUrl)}`,
      `&response_type=code`,
      `&scope=${encodeURIComponent(scope)}`,
      `&access_type=offline`,
      `&prompt=consent`
    ].join('');
    window.location.href = authUrl;
  };

  return (
    <SocialLoginBox onClick={handleLogin}>
      <StyledImage
        src="/assets/icons/ic_google.svg"
        width={33}
        height={33}
        alt="google"
      />
    </SocialLoginBox>
  );
};

export default function SocialGooglePaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SocialGoogle />
    </Suspense>
  );
}

const SocialLoginBox = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
  object-fit: contain;
`;
