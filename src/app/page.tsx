"use client";

import { getAllSpaceName } from "@/api/login/user";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import { clearTokens, getAccessToken } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function Home() {
  const router = useRouter();
  const accessToken = getAccessToken();
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    } else {
      setIsLoading(false);
      //token이 유효한지 테스트용
      getAllSpaceName(accessToken)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }, []);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  //로딩 처리 화면
  if (isloading) {
    return (
      <Container>
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        buttonType="primary"
        text="로그아웃하기"
        onClick={handleLogout}
      ></Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  height: 100vh;
  padding: 25px;
  background: ${(props) => props.theme.colors.bg};
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
