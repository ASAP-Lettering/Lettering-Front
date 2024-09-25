"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";

export default function Profile() {
  const name = "백승효";
  const email = "shyo0000@naver.com";
  const planetCount = 8;
  const letterCount = 42;
  return (
    <Container>
      <MainWrapper>
        <NavigatorBar title="내 프로필" cancel={false} />
      </MainWrapper>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100%;
    color: white;
    background:${(props) => props.theme.colors.bg};
    padding-bottom: 40px;
`;

const MainWrapper = styled.div`
    display: flex;
    padding: 25px;
    flex-direction: column;
`;
