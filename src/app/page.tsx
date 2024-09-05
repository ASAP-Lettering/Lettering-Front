"use client";

import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styled from "styled-components";

export default function Home() {
  const router = useRouter();
  const accessToken = localStorage.getItem("lettering_access");

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("lettering_access");
    localStorage.removeItem("lettering_refresh");
    router.push("/login");
  };

  return (
    <Container>
      <div>MainPage</div>
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
  height: 100%;
  max-height: 852px;
`;
