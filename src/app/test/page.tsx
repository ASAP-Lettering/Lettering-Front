'use client';

import Button from '@/components/common/Button/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import { theme } from '@/styles/theme';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const page = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>(
    'other'
  );
  const [isKakaoInApp, setIsKakaoInApp] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isKakao = /kakaotalk/i.test(userAgent);

    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other');
    setIsKakaoInApp(isKakao);

    if (isKakao) {
      if (isAndroid) {
        const currentUrl = window.location.href;
        const intentUrl = `intent://${currentUrl.replace(
          /^https?:\/\//,
          ''
        )}#Intent;scheme=https;package=com.android.chrome;end`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        alert(
          '화면 우측 하단 공유하기 메뉴에서 "Safari로 열기"를 선택해주세요.'
        );
      }
    } else {
      if (isAndroid) {
        const handler = (e: any) => {
          e.preventDefault();
          setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
      }

      // 외부 브라우저일 경우 진입 시 설치 모달 자동 오픈
      setShowModal(true);
    }
  }, []);

  const handleInstall = async () => {
    if (platform === 'android' && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('설치 결과:', outcome);
      if (outcome === 'accepted') {
        alert('설치가 완료되었습니다!');
      } else {
        alert('설치가 취소되었습니다.');
      }
      setDeferredPrompt(null);
      setShowModal(false);
    } else if (platform === 'ios') {
      alert('하단 공유 버튼을 누르고 "홈 화면에 추가"를 선택해주세요.');
      setShowModal(false);
    } else {
      alert('현재 환경에서는 설치가 지원되지 않습니다.');
      setShowModal(false);
    }
  };

  return (
    <Container>
      <Title>PWA 설치 유도 TEST</Title>
      <Button
        buttonType="primary"
        text="앱 설치하기"
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <ConfirmModal
          title="앱 설치하기"
          sub={
            platform === 'ios'
              ? '홈 화면에 추가하시겠어요?'
              : '앱을 설치하시겠어요?'
          }
          confirmText="설치하기"
          cancelText="취소"
          onConfirm={handleInstall}
          onCancel={() => setShowModal(false)}
        />
      )}
    </Container>
  );
};

export default page;

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 100px 30px;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  background-image: url('/assets/login/login_bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  -webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.h1`
  color: ${theme.colors.white};
  ${theme.fonts.title01}
  text-align: center;
`;
