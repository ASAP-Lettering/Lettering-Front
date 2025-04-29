import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { accessState } from '@/recoil/accessStore';
import { getAccessToken, setLetterUrl } from '@/utils/storage';
import Loader, { LoaderContainer } from '../common/Loader';

const SocialGoogle = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const GOOGLE_URL = '/login/google';
  const [absoluteUrl, setabsoluteUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setabsoluteUrl(
        window.location.protocol + '//' + window.location.host + '/login/kakao'
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
    window.location.href = GOOGLE_URL;
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
