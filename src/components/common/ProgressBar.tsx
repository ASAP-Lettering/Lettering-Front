import { theme } from "@/styles/theme";
import React from "react";
import styled from "styled-components";

interface ProgressBarProps {
  current: number;
  total: number;
  currentColor?: string;
  backgroundColor?: string;
}
const ProgressBar = (props: ProgressBarProps) => {
  const {
    current,
    total,
    currentColor = theme.colors.white,
    backgroundColor = theme.colors.gray800,
  } = props;

  return (
    <Container $backgroundColor={backgroundColor}>
      <CurrentBar $ratio={current / total} $currentColor={currentColor} />
    </Container>
  );
};

export default ProgressBar;

const Container = styled.div<{ $backgroundColor: string }>`
  width: 100%;
  height: 4px;
  background: ${(props) => props.$backgroundColor};
  border-radius: 200px;
`;

const CurrentBar = styled.div<{ $ratio: number; $currentColor: string }>`
  width: ${(props) => `calc(100% * ${props.$ratio})`};
  height: 100%;
  background: ${(props) => props.$currentColor};
  border-radius: 200px;
  transition: width 0.3s ease-in-out;
`;
