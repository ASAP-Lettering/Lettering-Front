"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/common/Input";
import { useState } from "react";

export default function SigninStep3() {
  const router = useRouter();
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const handleButtonClick = () => {
    router.push(`/signin/complete`);
  };

  function isValidKoreanInput(input: string): boolean {
    // 자음
    const consonants = /[\u1100-\u115F\uA960-\uA97F]/;
    // 모음
    const vowels = /[\u1160-\u11A7\uD7B0-\uD7C6]/;
    if (consonants.test(input) || vowels.test(input)) {
      return false;
    }
    return true;
  }

  return (
    <Container>
      <MainWrapper>
        <NavigatorBar cancel={false} />
        <Header>
          <HeaderTitle>
            회원가입을 하기 전
            <br />
            먼저 본인 인증이 필요해요
          </HeaderTitle>
          <HeaderSubTitle>
            별명이 아닌 정확한 실명을 입력해주세요
          </HeaderSubTitle>
        </Header>
        <InputWrapper>
          <Input
            inputType="underline"
            value={name}
            onChange={setName}
            placeholder="ex)홍길동"
          />
        </InputWrapper>
      </MainWrapper>
      <ButtonWrapper>
        <DescriptionText onClick={() => router.push("/signin/step3/check")}>
          왜 실명 인증이 필요한가요?
        </DescriptionText>
        <Button
          buttonType="primary"
          text="다음"
          onClick={handleButtonClick}
        ></Button>
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100%;
    color: white;
    background:${(props) => props.theme.colors.bg};
    padding: 25px;
    padding-bottom: 40px;
`;

const MainWrapper = styled.div`
    display: flex;
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
