'use client';

import Loader, { LoaderContainer } from '@/components/common/Loader';
import NavigatorBar from '@/components/common/NavigatorBar';
import ProgressBar from '@/components/common/ProgressBar';
import { theme } from '@/styles/theme';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import styled from 'styled-components';

interface SendLayoutProps {
  children: React.ReactNode;
}

const SendLayout = ({ children }: SendLayoutProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';

  const current =
    pathname === '/send/receiver'
      ? 1
      : pathname === '/send/content'
      ? 2
      : isGuest
      ? pathname === '/send/sender'
        ? 3
        : pathname === '/send/template'
        ? 4
        : null
      : pathname === '/send/template'
      ? 3
      : null;

  return (
    <Container>
      <NavigatorBarWrapper>
        <NavigatorBar title="편지 보내기" cancel={false} />
      </NavigatorBarWrapper>
      {current && (
        <ProgressBarWrapper>
          <ProgressBar current={current} total={isGuest ? 4 : 3} />
        </ProgressBarWrapper>
      )}
      {children}
    </Container>
  );
};

export default function SendLayouting({ children }: SendLayoutProps) {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SendLayout>{children}</SendLayout>
    </Suspense>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: hidden;
  gap: 7px;
  padding: 20px;
  background-color: ${theme.colors.bg};
  position: relative;

  @media (max-height: 550px) {
    padding-top: 0px;
  }
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  padding: 32px 0 72px 0;

  @media (max-height: 795px) {
    padding: 24px 0 40px 0;
  }

  @media (max-height: 650px) {
    padding: 20px 0 36px 0;
  }

  @media (max-height: 580px) {
    padding: 15px 0 36px 0;
  }
`;

const NavigatorBarWrapper = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  position: relative;
`;
