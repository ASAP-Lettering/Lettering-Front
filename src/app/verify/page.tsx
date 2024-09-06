"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/common/Input";
import { useState } from "react";

export default function Signin() {
  const router = useRouter();
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const handleButtonClick = () => {
    // router.push(`/verify/complete?url=${url}`);
  };

  return (
    <Container>
      <MainWrapper>
        <NavigatorBar cancel={false} />
        <Header>
          <HeaderTitle>
            편지를 열람하기 전<br />
            먼저 본인 인증이 필요해요
          </HeaderTitle>
          <HeaderSubTitle>
            정확한 인증을 위해 실명을 입력해주세요
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
        <DescriptionText>왜 실명 인증이 필요한가요?</DescriptionText>
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
  background: ${(props) => props.theme.colors.bg};
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

const DescriptionText = styled.div`
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
  ${(props) => props.theme.fonts.regular16};
  color: ${(props) => props.theme.colors.gray300};
  padding-top: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
