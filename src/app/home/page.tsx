"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import Bottom from "@/components/common/Bottom";
import Planet from "@/components/common/Planet";
import Tag from "@/components/common/Tag";
import { ORBITS } from "@/constants/orbit";
import { theme } from "@/styles/theme";
import Pagination from "@/components/common/Pagination";

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPage = 3;

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
          <Tag tagType="planet" name="" icon="plus" />
        </TagList>
        <Planet planetType={0} planet="민지님의 첫 행성" orbits={ORBITS} />
        <PageWrapper>
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </PageWrapper>
      </Container>
      <Bottom />
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

const PageWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
