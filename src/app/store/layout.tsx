"use client";

import NavigatorBar from "@/components/common/NavigatorBar";
import ProgressBar from "@/components/common/ProgressBar";
import { theme } from "@/styles/theme";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import styled from "styled-components";

interface StoreLayoutProps {
  children: React.ReactNode;
}

const StoreLayout = ({ children }: StoreLayoutProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const letterId = searchParams.get("letterId");
  const current =
    pathname === "/store/receiver"
      ? 1
      : pathname === "/store/content"
      ? 2
      : pathname === "/store/template"
      ? 3
      : null;

  return (
    <Container>
      <NavigatorBar
        title={letterId ? "받은 편지 보관하기" : "편지 수정하기"}
        cancel={false}
      />
      {current && (
        <ProgressBarWrapper>
          <ProgressBar current={current} total={3} />
        </ProgressBarWrapper>
      )}
      {children}
    </Container>
  );
};

export default StoreLayout;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  gap: 7px;
  padding: 20px;
  background-color: ${theme.colors.bg};
  position: relative;

  @media (max-height: 550px) {
    padding-top: 0px;
  }
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  padding: 32px 0 56px 0;
`;
