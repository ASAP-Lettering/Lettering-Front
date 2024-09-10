"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";
import { useRouter } from "next/navigation";

export default function SignupStep3Check() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.back();
  };

  return (
    <Container>
      <MainWrapper>
        <NavigatorBar cancel={false} />
        <Header>
          <HeaderTitle>왜 실명 인증이 필요한가요?</HeaderTitle>
        </Header>
        <ContentWrapper></ContentWrapper>
      </MainWrapper>
      <ButtonWrapper>
        <Button
          buttonType="primary"
          text="확인"
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

const ContentWrapper = styled.div`
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
  ${(props) => props.theme.fonts.body07};
  color: ${(props) => props.theme.colors.gray300};
  padding-top: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
