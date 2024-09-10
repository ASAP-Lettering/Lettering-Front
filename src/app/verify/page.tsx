"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/common/Input";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { signinState, userInfo } from "@/recoil/signinStore";
import { signin } from "@/api/login/user";

export default function Verify() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isVaild, setIsVaild] = useState(true);
  const [user, setUser] = useRecoilState(userInfo);
  const [registerToken, setRegisterToken] = useRecoilState(signinState);

  const handleButtonClick = () => {
    //router.push(`/signin/complete`);
    signin({
      registerToken: registerToken,
      privatePermission: user.privatePermission,
      servicePermission: user.servicePermission,
      marketingPermission: user.marketingPermission,
      birthday: user.birthday,
      realName: name,
    })
      .then((res) => {
        console.log("accessToken", res.data.accessToken);
        localStorage.setItem("lettering_access", res.data.accessToken);
        localStorage.setItem("lettering_refresh", res.data.refreshToken);
      })
      .catch((error) => {
        console.log(error);
        router.push("/error");
        return;
      });

    router.push(`/verify/`);
    console.log(user);
  };

  return (
    <Container>
      <MainWrapper>
        <NavigatorBar cancel={false} />
        <Header>
          <HeaderTitle>
            편지를 열람하기 전<br />
            먼저 본인 인증이 필요해요
          </HeaderTitle>
          <HeaderSubTitle>
            정확한 인증을 위해 실명을 입력해주세요
          </HeaderSubTitle>
        </Header>
        <InputWrapper>
          <Input
            inputType="underline"
            value={name}
            onChange={setName}
            placeholder="ex)홍길동"
            isValid={isVaild}
            isValidChange={setIsVaild}
            errorMessage="단독 자음, 모음만 쓸 수 없어요 (ex) ㄱ, ㅏ)"
          />
        </InputWrapper>
      </MainWrapper>
      <ButtonWrapper>
        <DescriptionText onClick={() => router.push("/signin/step3/check")}>
          왜 실명 인증이 필요한가요?
        </DescriptionText>
        <Button
          buttonType="primary"
          text="다음"
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
    margin-bottom: 100px;
`;

const InputWrapper = styled.div`
    padding: 10px;
`;

const DescriptionText = styled.button`
    ${(props) => props.theme.fonts.regular14};
    color: ${(props) => props.theme.colors.gray400};
    text-decoration: underline;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 23px;
    cursor: pointer;
`;

const HeaderTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.heading01};
    margin-top: 2.5rem;
`;

const HeaderSubTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.body07};
    color: ${(props) => props.theme.colors.gray300};
    padding-top: 10px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
