import React, { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import Tag from "./Tag";
import Button from "./Button";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import { useSetRecoilState } from "recoil";
import { toastState } from "@/recoil/toastStore";
import { deletePlanetLetter } from "@/api/planet/letter/spaceLetter";

interface Orbit {
  letterId: string;
  senderName: string;
  isNew?: boolean;
  date?: string;
}

interface PlanetProps {
  planetType: number;
  planet: string;
  orbits?: Orbit[];
  onEditPlanetName: (newName: string) => void;
  setCurrentOrbits: React.Dispatch<React.SetStateAction<Orbit[] | undefined>>;
}

const Planet = (props: PlanetProps) => {
  const { planetType, planet, orbits, onEditPlanetName, setCurrentOrbits } =
    props;

  const router = useRouter();
  const [hold, setHold] = useState<boolean>(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const [orbitId, setOrbitId] = useState<string>("");

  const radius = 150; // Orbit들이 배치될 원의 반지름
  const center = 150; // 행성이 위치할 중앙의 좌표

  const setToast = useSetRecoilState(toastState);

  const handleTagClick = (id: string) => {
    router.push(`/letter/${id}`);
  };

  const handleShowHold = (orbitId: string) => {
    setOrbitId(orbitId);
    setHold(!hold);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setHold(false);
  };

  const handleMoveButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/planet/move?letter=${orbitId}`);
  };

  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setHold(false);
    setConfirmDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    // 편지 삭제 API
    try {
      await deletePlanetLetter(orbitId);
      setConfirmDeleteModal(false);
      console.log("편지 삭제 성공");

      setCurrentOrbits((prevOrbits) =>
        prevOrbits?.filter((orbit) => orbit.letterId !== orbitId)
      );
    } catch {
      console.log("편지 삭제 실패");
    }

    // 토스트 메세지
    const orbit = orbits
      ? orbits?.find((item) => item.letterId === orbitId)
      : null;
    if (orbits) {
      setToast({
        show: true,
        message: `${orbit!.senderName!} 님의 편지가 삭제되었어요`,
        close: false,
      });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteModal(false);
  };

  return (
    <Container>
      <PlanetImage
        src={`/assets/images/planet_png/planet${planetType}.png`}
        width={400}
        height={400}
        alt="planet"
        priority
      />
      <Shadow />
      {orbits &&
        orbits.map((orbit, index) => {
          const angle = -(index / orbits.length) * 2 * Math.PI - Math.PI / 2; // 각 Orbit 요소의 각도 계산
          const x = center + radius * Math.cos(angle) - 30; // X좌표 계산
          const y = center + radius * Math.sin(angle) - 5; // Y좌표 계산

          return (
            <OrbitTag
              key={orbit.letterId}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: "transform 0.8s ease",
              }}
            >
              <Tag
                tagType="letter"
                name={orbit.senderName}
                onClick={() => {
                  handleTagClick(orbit.letterId);
                }}
                onHold={() => {
                  handleShowHold(orbit.letterId);
                }}
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
  //드래그방지
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
`;

const Shadow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -10;
  width: 80px;
  height: 80px;
  background: linear-gradient(
    90deg,
    rgba(140, 160, 255, 0.5) 0%,
    rgba(6, 8, 18, 0) 100%
  );
  /* background: #a3c6ff; */
  border-radius: 50%;
  filter: drop-shadow(0px 0px 7.29px #a3c6ff)
    drop-shadow(0px 0px 14.58px #a3c6ff) drop-shadow(0px 0px 51.03px #a3c6ff)
    drop-shadow(0px 0px 102.06px #a3c6ff) drop-shadow(0px 0px 174.96px #a3c6ff)
    drop-shadow(0px 0px 306.18px #a3c6ff);
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
