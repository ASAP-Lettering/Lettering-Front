"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { Planet, PLANETS } from "@/constants/planet";
import PlanetList from "@/components/planet/PlanetList";
import Image from "next/image";
import ConfirmModal from "@/components/common/ConfirmModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  deleteSpaces,
  getSpaceList,
  putSpacesOrder,
} from "@/api/planet/space/space";
import { useToast } from "@/hooks/useToast";
import { spaceState } from "@/recoil/spaceStore";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";

const PlanetManagePage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [count, setCount] = useState<number>(0);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [checkedPlanets, setCheckedPlanets] = useState<string[]>([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const [changedOrder, setChangedOrder] = useState<string[]>([]);

  const [planets, setPlanets] = useState<Planet[]>();

  const setViewSpaceId = useSetRecoilState(spaceState);

  const fetchSpaceList = async () => {
    try {
      const response = await getSpaceList();
      console.log("전체 스페이스 목록 조회 성공:", response.data);
      setPlanets(response.data.spaces);
      setCount(response.data.spaces.length);
    } catch (error) {
      console.error("전체 스페이스 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchSpaceList();
  }, []);

  const handleClickDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleClickCheckAll = () => {
    if (planets && planets.length > 0) {
      if (checkedPlanets.length === planets.length) {
        setCheckedPlanets([]);
      } else {
        setCheckedPlanets(planets.map((planet) => planet.spaceId));
      }
    }
  };

  const handleChangeChecked = (id: string) => {
    if (deleteMode) {
      if (checkedPlanets.includes(id)) {
        setCheckedPlanets(checkedPlanets.filter((planetId) => planetId !== id));
      } else {
        setCheckedPlanets([...checkedPlanets, id]);
      }
    } else {
      /* 선택 행성 조회 모드 */
      if (id) {
        setViewSpaceId(id);
        router.push("/planet");
      }
    }
  };

  const handleDeletePlanet = () => {
    setConfirmDeleteModal(true);
  };

  const handleConfirmDeletePlanet = async () => {
    if (checkedPlanets.length > 0) {
      const smallestIndexPlanet = planets
        ?.filter((planet) => checkedPlanets.includes(planet.spaceId))
        ?.reduce((prev, curr) =>
          planets.indexOf(prev) < planets.indexOf(curr) ? prev : curr
        );

      /* 행성 삭제하기 */
      try {
        const response = await deleteSpaces({ spaceIds: checkedPlanets });
        console.log("행성 삭제 성공:", response.data);
        setPlanets(
          planets?.filter((planet) => !checkedPlanets.includes(planet.spaceId))
        );
        await fetchSpaceList();
      } catch (error) {
        console.error("행성 삭제 실패:", error);
      }

      setConfirmDeleteModal(false);
      setDeleteMode(false);
      showToast(
        `${smallestIndexPlanet?.spaceName} ${
          checkedPlanets.length > 1 ? `외 ${checkedPlanets.length - 1}개` : ""
        } 행성과 등록된 편지들이 함께 삭제 되었어요`,
        {
          icon: false,
          close: false,
          bottom: "65px",
        }
      );
    }
  };

  const handleCancelDeletePlanet = () => {
    setConfirmDeleteModal(false);
  };

  const onDragEnd = async ({
    source,
    destination,
  }: {
    source: any;
    destination: any;
  }) => {
    console.log("dragEnd");
    if (!destination) return; // destination이 없다면 return
    console.log(source, destination);

    if (source.index === destination.index) return;
    const items = Array.from(planets || []);
    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);
    setPlanets(items);
    console.log(items);

    /* 서버 전달용 새로운 순서 배열 */
    const newOrder: { spaceId: string; index: number }[] = items.map(
      (item: Planet, index: number) => ({
        spaceId: item.spaceId,
        index: index,
      })
    );
    setChangedOrder(newOrder.map((item) => item.spaceId));

    console.log(newOrder);

    /* 스페이스 순서 변경 API 호출 */
    try {
      const response = await putSpacesOrder({ orders: newOrder });
      console.log("결과", newOrder);
      console.log("스페이스 순서 변경 성공:", response);
    } catch (error) {
      console.error("스페이스 순서 변경 실패:", error);
    }
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
                {planets?.map((planet, index) => (
                  <Draggable
                    key={planet.spaceId + "-button"}
                    draggableId={planet.spaceId}
                    index={index}
                    disableInteractiveElementBlocking
                  >
                    {(provided) => (
                      <PlanetList
                        id={planet.spaceId}
                        planetName={planet.spaceName}
                        count={planet.letterCount}
                        checked={checkedPlanets}
                        deleteMode={deleteMode}
                        onClick={() => {
                          handleChangeChecked(planet.spaceId);
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
          title="해당 행성을 정말 삭제할까요?"
          sub="행성에 등록된 편지들도 함께 삭제됩니다."
          onConfirm={handleConfirmDeletePlanet}
          onCancel={handleCancelDeletePlanet}
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
  padding: 20px;
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
