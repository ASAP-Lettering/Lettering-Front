import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { setLetterUrl } from '@/utils/storage';
import Loader, { LoaderContainer } from '../common/Loader';

const SocialKakao = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const [redirectUrl, setRedirectUrl] = useState('');
  const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${redirectUrl}&response_type=code&url=${url}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(
        window.location.protocol +
          '//' +
          window.location.host +
          '/login/auth?type=kakao'
      );
    }
  }, []);

  const handleLogin = () => {
    //이때 localStorage에 저장된 accessToken이 만료되었는지 확인해야함.
    // if (accessToken) {
    //   if (url) {
    //     router.push(`/verify?url=${url}`);
    //   } else {
    //     router.push("/");
    //   }
    //   setAccessToken(accessToken);
    // } else {
    //받은 편지를 통해 들어올 경우 url를 저장한다.
    if (url) {
      setLetterUrl(url);
    }
    // redirectUri가 준비된 뒤에 인가 URL 생성
    const params = new URLSearchParams({
      client_id: REST_API_KEY,
      redirect_uri: redirectUrl,
      response_type: 'code'
    });
    if (url) {
      params.set('url', url);
    }

    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
    window.location.href = KAKAO_URL;
  };

  return (
    <SocialLoginBox onClick={handleLogin}>
      <StyledImage
        src="/assets/icons/ic_kakaotalk.svg"
        width={38}
        height={38}
        alt="kakao"
      />
    </SocialLoginBox>
  );
};

export default function SocialKakaoPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SocialKakao />
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
