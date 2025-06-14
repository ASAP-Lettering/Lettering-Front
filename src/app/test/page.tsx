'use client';

import Button from '@/components/common/Button';
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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Android에서만 beforeinstallprompt 이벤트 처리
    if (isAndroidDevice) {
      const handler = (e: any) => {
        console.log('🔥 beforeinstallprompt 발생');
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (isAndroid && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('Android 사용자 선택:', outcome);
      setDeferredPrompt(null);
      setShowModal(false);
    } else if (isIOS) {
      // iOS는 안내만
      alert(
        'iPhone 사용자는 Safari에서 공유 버튼을 눌러 [홈 화면에 추가]를 선택해주세요!'
      );
      setShowModal(false);
    } else {
      alert('설치 기능이 현재 환경에서 지원되지 않습니다.');
      setShowModal(false);
    }
  };

  const handleShowModal = () => {
    if (isAndroid && deferredPrompt) {
      setShowModal(true);
    } else if (isIOS) {
      setShowModal(true);
    } else {
      alert('브라우저가 아직 설치를 허용하지 않았습니다.');
    }
  };

  return (
    <Container>
      <Title>PWA 설치 유도 TEST</Title>
      <Button
        buttonType="primary"
        text="앱 설치하기"
        onClick={handleShowModal}
      />
      {showModal && (
        <ConfirmModal
          title="PWA 설치하기"
          sub={
            isIOS
              ? 'Safari 공유 버튼을 눌러 [홈 화면에 추가]를 선택해주세요.'
              : '홈 화면에 추가하시겠어요?'
          }
          confirmText={isIOS ? '알겠습니다' : '설치하기'}
          cancelText="취소"
          onConfirm={handleInstallClick}
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
  justify-content: space-between;
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
  text-align: center;
`;
