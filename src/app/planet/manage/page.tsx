'use client';

import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';
import NavigatorBar from '@/components/common/NavigatorBar';
import PlanetList from '@/components/planet/PlanetList';
import Image from 'next/image';
import ConfirmModal from '@/components/common/ConfirmModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  deleteSpaces,
  getSpaceList,
  putSpacesOrder
} from '@/api/planet/space/space';
import { useToast } from '@/hooks/useToast';
import { spaceState } from '@/recoil/spaceStore';
import { useSetRecoilState } from 'recoil';
import { useRouter } from 'next/navigation';
import Loader, { LoaderContainer } from '@/components/common/Loader';
import { Planet } from '@/types/planet';
import BottomSheet from '@/components/common/BottomSheet';

const PlanetManagePage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [count, setCount] = useState<number | null>(null);
  const [dragMode, setDragMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const [changedOrder, setChangedOrder] = useState<
    { spaceId: string; index: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [planets, setPlanets] = useState<Planet[]>();
  const [showBottom, setShowBottom] = useState<boolean>(false);
  const [isBottomUp, setIsBottomUp] = useState<boolean>(false);

  const setViewSpaceId = useSetRecoilState(spaceState);

  const fetchSpaceList = async () => {
    try {
      setIsLoading(true);
      const response = await getSpaceList();
      console.log('전체 스페이스 목록 조회 성공:', response.data);
      setPlanets(response.data.spaces);
      setCount(response.data.spaces.length);
    } catch (error) {
      console.error('전체 스페이스 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaceList();
  }, []);

  const handleClickDragMode = () => {
    setDragMode(!dragMode);
  };

  const handleOrderEditComplete = async () => {
    /* 스페이스 순서 변경 API 호출 */
    try {
      const response = await putSpacesOrder({ orders: changedOrder });
      console.log('결과', changedOrder);
      console.log('스페이스 순서 변경 성공:', response);
    } catch (error) {
      console.error('스페이스 순서 변경 실패:', error);
    }
    setDragMode(false);
  };

  const handleChangeChecked = (id: string) => {
    if (!dragMode) {
      /* 선택 행성 조회 모드 */
      if (id) {
        setViewSpaceId(id);
        router.push('/planet');
      }
    }
  };

  /* BottomSheet 관련 함수 */
  useEffect(() => {
    if (isBottomUp) {
      setShowBottom(true);
    } else {
      setTimeout(() => {
        setShowBottom(false);
      }, 490);
    }
  }, [isBottomUp]);

  const handleShowBottom = (id: string) => {
    setSelectedId(id);
    setIsBottomUp(true);
  };

  const handleBottomUpChange = (state: boolean) => {
    setIsBottomUp(state);
  };

  /* 홈(메인) 행성 고정 */
  const handleFixMainPlanet = () => {
    const selectedPlanet = planets?.filter((planet) =>
      selectedId.includes(planet.spaceId)
    );

    /* TODO: 선택 행성 (selectedId) 메인 행성으로 변경 API 연동 */

    setIsBottomUp(false);
    showToast(`${selectedPlanet[0]?.spaceName} 행성을 홈으로 고정했어요`, {
      icon: false,
      close: false,
      bottom: '65px'
    });
  };

  /* 행성 삭제 관련 함수 */
  const handleDeletePlanet = () => {
    setIsBottomUp(false);
    setConfirmDeleteModal(true);
  };

  const handleConfirmDeletePlanet = async () => {
    if (selectedId) {
      const selectedPlanet = planets?.filter((planet) =>
        selectedId.includes(planet.spaceId)
      );

      /* 행성 삭제하기 */
      try {
        const response = await deleteSpaces({ spaceIds: [selectedId] });
        console.log('행성 삭제 성공:', response.data);
        setPlanets(
          (prevPlanets) =>
            prevPlanets?.filter(
              (planet) => !selectedId.includes(planet.spaceId)
            ) || []
        );
        await fetchSpaceList();
        setIsBottomUp(false);
      } catch (error) {
        console.error('행성 삭제 실패:', error);
      }

      setConfirmDeleteModal(false);
      setDragMode(false);
      showToast(
        `${selectedPlanet[0]?.spaceName} 행성과 등록된 편지들이 함께 삭제되었어요`,
        {
          icon: false,
          close: false,
          bottom: '65px'
        }
      );
    }
  };

  const handleCancelDeletePlanet = () => {
    setConfirmDeleteModal(false);
  };

  const onDragEnd = ({
    source,
    destination
  }: {
    source: any;
    destination: any;
  }) => {
    console.log('dragEnd');
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
        index: index
      })
    );
    setChangedOrder(newOrder);
    console.log(newOrder);
  };

  return (
    <Layout>
      <NavigatorBar title="나의 행성 관리" cancel={false} />
      <Container>
        <Top>
          <Label>총 {count === null || isLoading ? '...' : count}개</Label>
          {dragMode ? (
            <CheckAllButton onClick={handleOrderEditComplete}>
              편집 완료
            </CheckAllButton>
          ) : (
            <DeleteModeButton onClick={handleClickDragMode}>
              순서 편집
            </DeleteModeButton>
          )}
        </Top>
        <Divider />
        {isLoading ? (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="planet">
              {(provided) => (
                <PlanetBoxList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {planets?.map((planet, index) => (
                    <Draggable
                      key={planet.spaceId + '-button'}
                      draggableId={planet.spaceId}
                      index={index}
                      disableInteractiveElementBlocking
                    >
                      {(provided) => (
                        <PlanetList
                          id={planet.spaceId}
                          planetName={planet.spaceName}
                          count={planet.letterCount}
                          dragMode={dragMode}
                          onClick={() => {
                            handleChangeChecked(planet.spaceId);
                          }}
                          onShowBottom={() => handleShowBottom(planet.spaceId)}
                          isMain={planet.isMainSpace}
                          innerRef={provided.innerRef}
                          dragHandleProps={provided.dragHandleProps}
                          draggableProps={provided.draggableProps}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </PlanetBoxList>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Container>
      {showBottom && (
        <BottomSheet
          height={213}
          isOpen={isBottomUp}
          handleOpen={handleBottomUpChange}
        >
          <BottomSheetContent>
            <BottomSheetButton onClick={handleFixMainPlanet}>
              <Image
                src="/assets/icons/ic_pin.svg"
                width={24}
                height={24}
                alt="고정"
              />
              홈 행성 고정
            </BottomSheetButton>
            <BottomSheetButton onClick={handleDeletePlanet}>
              <Image
                src="/assets/icons/ic_trash.svg"
                width={24}
                height={24}
                alt="삭제"
              />
              행성 삭제
            </BottomSheetButton>
          </BottomSheetContent>
        </BottomSheet>
      )}
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
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: hidden;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding-bottom: 50px;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const BottomSheetContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 24px;
  margin-top: 20px;
`;

const BottomSheetButton = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  color: ${theme.colors.white};
  ${theme.fonts.body02};
`;
