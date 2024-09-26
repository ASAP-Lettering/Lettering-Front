import { theme } from "@/styles/theme";
import React from "react";
import styled from "styled-components";

interface PageBarProps {
  currentPage: number;
  totalPage: number;
}

const PageBar = (props: PageBarProps) => {
  const { currentPage, totalPage } = props;

  return (
    <Container>
      <BarWrapper>
        <CurrentBar $widthRatio={currentPage / totalPage} />
      </BarWrapper>
      <Page>
        <Current>{currentPage}</Current>/{totalPage}
      </Page>
    </Container>
  );
};

export default PageBar;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  gap: 8px;
`;

const BarWrapper = styled.div`
  width: 100%;
  height: 4px;
  position: relative;
  border-radius: 200px;
  background: ${theme.colors.gray800};
`;

const CurrentBar = styled.div<{ $widthRatio: number }>`
  width: calc(100% * ${({ $widthRatio }) => $widthRatio});
  height: 4px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 200px;
  background: ${theme.colors.white};
`;

const Page = styled.div`
  color: ${theme.colors.gray500};
  ${theme.fonts.caption03};
`;

const Current = styled.span`
  color: ${theme.colors.white};
`;
