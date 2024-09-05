"use client";

import Button from "@/components/common/Button";
import styled from "styled-components";

export default function Error() {
  return (
    <Container>
      <MainWrapper>
        <Header>
          <HeaderTitle>Error</HeaderTitle>
          <HeaderSubTitle>
            일시적인 오류로 서버와 연결이 끊겼습니다 <br />
            잠시 후 다시 시도해주세요
          </HeaderSubTitle>
        </Header>
      </MainWrapper>
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
