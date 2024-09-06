import { theme } from "@/styles/theme";
import React, { useState } from "react";
import styled from "styled-components";
import Check from "../common/Check";

interface PlanetBoxProps {
  id: number;
  planetName: string;
  count: number;
  checked: number;
  current?: boolean;
  onClick?: () => void;
}

const PlanetBox = (props: PlanetBoxProps) => {
  const { id, planetName, count, checked, current, onClick } = props;

  return (
    <Box onClick={onClick} $checked={checked === id}>
      <ContentWrapper>
        <LeftWrapper>
          <Top>
            {current && <CurrentLabel>현재</CurrentLabel>}
            {planetName}
          </Top>
          {count}개의 편지
        </LeftWrapper>
        <CheckWrapper>
          <Check checkType="default" checked={checked === id} />
        </CheckWrapper>
      </ContentWrapper>
    </Box>
  );
};

export default PlanetBox;

const Box = styled.div<{ $checked: boolean }>`
  width: 100%;
  display: flex;
  padding: 10px 12px 10px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 8px;
  background: ${({ theme, $checked }) =>
    $checked ? theme.colors.gray800 : "transparent"};
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption02};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.body06};
`;

const CurrentLabel = styled.div`
  padding: 0 9px;
  border-radius: 4px;
  text-align: center;
  background: ${theme.colors.sub01};
  ${(props) => props.theme.fonts.caption03};
  white-space: nowrap;
`;

const CheckWrapper = styled.div``;
