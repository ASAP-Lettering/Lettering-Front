"use client";

import Button from "@/components/common/Button";
import styled from "styled-components";

export default function Error() {
  return (
    <Container>
      <MainWrapper>
        <Header>
          <HeaderTitle>네트워크에 접속할 수 없어요</HeaderTitle>
          <HeaderSubTitle>
            Wi-Fi 또는 데이터 연결 상태를 확인한 후<br />
            다시 시도해주세요.
          </HeaderSubTitle>
        </Header>
        <ErrorImage src="/assets/error/img_error_wifi.png" />
      </MainWrapper>
      <Button buttonType="primary" size="large" text="다시 시도" />
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
    justify-content: center;
    align-items: center;
`;

const Header = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 10px;
    margin-bottom: 5rem;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const HeaderTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.heading01};
    margin-top: 5rem;
`;

const HeaderSubTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.body09};
    color: ${(props) => props.theme.colors.gray300};
    padding-top: 10px;
`;

const ErrorImage = styled.img`
    width: 204px;
    height: auto;
`;
