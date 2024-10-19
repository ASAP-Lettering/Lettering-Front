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
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import { setSpaceId } from "@/utils/storage";
import { getMainId, putSpace } from "@/api/planet/space/space";
import {
  getOrbitLetter,
  getPlanetLetterList,
  putLetterToIndep,
  putLetterToPlanet,
} from "@/api/planet/letter/spaceLetter";
import Loader from "@/components/common/Loader";
import { SpaceInfo } from "@/types/space";
import {
  getAccessToken,
  getCookie,
  getInitUserToast,
  setCookie,
  setInitUserToast,
} from "@/utils/storage";
import { getLetterCount } from "@/api/letter/letter";
import PlanetSlide from "@/components/planet/PlanetSlide";
import { planetRefState } from "@/recoil/RefStore";
import { droppedLetterState } from "@/recoil/letterStore";
import { useToast } from "@/hooks/useToast";
import Tooltip from "@/components/common/Tooltip";

const PlanetPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [direction, setDirection] = useState(0); //슬라이드 방향
  const [currentOrbits, setCurrentOrbits] = useState<Orbit[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [orbitMessages, setOrbitMessages] = useState<Orbit[] | null>();
  const [spaceTotalLetter, setSpaceTotalLetter] = useState<number>(0);

  const [spaceInfo, setSpaceInfo] = useState<SpaceInfo | null>(null);
  const [userName, setUserName] = useState("");
  const [countLetter, setCountLetter] = useState<number>(0);
  const accessToken = getAccessToken(); // 에러핸들링

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const fetchGetLetterCount = async () => {
    try {
      const response = await getLetterCount();
      console.log("모든 편지 수 조회 성공:", response.data);
      setCountLetter(response.data.count);
      setCurrentOrbits(response.data.content);
      setIsLoading(false);
      if (response.data.count < 3 && getInitUserToast() !== "true") {
        setShowTooltip(true);
        setInitUserToast();
      }
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
          if (prevOrbits) {
            const updatedOrbits = [...prevOrbits];
            updatedOrbits.pop(); // 마지막 항목 제거
            return [droppedItem, ...updatedOrbits];
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
    if (spaceInfo?.spaceId) {
      fetchPlanetLetterList(spaceInfo?.spaceId, currentPage, itemsPerPage);
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
    setDroppedItem(null);
    setDroppedLetter({
      tagId: "",
      name: "",
    });
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    setDroppedItem(null);
    setDroppedLetter({
      tagId: "",
      name: "",
    });
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
  }, []);

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

  //터치 드래그 마무리
  const handleTagTouch = (draggedItem: Orbit) => {
    handleMovePlanet(draggedItem.letterId!, draggedItem.senderName);
    setOrbitMessages((prevMessages) =>
      prevMessages?.filter((item) => item.letterId !== draggedItem.letterId)
    );
    //total페이지가 1페이지 뿐일때
    if (totalPages === currentPage) {
      //행성에 편지가 존재할때
      if (currentOrbits && currentOrbits?.length > 0) {
        if (currentOrbits.length === 5) {
          setCurrentOrbits((prevOrbits) => {
            if (prevOrbits) {
              const updatedOrbits = [...prevOrbits];
              updatedOrbits.pop();
              return [draggedItem, ...updatedOrbits];
            }
            return prevOrbits;
          });
        } else {
          setCurrentOrbits([...currentOrbits, draggedItem]);
        }
        console.log("현재 행성에는 아이템이 있습니다.");
      } else {
        //행성에 편지가 존재하지 않을때(0개)
        setCurrentOrbits([draggedItem]);
        console.log("현재 행성에는 아이템이 없습니다.");
      }
    } else if (currentPage === 1) {
      //페이지는 여러장이지만 현재 위치가 1페이지일때
      setCurrentOrbits((prevOrbits) => {
        if (prevOrbits) {
          const updatedOrbits = [...prevOrbits];
          updatedOrbits.pop();
          return [draggedItem, ...updatedOrbits];
        }
        return prevOrbits;
      });
    } else {
      //페이지는 여러장이고, 현재 위치가 1페이지가 아닐때
      setDirection(-1);
      setCurrentPage(1);
    }
    // else if (spaceTotalLetter === totalPages * 5) {
    //   setCurrentPage(totalPages + 1);
    // } else {
    //   setCurrentPage(totalPages);
    // }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  //드래그 마무리
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

      showToast(`${senderName}님의 편지가 행성으로 이동했습니다.`, {
        icon: false,
        close: true,
        bottom: "230px",
        padding: "11px 13px",
      });
      //setDroppedItem(null);
    } catch {
      console.log("편지 다른 행성 이동 실패");
    }
  };

  //토큰 유효한지 확인
  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Layout>
        {isLoading ? (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        ) : (
          <>
            <Background
              src="/assets/images/background/bg_planet.png"
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
              <MainWrapper>
                <SliderWrapper
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  ref={ref}
                >
                  {/* <Shadow /> */}
                  <PlanetSlide
                    idx={currentPage}
                    direction={direction}
                    spaceInfo={spaceInfo}
                    currentOrbits={currentOrbits || []}
                    setCurrentOrbits={setCurrentOrbits}
                    onEditPlanetName={handleEditPlanetName}
                    setCountLetter={setCountLetter}
                  />
                </SliderWrapper>
                {showTooltip && (
                  <Tooltip
                    message="궤도에 있는 편지들을 끌어 당겨 행성으로 옮길 수 있어요"
                    close={true}
                    bottom="225px"
                    onClose={() => setShowTooltip(false)}
                  />
                )}
                <PageWrapper>
                  <Pagination
                    currentPage={currentPage}
                    totalPage={totalPages}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                  />
                </PageWrapper>
              </MainWrapper>
            </Container>
          </>
        )}
      </Layout>
      <BottomWrapper>
        <Bottom
          orbitMessages={orbitMessages || null}
          onDelete={handleDeleteOrbit}
          onOrbitDrag={handleTagDrag}
          onOrbitTouch={handleTagTouch}
        />
      </BottomWrapper>
    </>
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
  padding: 20px 0px 0px 0px;
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
  background-color: ${theme.colors.bg};
`;

const Icon = styled(Image)`
  cursor: pointer;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;

  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const Shadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(
    90deg,
    rgba(140, 160, 255, 0.5) 0%,
    rgba(6, 8, 18, 0) 100%
  );
  background: #a3c6ff;
  border-radius: 50%;
  filter: drop-shadow(0px 0px 7.29px #a3c6ff)
    drop-shadow(0px 0px 14.58px #a3c6ff) drop-shadow(0px 0px 51.03px #a3c6ff)
    drop-shadow(0px 0px 102.06px #a3c6ff) drop-shadow(0px 0px 174.96px #a3c6ff)
    drop-shadow(0px 0px 306.18px #a3c6ff);
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

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 650px;
  position: relative;
`;

const SliderWrapper = styled.div`
  width: 400px;
  height: 400px;
  overflow: scroll;
  background-color: ${theme.colors.bg};
`;

const PageWrapper = styled.div`
  width: 100%;
  height: 0px;
  z-index: 15;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  top: 360px;
  left: 50%;
  padding: 20px;
  transform: translateX(-50%);
`;

const BottomWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
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
