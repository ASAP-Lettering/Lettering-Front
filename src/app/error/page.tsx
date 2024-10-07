"use client";

import Button from "@/components/common/Button";
import styled from "styled-components";

export default function Error() {
  return (
    <Container>
      <MainWrapper>
        <Header>
          <HeaderTitle>페이지를 찾을 수 없어요</HeaderTitle>
          <HeaderSubTitle>
            찾으려는 페이지의 주소가 잘못 입력 되었거나,
            <br />
            주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.
            <br />
            입력하신 페이지의 주소가 정확한지 다시 한 번 확인해주세요.
          </HeaderSubTitle>
        </Header>
        <ErrorImage src="/assets/error/img_error_page.png" />
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
