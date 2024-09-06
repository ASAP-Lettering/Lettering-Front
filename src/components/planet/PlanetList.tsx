import { theme } from "@/styles/theme";
import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import Check from "../common/Check";

interface PlanetListProps {
  id: number;
  planetName: string;
  count: number;
  checked: number[];
  deleteMode: boolean;
  isMain?: boolean;
  onClick?: () => void;
}

const PlanetList = (props: PlanetListProps) => {
  const { id, planetName, count, checked, deleteMode, isMain, onClick } = props;

  return (
    <Box onClick={onClick}>
      <ContentWrapper>
        <LeftWrapper>
          {deleteMode && (
            <CheckWrapper>
              <Check checkType="round" checked={checked.includes(id)} />
            </CheckWrapper>
          )}
          <TextWrapper>
            <Top>
              {isMain && <MainLabel>메인</MainLabel>}
              {planetName}
            </Top>
            {count}개의 편지
          </TextWrapper>
        </LeftWrapper>
        <Image
          src="/assets/icons/ic_hamburger_menu.svg"
          width={24}
          height={24}
          alt="list"
        />
      </ContentWrapper>
    </Box>
  );
};

export default PlanetList;

const Box = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 12px 10px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 8px;
  background: transparent;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption02};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
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

const MainLabel = styled.div`
  padding: 0 9px;
  border-radius: 4px;
  text-align: center;
  background: ${theme.colors.sub01};
  ${(props) => props.theme.fonts.caption03};
  white-space: nowrap;
`;

const CheckWrapper = styled.div``;
