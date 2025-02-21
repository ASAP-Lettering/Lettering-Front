'use client';

import { getLetterCount } from '@/api/letter/letter';
import { getUserInfo, logout } from '@/api/mypage/user';
import Button from '@/components/common/Button';
import Loader, { LoaderContainer } from '@/components/common/Loader';
import NavigatorBar from '@/components/common/NavigatorBar';
import { theme } from '@/styles/theme';
import { clearOnboarding, clearTokens, getRefreshToken } from '@/utils/storage';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';

const MyPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [planetCount, setPlanetCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
    fetchGetCount();
  }, []);

  useEffect(() => {
    if (name.length > 0 && email.length > 0) {
      setLoading(false);
    }
  }, [name, email]);

  const goToLetterType = () => {
    router.push('/mypage/lettertype');
  };

  const handleLogout = async () => {
    let refreshToken = getRefreshToken();

    if (refreshToken) {
      await logout(refreshToken)
        .then((res) => {
          console.log(res.data);
          clearTokens();
          clearOnboarding();
          router.push('/login');
        })
        .catch((err) => console.log(err));
    }
  };

  const goToSendedLetter = () => {
    router.push('/mypage/send');
  };

  const goToAcountDelete = () => {
    router.push('/mypage/delete');
  };

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      setName(response.data.name);
      setEmail(response.data.email);
      console.log('회원정보 조회 성공:', response.data);
    } catch (error) {
      console.error('회원정보 조회 실패:', error);
    }
  };

  const fetchGetCount = async () => {
    try {
      const response = await getLetterCount();
      setLetterCount(response.data.letterCount);
      setPlanetCount(response.data.spaceCount);
    } catch (error) {
      console.error('편지수, 행성수 조회 실패:', error);
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
          <NavigatorBarWrapper>
            <NavigatorBar title="마이페이지" cancel={false} url="/planet" />
          </NavigatorBarWrapper>
          <MainContainer>
            <MainWrapper>
              <ProfileHeader>
                <ProfileImage src="/assets/profile/img_profile_letter.png" />
                <ProfileInfo>
                  <ProfileName>{name}님의 스페이스</ProfileName>
                  <ProfileEmail>
                    <img src="/assets/icons/ic_kakao_profile.svg" />
                    <div>{email}</div>
                  </ProfileEmail>
                  <CountRaw>
                    <CountTitle>행성</CountTitle>
                    <CountValue>{planetCount}개</CountValue>
                    <CountDivider />
                    <CountTitle>편지</CountTitle>
                    <CountValue>{letterCount}개</CountValue>
                  </CountRaw>
                </ProfileInfo>
              </ProfileHeader>
              <MenuWrapper onClick={goToSendedLetter}>
                <TitleWrapper>
                  <MenuTitle>
                    <img src="/assets/icons/ic_letter.svg" />
                    내가 보낸 편지
                  </MenuTitle>
                  <ProfileBtn src="/assets/icons/ic_arrow_profile.svg" />
                </TitleWrapper>
              </MenuWrapper>
            </MainWrapper>
            <DivDivder />
            <SettingWrapper>
              <SettingContainer>
                <MenuWrapper onClick={goToLetterType}>
                  <SettingTitle>설정</SettingTitle>
                  <TitleWrapper>
                    <MenuTitle>
                      <TextWrapper>
                        편지 날짜 보기
                        <MenuSubTitle>
                          편지 이름과 날짜를 함께 확인할 수 있어요
                        </MenuSubTitle>
                      </TextWrapper>
                    </MenuTitle>
                    <ProfileBtn src="/assets/icons/ic_arrow_profile.svg" />
                  </TitleWrapper>
                </MenuWrapper>
              </SettingContainer>
              <SettingContainer>
                <MenuWrapper>
                  <SettingTitle>내 계정</SettingTitle>
                  <TitleWrapper onClick={handleLogout}>
                    <MenuTitle>로그아웃</MenuTitle>
                    <ProfileBtn src="/assets/icons/ic_arrow_profile.svg" />
                  </TitleWrapper>
                  <TitleWrapper onClick={goToAcountDelete}>
                    <MenuTitle>회원탈퇴</MenuTitle>
                    <ProfileBtn src="/assets/icons/ic_arrow_profile.svg" />
                  </TitleWrapper>
                </MenuWrapper>
              </SettingContainer>
            </SettingWrapper>
            <img src="/assets/icons/ic_version.svg" />
            <VersionText>Version 1.0</VersionText>
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
  overflow-x: hidden;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  color: white;
  background: ${(props) => props.theme.colors.bg};
`;

const NavigatorBarWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 24px 0 24px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  padding: 24px;
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props: any) => props.theme.colors.gray800};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props: any) => props.theme.colors.gray600};
    border-radius: 10px;
  }
`;

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const ProfileHeader = styled.div`
  height: 144px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 25px;

  @media (max-width: 370px) {
    gap: 10px;
  }
`;

const ProfileImage = styled.img`
  width: 143px;
  height: auto;

  @media (max-width: 370px) {
    width: 100px;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  padding-right: 15px;
`;

const ProfileName = styled.div`
  ${(props: any) => props.theme.fonts.title01};
  color: ${(props: any) => props.theme.colors.white};

  @media (max-height: 628px) {
    ${theme.fonts.title02};
  }
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

  @media (max-height: 628px) {
    width: 20px;
  }
`;

const CountRaw = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center; /* 세로 중앙 정렬 */
`;

const CountDivider = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${(props: any) => props.theme.colors.gray400};
  margin: 0 8px;
`;

const DivDivder = styled.div`
  width: 100vw;
  height: 2px;
  flex-shrink: 0;
  margin-top: 40px;
  margin-bottom: 20px;
  background-color: ${(props: any) => props.theme.colors.gray900};
`;

const CountTitle = styled.div`
  ${(props: any) => props.theme.fonts.body09};
  color: ${(props: any) => props.theme.colors.gray300};

  @media (max-height: 628px) {
    ${theme.fonts.body17};
  }
`;

const CountValue = styled.div`
  ${(props: any) => props.theme.fonts.body08};
  color: ${(props: any) => props.theme.colors.white};

  @media (max-height: 628px) {
    ${theme.fonts.body18};
  }
`;

const Line = styled.hr`
  height: 2px;
  background-color: ${(props) => props.theme.colors.gray800};
  border: none;
  margin: 0;
  margin-top: 11px;
`;

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SettingTitle = styled.div`
  ${(props: any) => props.theme.fonts.body08};
  color: ${(props: any) => props.theme.colors.gray100};
  margin-bottom: 10px;

  @media (max-height: 628px) {
    ${theme.fonts.body16};
  }
`;

const MenuTitle = styled.div`
  display: flex;
  gap: 11px;
  text-align: left;
  align-items: center;
  ${(props: any) => props.theme.fonts.body06};
  color: ${(props: any) => props.theme.colors.white};

  @media (max-height: 628px) {
    ${theme.fonts.body16};
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MenuSubTitle = styled.div`
  ${(props: any) => props.theme.fonts.caption04};
  color: ${(props: any) => props.theme.colors.gray500};

  @media (max-height: 628px) {
    ${theme.fonts.body13};
  }
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 8px;
  gap: 10px;
  padding: 19px;
  background-color: ${(props: any) => props.theme.colors.gray800};
  cursor: pointer;
`;

const SettingContainer = styled.div`
  padding: 10px 0;
`;

const VersionText = styled.div`
  margin-top: 4px;
  color: var(--gray-700, #2e3040);
  font-family: Pretendard;
  font-size: 11.844px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
