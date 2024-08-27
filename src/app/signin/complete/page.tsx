"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import { useRouter } from "next/navigation";
import styled from "styled-components";

export default function Signin() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/login");
  };
  return (
    <Container>
      <MainWrapper>
        <NavigatorBar cancel={false} />
        <Header>
          <HeaderTitle>
            회원가입 완료!
            <br /> 레터링에 오신 걸 환영해요
          </HeaderTitle>
          <HeaderSubTitle>
            편지에 담긴 진심으로 나만의 우주를 채워보세요!
          </HeaderSubTitle>
        </Header>
      </MainWrapper>
      <Button
        buttonType="primary"
        text="다음"
        onClick={handleButtonClick}
      ></Button>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100%;
    color: white;
    padding: 25px;
    padding-bottom: 40px;
    background-image: url('/assets/signin/bg_signin_complete.svg'); 
    background-size: 100% auto; 
    background-position: center;
    background-repeat: no-repeat;
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
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
