"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";
import { useRouter } from "next/navigation";

export default function SigninStep3Check() {
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
        <ContentWrapper>
          레터링 서비스에서 수신자가 편지를 열람하기 전까지 편지 내용은
          암호화되어있습니다. <br />
          <br />
          수신자의 정확한 실명을 입력해야만 편지 내용을 확인할 수 있으며, 이는
          허가되지 않은 외부인으로부터의 편지 접근을 방지하기 위함입니다. <br />
          <br />
          실명 정보는 개인정보처리방침에 따라 편지 전달의 목적으로 수집합니다.
          개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게
          되었을 때에는 지체없이 해당 개인정보를 파기합니다.
        </ContentWrapper>
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
`;

const ContentWrapper = styled.div`
    padding: 10px;
    ${(props) => props.theme.fonts.body07};
    color: ${(props) => props.theme.colors.gray200};
`;

const HeaderTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.heading01};
    margin-top: 2.5rem;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
