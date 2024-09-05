import React, { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import Tag from "./Tag";
import Button from "./Button";

interface Orbit {
  id: number;
  name: string;
  date: string;
}

interface PlanetProps {
  planetType: number;
  planet: string;
  orbits: Orbit[];
  onEditPlanetName: (newName: string) => void;
}

const Planet = (props: PlanetProps) => {
  const { planetType, planet, orbits, onEditPlanetName } = props;
  const [hold, setHold] = useState<boolean>(false);

  const radius = 150; // Orbit들이 배치될 원의 반지름
  const center = 150; // 행성이 위치할 중앙의 좌표

  const handleShowHold = () => {
    setHold(!hold);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setHold(false);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <Container>
      <PlanetImage
        src={`/assets/images/planet/planet${planetType}.svg`}
        width={400}
        height={400}
        alt="planet"
      />
      {orbits.map((orbit, index) => {
        const angle = -(index / orbits.length) * 2 * Math.PI - Math.PI / 2; // 각 Orbit 요소의 각도 계산
        const x = center + radius * Math.cos(angle) - 30; // X좌표 계산
        const y = center + radius * Math.sin(angle) - 5; // Y좌표 계산

        return (
          <OrbitTag
            key={orbit.id}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <Tag tagType="letter" name={orbit.name} onClick={handleShowHold} />
          </OrbitTag>
        );
      })}
      <PlanetTag>
        <Tag
          tagType="planet"
          name={planet}
          icon="edit"
          onEdit={onEditPlanetName}
        />
      </PlanetTag>
      {hold && (
        <Overlay onClick={handleOverlayClick}>
          <Button
            buttonType="primary"
            size="small"
            text="이동하기"
            onClick={handleButtonClick}
          />
          <Button
            buttonType="secondary"
            size="small"
            text="삭제하기"
            onClick={handleButtonClick}
          />
        </Overlay>
      )}
    </Container>
  );
};

export default Planet;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin: 0 auto;
`;

const PlanetImage = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
`;

const OrbitTag = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const PlanetTag = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  z-index: 15;
`;
