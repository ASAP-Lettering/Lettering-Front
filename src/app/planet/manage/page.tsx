"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { PLANETS } from "@/constants/planet";
import PlanetList from "@/components/planet/PlanetList";
import Image from "next/image";
import ConfirmModal from "@/components/common/ConfirmModal";
import Toast from "@/components/common/Toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const PlanetManagePage = () => {
  const router = useRouter();

  const count = 7;
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [checkedPlanets, setCheckedPlanets] = useState<string[]>([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const [deletePlanet, setDeletePlanet] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [changedOrder, setChangedOrder] = useState([]);

  const handleClickDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleClickCheckAll = () => {
    if (checkedPlanets.length === PLANETS.length) {
      setCheckedPlanets([]);
    } else {
      setCheckedPlanets(PLANETS.map((planet) => planet.id));
    }
  };

  const handleChangeChecked = (id: string) => {
    if (checkedPlanets.includes(id)) {
      setCheckedPlanets(checkedPlanets.filter((planetId) => planetId !== id));
    } else {
      setCheckedPlanets([...checkedPlanets, id]);
    }
  };

  const handleDeletePlanet = () => {
    setConfirmDeleteModal(true);
  };

  const handleConfirmDeletePlanet = () => {
    /* 행성 삭제하기 */
    // 추후 작성
    setConfirmDeleteModal(false);
    setDeleteMode(false);
    setDeletePlanet("ASAP"); // 삭제한 행성명으로
    handleShowToast();
  };

  const handleCancelDeletePlanet = () => {
    setConfirmDeleteModal(false);
  };

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const [planets, setPlanets] = useState(PLANETS);

  // 드래그 앤 드롭 완료 시 실행되는 함수
  // const handleDragEnd = (result: any) => {
  //   alert("드래그");
  //   const { destination, source } = result;

  //   // 목적지가 없거나 위치가 변하지 않았을 때
  //   if (!destination || destination.index === source.index) return;

  //   const reorderedPlanets = Array.from(planets);
  //   const [removed] = reorderedPlanets.splice(source.index, 1);
  //   reorderedPlanets.splice(destination.index, 0, removed);

  //   setPlanets(reorderedPlanets);
  // };

  const onDragEnd = ({
    source,
    destination,
  }: {
    source: any;
    destination: any;
  }) => {
    console.log("dragEnd");
    if (!destination) return; // destination이 없다면 return
    const items = JSON.parse(JSON.stringify(planets));
    const [targetItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, targetItem);
    setPlanets(items);
    // 변경된 순서 업데이트
    const newOrder = items.map((item: any) => item.id);
    setChangedOrder(newOrder);
  };

  return (
    <Layout>
      <NavigatorBar title="나의 행성 관리" cancel={false} />
      <Container>
        <Top>
          <Label>총 {count}개</Label>
          {deleteMode ? (
            <CheckAllButton onClick={handleClickCheckAll}>
              <Image
                src="/assets/icons/ic_check_small.svg"
                width={13}
                height={9}
                alt="check"
              />
              전체 선택
            </CheckAllButton>
          ) : (
            <DeleteModeButton onClick={handleClickDeleteMode}>
              삭제
            </DeleteModeButton>
          )}
        </Top>
        <Divider />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="planet">
            {(provided) => (
              <PlanetBoxList
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {planets.map((planet, index) => (
                  <Draggable
                    key={planet.id + "-button"}
                    draggableId={planet.id}
                    index={index}
                    disableInteractiveElementBlocking
                  >
                    {(provided) => (
                      <PlanetList
                        id={planet.id}
                        planetName={planet.name}
                        count={planet.count}
                        checked={checkedPlanets}
                        deleteMode={deleteMode}
                        onClick={() => {
                          handleChangeChecked(planet.id);
                        }}
                        isMain={index === 0}
                        innerRef={provided.innerRef}
                        dragHandleProps={provided.dragHandleProps}
                        draggableProps={provided.draggableProps}
                        modify={true}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </PlanetBoxList>
            )}
          </Droppable>
        </DragDropContext>
        {deleteMode && (
          <ButtonWrapper>
            <Button
              buttonType="secondary"
              text="취소"
              width="90px"
              onClick={handleClickDeleteMode}
            />
            <Button
              buttonType="primary"
              size="large"
              text="삭제하기"
              disabled={checkedPlanets?.length === 0}
              onClick={handleDeletePlanet}
            />
          </ButtonWrapper>
        )}
      </Container>
      {confirmDeleteModal && (
        <ConfirmModal
          title="해당 행성를 정말 삭제할까요?"
          sub="행성에 등록된 편지들도 함께 삭제됩니다."
          onConfirm={handleConfirmDeletePlanet}
          onCancel={handleCancelDeletePlanet}
        />
      )}
      {showToast && (
        <Toast
          text={`${deletePlanet} 행성과 등록된 편지들이 함께 삭제 되었어요`}
          icon={false}
          bottom="65px"
          left="50%"
        />
      )}
    </Layout>
  );
};

export default PlanetManagePage;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  gap: 7px;
  padding: 74px 20px 20px 20px;
  background-color: ${theme.colors.bg};
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 34px;
`;

const Label = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
`;

const CheckAllButton = styled.button`
  display: flex;
  gap: 6px;
  align-items: center;
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.body09};
`;

const DeleteModeButton = styled.button`
  display: flex;
  align-items: center;
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.body09};
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${theme.colors.gray800};
  margin-top: 20px;
  margin-bottom: 22px;
`;

const PlanetBoxList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
