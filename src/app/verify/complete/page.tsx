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
          <HeaderTitle>본인 인증이 완료되었어요</HeaderTitle>
          <HeaderSubTitle>
            받은 편지 속, 소중한 마음을 읽고 저장해볼까요?
          </HeaderSubTitle>
        </Header>
      </MainWrapper>
      <Button
        buttonType="primary"
        text="편지 바로 열기"
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
    background:${(props) => props.theme.colors.bg};
    background-image: url('/assets/signin/bg_verify_complete.svg'); 
    background-size: 550px auto; 
    background-position: bottom 80px center;
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
