import { theme } from "@/styles/theme";
import React from "react";
import styled, { css } from "styled-components";

interface PlanetPaletteProps {
  id: number;
  onClick: (id: number) => void;
}
const PlanetPalette = (props: PlanetPaletteProps) => {
  const { id, onClick } = props;

  const planetColors = [
    "linear-gradient(180deg, #384292 42.93%, #101441 162.15%)",
    "linear-gradient(0deg, #5686EB -29.23%, #AFC3CE 156.08%)",
    "linear-gradient(180deg, #60A1D5 61.62%, #F1F9E1 155.5%)",
    "linear-gradient(180deg, #1D81AB 13.46%, #0F6592 119.48%)",
    "linear-gradient(180deg, #4295AE 0%, #BAD1C7 179.21%)",
    "linear-gradient(180deg, #A3C6EE 0%, #5978A9 140.2%)",
  ];
  return (
    <Container>
      <Palettes>
        {planetColors.map((item, index) => (
          <Palette
            key={index}
            $color={item}
            $selected={index === id}
            onClick={() => onClick(index)}
          />
        ))}
      </Palettes>
    </Container>
  );
};

export default PlanetPalette;

const Container = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  background: ${theme.colors.gray800};
`;

const Palettes = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  padding: 5px 0;
  gap: 12px;
`;

const Palette = styled.div<{ $color: string; $selected: boolean }>`
  width: 41px;
  height: 41px;
  border-radius: 50%;
  background: ${({ $color }) => $color};

  ${({ $selected }) =>
    $selected &&
    css`
      border: 2px rgba(255, 255, 255, 0.3) solid;
      filter: drop-shadow(0px 0px 3px rgba(224, 222, 222, 0.377));
    `}

  @media (max-width: 330px) {
    width: 35px;
    height: 35px;
  }

  @media (max-width: 300px) {
    width: 30px;
    height: 30px;
  }
`;
