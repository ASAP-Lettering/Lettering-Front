import React from "react";
import Image from "next/image";
import styled from "styled-components";
import Tag from "./Tag";

interface Orbit {
  id: number;
  name: string;
  date: string;
}

interface PlanetProps {
  planetType: number;
  planet: string;
  orbits: Orbit[];
}

const Planet = (props: PlanetProps) => {
  const { planetType, planet, orbits } = props;

  const radius = 150; // Orbit들이 배치될 원의 반지름
  const center = 150; // 행성이 위치할 중앙의 좌표

  return (
    <Container>
      <PlanetImage
        src={`/assets/images/planet/planet${planetType}.svg`}
        width={400}
        height={400}
        alt="planet"
      />
      {orbits.map((orbit, index) => {
        const angle = (index / orbits.length) * 2 * Math.PI; // 각 Orbit 요소의 각도 계산
        const x = center + radius * Math.cos(angle) - 30; // X좌표 계산
        const y = center + radius * Math.sin(angle) - 10; // Y좌표 계산

        return (
          <OrbitTag
            key={orbit.id}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <Tag tagType="letter" name={orbit.name} />
          </OrbitTag>
        );
      })}
      <PlanetTag>
        <Tag tagType="planet" name={planet} icon="edit" />
      </PlanetTag>
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
