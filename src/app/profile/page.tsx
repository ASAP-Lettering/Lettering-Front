"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";

export default function Error() {
  const name = "백승효";
  const email = "shyo0000@naver.com";
  const planetCount = 8;
  const letterCount = 42;
  return (
    <Container>
      <MainWrapper>
        <NavigatorBar title="마이페이지" cancel={false} />
        <ProfileHeader>
          <ProfileInfo>
            <ProfileName>{name}님의 프로필</ProfileName>
            <ProfileEmail>
              <img src="/assets/icons/ic_kakao_profile.svg" />
              {email}
            </ProfileEmail>
          </ProfileInfo>
          <ProfileBtn src="/assets/icons/ic_arrow_profile.svg" />
        </ProfileHeader>
        <CountContainer>
          <CountRaw>
            <CountTitle>내 편지</CountTitle>
            <CountValue>총 {letterCount}개</CountValue>
          </CountRaw>
          <CountRaw>
            <CountTitle>내 행성</CountTitle>
            <CountValue>총 {planetCount}개</CountValue>
          </CountRaw>
        </CountContainer>
        <Button
          buttonType="secondary"
          size="large"
          icon={true}
          text="보낸 편지함 보기"
        />
      </MainWrapper>
      <Line />
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

const ProfileHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 34px;
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const ProfileName = styled.div`
    ${(props: any) => props.theme.fonts.title01};
    color: ${(props: any) => props.theme.colors.white};
`;

const ProfileEmail = styled.div`
    ${(props: any) => props.theme.fonts.body09};
    color: ${(props: any) => props.theme.colors.gray400};
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    gap: 7px;
`;

const ProfileBtn = styled.img`
    cursor: pointer;
`;

const CountContainer = styled.div`
    border-radius: 8px;
    background-color: ${(props: any) => props.theme.colors.gray900};
    display: flex;
    flex-direction: column;
    padding: 14px 20px;
    gap: 10px;
    margin-top: 24px;
    margin-bottom: 12px;
`;

const CountRaw = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const CountTitle = styled.div`
    ${(props: any) => props.theme.fonts.body09};
    color: ${(props: any) => props.theme.colors.gray300};
`;

const CountValue = styled.div`
    ${(props: any) => props.theme.fonts.body08};
    color: ${(props: any) => props.theme.colors.white};
`;

const Line = styled.hr`
    height: 2px;
    background-color: ${(props) => props.theme.colors.gray800};
    border: none;
    margin: 0;
    margin-top : 11px;
`;
