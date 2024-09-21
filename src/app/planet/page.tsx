"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import Bottom from "@/components/common/Bottom";
import Planet from "@/components/common/Planet";
import Tag from "@/components/common/Tag";
import { Orbit, ORBIT_MESSAGE, ORBITS } from "@/constants/orbit";
import { theme } from "@/styles/theme";
import Pagination from "@/components/common/Pagination";
import Toast from "@/components/common/Toast";
import { useRouter } from "next/navigation";
import { OrbitMessage } from "@/types/orbit";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toastState } from "@/recoil/toastStore";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSwipeable } from "react-swipeable";

const PlanetPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPage = 3;
  const [orbits, setOrbits] = useState<Orbit[]>(ORBITS);
  const [currentOrbits, setCurrentOrbits] = useState(
    orbits.slice(0, itemsPerPage)
  );

  const totalCount = 2;

  const [draggedOrbit, setDraggedOrbit] = useState<OrbitMessage | null>(null);
  const [orbitMessages, setOrbitMessages] = useState<Orbit[] | null>(
    ORBIT_MESSAGE
  );

  /* 행성 이름 변경 */
  const [planetName, setPlanetName] = useState<string>("민지님의 첫 행성");

  const { show, message, close } = useRecoilValue(toastState);
  const setToast = useSetRecoilState(toastState);

  const handleEditPlanetName = (newName: string) => {
    // 행성 이름 수정 API
    setPlanetName(newName);
  };

  /* 페이지네이션 */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  /* 토스트 메세지 */
  /* 편지 등록 개수 3개 미만일 경우*/
  useEffect(() => {
    if (totalCount < 3) {
      setToast({
        show: true,
        message: "궤도에 있는 편지들을 끌어 당겨 행성으로 옮길 수 있어요",
        close: true,
      });
    }
  }, []);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", close: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, setToast]);

  /* 드래그 앤 드롭 */
  const handleDrop = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === "droppable-bottom" &&
      destination.droppableId === "droppable-planet"
    ) {
      const draggedOrbit = orbitMessages?.[source.index];
      console.log("draggedOrbit", draggedOrbit);
      const updatedOrbitMessages = orbitMessages?.filter(
        (_, index) => index !== source.index
      );

      if (draggedOrbit) {
        setOrbits((prevOrbits) => [draggedOrbit, ...prevOrbits]);

        // 궤도 이동 애니메이션을 위해 잠시 대기
        setTimeout(() => {
          setOrbitMessages(updatedOrbitMessages || null);
        }, 500);
      }

      setTimeout(() => {
        setCurrentPage(1);
      }, 500);

      setOrbitMessages(updatedOrbitMessages || null);

      console.log("updatedOrbits", orbits);
      console.log("updatedOrbitMessages", updatedOrbitMessages);
    }
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    setCurrentOrbits(orbits.slice(startIndex, startIndex + itemsPerPage));
    console.log("updatedOrbits after setOrbits", orbits); // 업데이트 로그
  }, [orbits, currentPage]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextPage(),
    onSwipedRight: () => handlePrevPage(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <Layout>
        <Background
          src="/assets/images/background/home.svg"
          width={480}
          height={800}
          alt="background"
          over-fit="cover"
          priority
        />
        <Container>
          <Top>
            <Title>
              민지님의 스페이스에
              <br />
              <Em>10개의 편지</Em>가 수놓여 있어요!
            </Title>
            <Image
              src="/assets/icons/ic_mypage.svg"
              width={24}
              height={24}
              alt="mypage"
            />
          </Top>
          <TagList>
            <Tag
              tagType="planet"
              name={planetName}
              icon="chevron"
              onClick={() => {
                router.push("/planet/manage");
              }}
            />
            <Tag
              tagType="planet"
              name=""
              icon="plus"
              onClick={() => router.push("/planet/add")}
            />
          </TagList>
          {/* <PlanetWrapper currentPage={currentPage} {...swipeHandlers}> */}
          <PlanetWrapper>
            <Droppable droppableId="droppable-planet">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Planet
                    planetType={0}
                    planet={planetName}
                    orbits={currentOrbits}
                    onEditPlanetName={handleEditPlanetName}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </PlanetWrapper>
          <PageWrapper>
            {show && (
              <Toast
                text={message}
                icon={false}
                top="0px"
                left="50%"
                padding="11px 0px"
                close={close}
              />
            )}
            <Pagination
              currentPage={currentPage}
              totalPage={totalPage}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
          </PageWrapper>
        </Container>
        <Bottom orbitMessages={orbitMessages} />
      </Layout>
    </DragDropContext>
  );
};

export default PlanetPage;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  gap: 10px;
  padding: 74px 0px 0px 0px;
  position: relative;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const Background = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.heading02};
  margin-bottom: 20px;
`;

const Em = styled.span`
  ${(props) => props.theme.fonts.heading01}
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const PlanetWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

// const PlanetWrapper = styled.div<{ currentPage: number }>`
//   width: 100%;
//   height: 100%;
//   position: relative;
//   transition: transform 0.4s ease-in-out;
//   transform: translateX(${(props) => -(props.currentPage - 1) * 100}%);
// `;

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 600px;
  left: 50%;
  transform: translateX(-50%);
`;
