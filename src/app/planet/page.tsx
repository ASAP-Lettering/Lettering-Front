"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import Bottom from "@/components/common/Bottom";
import Planet from "@/components/common/Planet";
import Tag from "@/components/common/Tag";
import { Orbit } from "@/constants/orbit";
import { theme } from "@/styles/theme";
import Pagination from "@/components/common/Pagination";
import Toast from "@/components/common/Toast";
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toastState } from "@/recoil/toastStore";
import { getMainId, getSpaceList, putSpace } from "@/api/planet/space/space";
// import { setSpaceId } from "@/utils/storage";
import {
  getOrbitLetter,
  getPlanetLetterList,
  putLetterToIndep,
  putLetterToPlanet,
} from "@/api/planet/letter/spaceLetter";
import Loader from "@/components/common/Loader";
import { SpaceInfo } from "@/types/space";
import {
  getCookie,
  getInitUserToast,
  setCookie,
  setInitUserToast,
} from "@/utils/storage";
import { getLetterCount } from "@/api/letter/letter";
import PlanetSlide from "@/components/planet/PlanetSlide";
import { planetRefState } from "@/recoil/RefStore";
import { droppedLetterState } from "@/recoil/letterStore";

const PlanetPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [direction, setDirection] = useState(0); //슬라이드 방향
  const [currentOrbits, setCurrentOrbits] = useState<Orbit[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //const [draggedOrbit, setDraggedOrbit] = useState<OrbitMessage | null>(null);
  const [orbitMessages, setOrbitMessages] = useState<Orbit[] | null>();
  const [spaceTotalLetter, setSpaceTotalLetter] = useState<number>(0);

  const [spaceInfo, setSpaceInfo] = useState<SpaceInfo | null>(null);
  const [userName, setUserName] = useState("");
  const [countLetter, setCountLetter] = useState<number>(0);

  const { show, message, close } = useRecoilValue(toastState);
  const setToast = useSetRecoilState(toastState);

  const fetchGetLetterCount = async () => {
    try {
      const response = await getLetterCount();
      console.log("모든 편지 수 조회 성공:", response.data);
      setCountLetter(response.data.count);
      setCurrentOrbits(response.data.content);
      setIsLoading(false);
    } catch (error) {
      console.error("행성 편지 목록 조회 실패:", error);
    }
  };

  const fetchPlanetLetterList = async (
    spaceId: string,
    page: number,
    size: number
  ) => {
    try {
      const response = await getPlanetLetterList({
        spaceId: spaceId,
        page: page - 1,
        size: size,
      });
      console.log("행성 편지 목록 조회 성공:", response.data);
      setCurrentOrbits(response.data.content);
      setTotalPages(
        response.data.totalElements === 0 ? 1 : response.data.totalPages
      );
      setSpaceTotalLetter(response.data.totalElements);
      //드래그 된 아이템이 있을때
      if (droppedItem) {
        setCurrentOrbits((prevOrbits) => {
          if (
            prevOrbits &&
            !prevOrbits.find((item) => item.letterId === droppedItem.letterId)
          ) {
            return [...prevOrbits, droppedItem];
          }
          return prevOrbits;
        });
      }
      //setDroppedItem(null);
      setIsLoading(false);
    } catch (error) {
      console.error("행성 편지 목록 조회 실패:", error);
      setIsLoading(false);
    }
  };

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
      fetchPlanetLetterList(response.data.spaceId, currentPage, itemsPerPage);
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

  useEffect(() => {
    fetchGetLetterCount();
    fetchMainId();
    fetchOrbitLetter();
  }, []);

  useEffect(() => {}, [spaceInfo]);

  useEffect(() => {
    console.log("지금 페이지는 ", currentPage);
    if (spaceInfo?.spaceId) {
      if (spaceTotalLetter === totalPages * 5 && droppedItem) {
        setTotalPages(totalPages + 1);
        setCurrentOrbits([droppedItem]);
        setDroppedItem(null);
        return;
      } else {
        fetchPlanetLetterList(spaceInfo?.spaceId, currentPage, itemsPerPage);
      }
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  /* 토스트 메세지 */
  /* 편지 등록 개수 3개 미만일 경우*/
  useEffect(() => {
    if (countLetter < 1) {
      if (getCookie("letter-onboard") === null) {
        setCookie("letter-onboard", "exist", 30);
        router.push("/onboarding");
      }
    }
    if (countLetter < 3 && getInitUserToast() !== "true") {
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

  /* 궤도 편지 삭제 */
  const handleDeleteOrbit = (deletedId: string) => {
    if (orbitMessages) {
      const updatedOrbits = orbitMessages.filter(
        (item) => item.letterId !== deletedId
      );
      setOrbitMessages(updatedOrbits);
    }
  };

  //마이 페이지로 이동
  const goToMyPage = () => {
    router.push("/mypage");
  };

  //승효 - 수정사항 코드(드래그앤드롭 & 슬라이드)
  const [droppedItem, setDroppedItem] = useState<Orbit | null>(null);
  const [planetRef, setPlanetRef] = useRecoilState(planetRefState);
  const [droppedLetter, setDroppedLetter] = useRecoilState(droppedLetterState);
  const [isDropped, setIsDroppped] = useState(false);

  useEffect(() => {
    if (droppedItem) {
      setIsDroppped(true);
      setDroppedLetter({
        tagId: droppedItem.letterId,
        name: droppedItem.senderName,
      });
      const timer = setTimeout(() => {
        setDroppedItem(null);
        setDroppedLetter({
          tagId: "",
          name: "",
        });
        setIsDroppped(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [droppedItem]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setPlanetRef(ref.current);
      console.log("ref 저장");
    }
  }, [ref.current]);

  const handleTagDrag = (item: Orbit) => {
    setDroppedItem(item);
  };

  const handleTagTouch = (draggedItem: Orbit) => {
    handleMovePlanet(draggedItem.letterId!, draggedItem.senderName);
    setOrbitMessages((prevMessages) =>
      prevMessages?.filter((item) => item.letterId !== draggedItem.letterId)
    );
    if (spaceTotalLetter === totalPages * 5) {
      setCurrentPage(totalPages + 1);
    } else {
      setCurrentPage(totalPages);
    }
    console.log(totalPages, currentPage);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (ref) {
      const planetBounds = ref.current?.getBoundingClientRect();

      if (planetBounds) {
        const { clientX, clientY } = e;
        if (
          clientX >= planetBounds.left &&
          clientX <= planetBounds.right &&
          clientY >= planetBounds.top &&
          clientY <= planetBounds.bottom
        ) {
          console.log(
            "드래그 대상",
            droppedItem?.letterId,
            droppedItem?.senderName
          );
          if (droppedItem) {
            handleTagTouch(droppedItem);
          }
        } else {
          console.log("드래그 범위가 아님");
        }
      }
    }
  };

  const handleMovePlanet = async (letterId: string, senderName: string) => {
    try {
      await putLetterToPlanet({
        letterId: letterId || "",
        spaceId: spaceInfo?.spaceId!,
      });
      console.log(`${senderName}님의 편지가 행성으로 이동했습니다.`);
      if (!show) {
        setToast({
          show: true,
          message: `${senderName}님의 편지가 행성으로 이동했습니다.`,
          close: false,
        });
      }
      //setDroppedItem(null);
    } catch {
      console.log("편지 다른 행성 이동 실패");
    }
  };

  return (
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
                {countLetter < 3 ? (
                  <>
                    {userName}님의 스페이스를
                    <br />
                    편지로 수놓아 보세요
                  </>
                ) : (
                  <>
                    {userName}님의 스페이스에
                    <br />
                    <Em>{countLetter}개의 편지</Em>가 수놓여 있어요!
                  </>
                )}
              </Title>
              <Icon
                src="/assets/icons/ic_mypage.svg"
                width={24}
                height={24}
                alt="mypage"
                onClick={goToMyPage}
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
            {/* <PlanetWrapper
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              ref={planetRef}
            >
              <Planet
                planetType={spaceInfo?.templateType || 0}
                planet={spaceInfo?.spaceName || ""}
                orbits={currentOrbits || []}
                onEditPlanetName={handleEditPlanetName}
                setCurrentOrbits={setCurrentOrbits}
              />
            </PlanetWrapper> */}
            <MainWrapper>
              <SliderWrapper
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                ref={ref}
              >
                <PlanetSlide
                  idx={currentPage}
                  direction={direction}
                  spaceInfo={spaceInfo}
                  currentOrbits={currentOrbits || []}
                  setCurrentOrbits={setCurrentOrbits}
                  onEditPlanetName={handleEditPlanetName}
                />
              </SliderWrapper>
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
            </MainWrapper>
          </Container>
          <Bottom
            orbitMessages={orbitMessages || null}
            onDelete={handleDeleteOrbit}
            onOrbitDrag={handleTagDrag}
            onOrbitTouch={handleTagTouch}
          />
        </>
      )}
    </Layout>
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

const Icon = styled(Image)`
  cursor: pointer;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
`;

const Title = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.heading02};
`;

const Em = styled.span`
  ${(props) => props.theme.fonts.heading01}
`;

const TagList = styled.div`
  display: flex;
  box-sizing: border-box;
  gap: 8px;
  overflow-x: scroll;
  padding: 0 20px;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

// const PlanetWrapper = styled.div`
//   width: 100%;
//   height: 100%;
//   position: relative;
//   transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
// `;

const SliderWrapper = styled.div`
   width: 400px;
   height: 400px;
   overflow: scroll;
   background-color: ${theme.colors.bg};
`;

const PageWrapper = styled.div`
    width: 100%;
    height: 0px;
    z-index: 1;
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    top: 600px;
    left: 50%;
    padding: 20px;
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

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;
