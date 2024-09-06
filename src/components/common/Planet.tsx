import React, { useRef, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import Tag from "./Tag";
import Button from "./Button";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

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

  const router = useRouter();
  const [hold, setHold] = useState<boolean>(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);

  const radius = 150; // Orbit들이 배치될 원의 반지름
  const center = 150; // 행성이 위치할 중앙의 좌표

  const handleTagClick = (id: number) => {
    router.push(`/letter/${id}`);
  };

  const handleShowHold = () => {
    setHold(!hold);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setHold(false);
  };

  const handleMoveButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/planet/move?letter=${id}`);
  };

  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setHold(false);
    setConfirmDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // 편지 삭제 API
    setConfirmDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteModal(false);
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
            <Tag
              tagType="letter"
              name={orbit.name}
              onClick={() => {
                handleTagClick(orbit.id);
              }}
              onHold={handleShowHold}
            />
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
            onClick={handleMoveButtonClick}
          />
          <Button
            buttonType="secondary"
            size="small"
            text="삭제하기"
            onClick={handleDeleteButtonClick}
          />
        </Overlay>
      )}
      {confirmDeleteModal && (
        <ConfirmModal
          title="해당 편지를 정말 삭제할까요?"
          sub="삭제된 편지는 복구되지 않아요."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
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
