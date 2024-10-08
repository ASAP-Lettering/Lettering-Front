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
import { getMainId, getSpaceList, putSpace } from "@/api/planet/space/space";
// import { setSpaceId } from "@/utils/storage";
import {
  getOrbitLetter,
  getPlanetLetterList,
  putLetterToPlanet,
} from "@/api/planet/letter/spaceLetter";
import Loader from "@/components/common/Loader";
import { SpaceInfo } from "@/types/space";
import { getInitUserToast, setInitUserToast } from "@/utils/storage";

const PlanetPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentOrbits, setCurrentOrbits] = useState<Orbit[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [draggedOrbit, setDraggedOrbit] = useState<OrbitMessage | null>(null);
  const [orbitMessages, setOrbitMessages] = useState<Orbit[] | null>();

  const [spaceInfo, setSpaceInfo] = useState<SpaceInfo | null>(null);
  const [userName, setUserName] = useState("");
  const [countLetter, setCountLetter] = useState<number>(0);

  const { show, message, close } = useRecoilValue(toastState);
  const setToast = useSetRecoilState(toastState);

  const fetchPlanetLetterList = async (spaceId: string) => {
    try {
      const response = await getPlanetLetterList({
        spaceId: spaceId,
        page: currentPage - 1,
        size: itemsPerPage,
      });
      console.log("행성 편지 목록 조회 성공:", response.data);
      setCurrentOrbits(response.data.content);
      setCountLetter(response.data.totalElements);
      setTotalPages(
        response.data.totalElements === 0 ? 1 : response.data.totalPages
      );
      setIsLoading(false);
    } catch (error) {
      console.error("행성 편지 목록 조회 실패:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMainId = async () => {
      try {
        const response = await getMainId();
        console.log("메인 ID 조회 성공:", response.data);
        setSpaceInfo({
          spaceId: response.data.spaceId,
          spaceName: response.data.spaceName,
          templateType: response.data.templateType,
        });
        setUserName(response.data.username);

        fetchPlanetLetterList(response.data.spaceId);
      } catch (error) {
        console.error("메인 ID 조회 실패:", error);
        setSpaceInfo(null);
        setIsLoading(false);
      }
    };

    const fetchOrbitLetter = async () => {
      try {
        const response = await getOrbitLetter();
        console.log("궤도 편지 목록 조회 성공:", response.data);
        setOrbitMessages(response.data.content);
      } catch (error) {
        console.error("궤도 편지 목록 조회 실패:", error);
        setOrbitMessages(null);
      }
    };

    fetchMainId();
    fetchOrbitLetter();
  }, []);

  useEffect(() => {}, [spaceInfo]);

  useEffect(() => {
    if (spaceInfo?.spaceId) {
      fetchPlanetLetterList(spaceInfo?.spaceId);
    }
  }, [currentPage]);

  const handleEditPlanetName = async (newName: string) => {
    // 행성 이름 수정 API
    if (spaceInfo?.spaceId) {
      try {
        const response = await putSpace({
          spaceId: spaceInfo.spaceId,
          spaceName: newName,
        });
        setSpaceInfo((prevInfo) => {
          if (prevInfo) {
            return {
              ...prevInfo,
              spaceName: newName,
            };
          }
          return prevInfo;
        });
        console.log("행성 이름 수정 성공:", response.data);
      } catch (error) {
        console.error("행성 이름 수정 실패:", error);
        setSpaceInfo((prevInfo) => {
          if (prevInfo) {
            return {
              ...prevInfo,
            };
          }
          return prevInfo;
        });
      }
    }
  };

  /* 페이지네이션 */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  /* 토스트 메세지 */
  /* 편지 등록 개수 3개 미만일 경우*/
  useEffect(() => {
    if (countLetter < 3 && !!!getInitUserToast()) {
      setToast({
        show: true,
        message: "궤도에 있는 편지들을 끌어 당겨 행성으로 옮길 수 있어요",
        close: true,
      });
      setInitUserToast();
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
  const handleDrop = async (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === "droppable-bottom" &&
      destination.droppableId === "droppable-planet"
    ) {
      const draggedOrbit = orbitMessages?.[source.index];
      if (draggedOrbit && draggedOrbit.letterId && spaceInfo?.spaceId) {
        try {
          const response = await putLetterToPlanet({
            letterId: draggedOrbit.letterId,
            spaceId: spaceInfo?.spaceId,
          });
          console.log("궤도 편지 행성으로 이동 성공", response);

          console.log("draggedOrbit", draggedOrbit);
          const updatedOrbitMessages = orbitMessages?.filter(
            (_, index) => index !== source.index
          );
          setCurrentOrbits((prevOrbits = []) => [draggedOrbit, ...prevOrbits]);

          // 궤도 이동 애니메이션을 위해 잠시 대기
          setTimeout(() => {
            setOrbitMessages(updatedOrbitMessages || null);
          }, 500);

          setTimeout(() => {
            setCurrentPage(1);
          }, 500);

          setOrbitMessages(updatedOrbitMessages || null);
        } catch {
          console.log("궤도 편지 행성으로 이동 실패");
        }
      }
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextPage(),
    onSwipedRight: () => handlePrevPage(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <Layout>
        {isLoading ? (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        ) : (
          <>
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
                  {userName}님의 스페이스에
                  <br />
                  <Em>{countLetter}개의 편지</Em>가 수놓여 있어요!
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
                  name={spaceInfo?.spaceName}
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
                        planetType={spaceInfo?.templateType || 0}
                        planet={spaceInfo?.spaceName || ""}
                        orbits={currentOrbits || []}
                        onEditPlanetName={handleEditPlanetName}
                        setCurrentOrbits={setCurrentOrbits}
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
                  totalPage={totalPages}
                  onPrevPage={handlePrevPage}
                  onNextPage={handleNextPage}
                />
              </PageWrapper>
            </Container>
            <Bottom orbitMessages={orbitMessages || null} />
          </>
        )}
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

/* 로딩 */
const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
