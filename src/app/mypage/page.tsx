"use client";

import { getLetterCount } from "@/api/letter/letter";
import { getUserInfo, logout } from "@/api/mypage/user";
import Button from "@/components/common/Button";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import { clearTokens, getRefreshToken } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const MyPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [planetCount, setPlanetCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const goToProfile = () => {
    router.push("/profile");
  };

  useEffect(() => {
    fetchUserInfo();
    fetchGetCount();
  }, []);

  const goToLetterType = () => {
    router.push("/mypage/lettertype");
  };

  const handleLogout = async () => {
    let refreshToken = getRefreshToken();

    if (refreshToken) {
      await logout(refreshToken)
        .then((res) => {
          console.log(res.data);
          clearTokens();
          router.push("/login");
        })
        .catch((err) => console.log(err));
    }
  };

  const goToSendedLetter = () => {
    router.push("/mypage/send");
  };

  const goToAcountDelete = () => {
    router.push("/mypage/delete");
  };

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      setName(response.data.name);
      setEmail(response.data.email);
      console.log("회원정보 조회 성공:", response.data);
    } catch (error) {
      console.error("회원정보 조회 실패:", error);
    }
  };

  const fetchGetCount = async () => {
    try {
      const response = await getLetterCount();
      setLetterCount(response.data.letterCount);
      setPlanetCount(response.data.spaceCount);
      setLoading(false);
    } catch (error) {
      console.error("편지수, 행성수 조회 실패:", error);
    }
  };

  return (
    <Container>
      {loading ? (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      ) : (
        <>
          <Wrapper>
            <NavigatorBar title="마이페이지" cancel={false} url="/planet" />
          </Wrapper>
          <MainContainer>
            <MainWrapper>
              <ProfileHeader>
                <ProfileInfo>
                  <ProfileName>{name}님의 프로필</ProfileName>
                  <ProfileEmail>
                    <img src="/assets/icons/ic_kakao_profile.svg" />
                    <div>{email}</div>
                  </ProfileEmail>
                </ProfileInfo>
                <ProfileBtn
                  src="/assets/icons/ic_arrow_profile.svg"
                  onClick={goToProfile}
                />
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
                onClick={goToSendedLetter}
              />
            </MainWrapper>
            <Line />
            <SettingWrapper>
              <SettingContainer>
                <SettingTitle>설정</SettingTitle>
                <MenuWrapper onClick={goToLetterType}>
                  <div>
                    <MenuTitle>편지 날짜 보기</MenuTitle>
                    <MenuSubTitle>
                      편지 이름과 날짜를 함께 확인할 수 있어요
                    </MenuSubTitle>
                  </div>
                  <ProfileBtn src="/assets/icons/ic_arrow_profile.svg" />
                </MenuWrapper>
              </SettingContainer>
              <SettingContainer>
                <SettingTitle>내 계정</SettingTitle>
                <MenuWrapper onClick={handleLogout}>
                  <div>
                    <MenuTitle>로그아웃</MenuTitle>
                  </div>
                  <ProfileBtn src="/assets/icons/ic_arrow_profile.svg" />
                </MenuWrapper>
                <MenuWrapper onClick={goToAcountDelete}>
                  <div>
                    <MenuTitle>탈퇴</MenuTitle>
                  </div>
                  <ProfileBtn src="/assets/icons/ic_arrow_profile.svg" />
                </MenuWrapper>
              </SettingContainer>
            </SettingWrapper>
          </MainContainer>
        </>
      )}
    </Container>
  );
};

export default function MyPagePaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <MyPage />
    </Suspense>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    //justify-content: space-between;
    color: white;
    background:${(props) => props.theme.colors.bg};
`;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    overflow-y: auto;
    box-sizing: border-box;
    width: 100%;
    &::-webkit-scrollbar {
        width: 5px; /* Width of the scrollbar */
    }

    &::-webkit-scrollbar-track {
        background: ${(props: any) => props.theme.colors.gray800};
        border-radius: 10px; /* Rounded corners */
    }

    &::-webkit-scrollbar-thumb {
        background: ${(props: any) => props.theme.colors.gray600};
        border-radius: 10px; /* Rounded corners */
    }
`;

const MainWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;

const ProfileHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    flex-direction: row;
    justify-content: flex-start;
    gap: 7px;
`;

const ProfileBtn = styled.img`
    width: 24px;
    height: auto;
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

const SettingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const SettingTitle = styled.div`
    ${(props: any) => props.theme.fonts.body07};
    color: ${(props: any) => props.theme.colors.gray100};
    margin-bottom: 10px;
`;

const MenuTitle = styled.div`
    ${(props: any) => props.theme.fonts.body06};
    color: ${(props: any) => props.theme.colors.white};
`;

const MenuSubTitle = styled.div`
    ${(props: any) => props.theme.fonts.caption04};
    color: ${(props: any) => props.theme.colors.gray500};
`;

const MenuWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 0;
    cursor: pointer;
`;

const SettingContainer = styled.div`
    padding: 10px 0;
`;

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 24px;
`;
