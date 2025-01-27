"use client";

import { theme } from "@/styles/theme";
import React from "react";
import styled from "styled-components";

interface StoreLayoutProps {
  children: React.ReactNode;
}

const StoreLayout = ({ children }: StoreLayoutProps) => {
  return <Container>{children}</Container>;
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
