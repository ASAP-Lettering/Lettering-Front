"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";

export default function Error() {
  return (
    <Container>
      <NavigatorBar title="페이지" cancel={false} />
      <MainWrapper>
        <Header></Header>
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
