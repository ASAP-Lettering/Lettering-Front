'use client';

import Button from '@/components/common/Button/Button';
import NavigatorBar from '@/components/common/NavigatorBar';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/common/Input';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import useMeasure from 'react-use-measure';
import BottomSheet from '@/components/common/BottomSheet';
import { Suspense, useState } from 'react';
import Loader, { LoaderContainer } from '@/components/common/Loader';
import { signupState, userInfo } from '@/recoil/signupStore';
import { signup } from '@/api/login/user';
import {
  clearAnonymousSendLetterCode,
  getAnonymousSendLetterCode,
  setTokens
} from '@/utils/storage';
import { useToast } from '@/hooks/useToast';
import { checkKorean } from '@/utils/checkKorean';

const SignupStep2 = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [viewportRef, { height: viewportHeight }] = useMeasure();
  const [isBottomUp, setIsBottomUp] = useState(false);
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isVaild, setIsVaild] = useState(true);
  const [user, setUser] = useRecoilState(userInfo);
  const [registerToken, setRegisterToken] = useRecoilState(signupState);
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  const [anonymousCode, setAnonymousCode] = useState<string | null>(null);

  useEffect(() => {
    const code = getAnonymousSendLetterCode();
    setAnonymousCode(code);
  }, []);

  const handleButtonClick = () => {
    if (canSignin()) {
      setIsBottomUp(true);
    } else {
      showToast('형식에 맞지 않는 이름입니다!', {
        icon: true,
        close: false,
        bottom: '120px'
      });
      setIsDisplayed(false);
    }
  };

  useEffect(() => {
    if (isBottomUp) {
      setIsDisplayed(true);
    } else {
      setTimeout(() => {
        setIsDisplayed(false);
      }, 490);
    }
  }, [isBottomUp]);

  const handleLoginClick = () => {
    signup({
      registerToken: registerToken,
      privatePermission: user.privatePermission,
      servicePermission: user.servicePermission,
      marketingPermission: user.marketingPermission,
      realName: name,
      anonymousSendLetterCode: anonymousCode
    })
      .then((res) => {
        console.log('accessToken', res.data.accessToken);
        setTokens(res.data.accessToken, res.data.refreshToken);
        clearAnonymousSendLetterCode();
        if (url) {
          router.push(`/signup/complete?url=${url}`);
        } else {
          router.push(`/signup/complete`);
          console.log(user);
        }
      })
      .catch((error) => {
        console.log(error);
        router.push('/error');
        return;
      });

    console.log(user);
  };

  const canSignin = () => {
    if (isVaild && name.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleBottomUpChange = (state: boolean) => {
    setIsBottomUp(state);
  };

  return (
    <Container ref={viewportRef}>
      {isDisplayed && (
        <BottomSheet
          height={353}
          title={`'${name}'${checkKorean(name)} 본인 이름이 맞나요?`}
          subtitle="본인의 이름이 아닐 경우, 편지를 보내거나 받을 때에
          오류가 발생할 수 있어요"
          isOpen={isBottomUp}
          handleOpen={handleBottomUpChange}
          onConfirm={handleLoginClick}
          confirmText="네, 맞아요"
        />
      )}
      <MainWrapper>
        <NavigatorBar cancel={false} />
        <Header>
          <HeaderTitle>
            회원가입을 하기 전
            <br />
            먼저 실명 입력이 필요해요
          </HeaderTitle>
          <HeaderSubTitle>
            반드시 ‘성+이름’의 실명으로 작성해주세요
          </HeaderSubTitle>
        </Header>
        <InputWrapper>
          <Input
            inputType="signup"
            value={name}
            onChange={setName}
            placeholder="ex) 홍길동"
            isValid={isVaild}
            isValidChange={setIsVaild}
            errorMessage="단독 자음, 모음만 쓸 수 없어요 (ex) ㄱ, ㅏ)"
          />
        </InputWrapper>
      </MainWrapper>
      <ButtonWrapper>
        <DescriptionText onClick={() => router.push('/info')}>
          왜 실명 인증이 필요한가요?
        </DescriptionText>
        <Button
          buttonType="primary"
          text="다음"
          disabled={!name}
          onClick={handleButtonClick}
        ></Button>
      </ButtonWrapper>
    </Container>
  );
};

export default function SignupStep2Paging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SignupStep2 />
    </Suspense>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  min-height: 100%;
  color: white;
  background: ${(props) => props.theme.colors.bg};
  padding: 25px;
  padding-bottom: 40px;
  position: relative;
  overflow: hidden;
`;

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 100px;
`;

const InputWrapper = styled.div`
  padding: 10px;
`;

const DescriptionText = styled.button`
  ${(props) => props.theme.fonts.regular14};
  color: ${(props) => props.theme.colors.gray400};
  text-decoration: underline;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 23px;
  cursor: pointer;
`;

const HeaderTitle = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.heading01};
  margin-top: 2.5rem;
`;

const HeaderSubTitle = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.body07};
  color: ${(props) => props.theme.colors.gray300};
  padding-top: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
