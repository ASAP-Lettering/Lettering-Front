"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import Bottom from "@/components/common/Bottom";
import Planet from "@/components/common/Planet";
import Tag from "@/components/common/Tag";
import { ORBIT_MESSAGE, ORBITS } from "@/constants/orbit";
import { theme } from "@/styles/theme";
import Pagination from "@/components/common/Pagination";
import Toast from "@/components/common/Toast";
import { useRouter } from "next/navigation";
import { OrbitMessage } from "@/types/orbit";

const HomePage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPage = 3;
  const [currentOrbits, setCurrentOrbits] = useState(
    ORBITS.slice(0, itemsPerPage)
  );

  const totalCount = 2;
  const [showToast, setShowToast] = useState<boolean>(false);

  const [draggedOrbit, setDraggedOrbit] = useState<OrbitMessage | null>(null);
  const [orbitMessages, setOrbitMessages] = useState(ORBIT_MESSAGE);

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

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    setCurrentOrbits(ORBITS.slice(startIndex, startIndex + itemsPerPage));
  }, [currentPage]);

  /* 토스트 메세지 */
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    if (totalCount < 3) handleShowToast();
  }, []);

  /* 드래그 앤 드롭 */
  const handleOrbitDragStart = (orbitId: number) => {
    const orbit = orbitMessages.find((item) => item.id === orbitId);
    setDraggedOrbit(orbit || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedOrbit) return;

    // 나의 궤도 메세지 업데이트
    const updatedOrbitMessages = orbitMessages.filter(
      (item) => item.id !== draggedOrbit?.id
    );

    // Orbit 위치 재설정
    const startIndex = (currentPage - 1) * itemsPerPage;
    const updatedOrbits = [...currentOrbits];
    updatedOrbits.unshift(draggedOrbit); // 첫 번째 값으로 추가

    // 페이지 업데이트
    setCurrentOrbits(
      updatedOrbits.slice(startIndex, startIndex + itemsPerPage)
    );

    setOrbitMessages(updatedOrbitMessages);

    setDraggedOrbit(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Layout>
      <Background
        src="/assets/images/background/home.svg"
        width={480}
        height={800}
        alt="background"
        over-fit="cover"
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
          <Tag tagType="planet" name="민지님의 첫 행성" icon="chevron" />
          <Tag
            tagType="planet"
            name=""
            icon="plus"
            onClick={() => router.push("/planet/add")}
          />
        </TagList>
        <PlanetWrapper onDrop={handleDrop} onDragOver={handleDragOver}>
          <Planet
            planetType={0}
            planet="민지님의 첫 행성"
            orbits={currentOrbits}
          />
        </PlanetWrapper>
        <PageWrapper>
          {showToast && (
            <Toast
              text="궤도에 있는 편지들을 끌어 당겨 행성으로 옮길 수 있어요"
              icon={false}
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
      <Bottom
        onDragStart={handleOrbitDragStart}
        orbitMessages={orbitMessages}
      />
    </Layout>
  );
};

export default HomePage;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  gap: 10px;
  padding: 74px 0px 0px 0px;
  position: relative;
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
