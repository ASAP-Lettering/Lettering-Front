import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

interface PlanetBoxProps {
  planetName: string;
  count: number;
  checked: boolean;
  current?: boolean;
  onClick?: () => void;
}

const PlanetBox = (props: PlanetBoxProps) => {
  const { planetName, count, checked, current, onClick } = props;

  return (
    <Box onClick={onClick}>
      <ContentWrapper>
        <LeftWrapper>
          <Top>
            {current && <CurrentLabel>현재</CurrentLabel>}
            {planetName}
          </Top>
          {count}개의 편지
        </LeftWrapper>
        <Image
          src={`/assets/icons/${checked ? "ic_check" : "ic_check_not"}.svg`}
          width={20}
          height={20}
          alt="check"
        />
      </ContentWrapper>
    </Box>
  );
};

export default PlanetBox;

const Box = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 12px 10px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border-radius: 8px;
  background: var(--Gray_800, #202232);
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
`;

const CurrentLabel = styled.div`
  width: 39px;
  padding: 0 9px;
  border-radius: 4px;
  background: ${theme.colors.sub01};
`;
