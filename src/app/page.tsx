'use client';

import Loader, { LoaderContainer } from '@/components/common/Loader';
import { getAccessToken } from '@/utils/storage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function Home() {
  const router = useRouter();
  const accessToken = getAccessToken();

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    } else {
      router.push('/planet');
    }
  }, []);

  return (
    <Container>
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  height: 100vh;
  padding: 25px;
  background: ${(props) => props.theme.colors.bg};
`;
