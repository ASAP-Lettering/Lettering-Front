import React, { useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";
import Button from "../common/Button";
import Pagination from "./Pagination";
import SwipeableContent from "./Content";

interface LetterProps {
  templateType: number;
  name: string;
  content: string;
  date: string;
  images?: string[];
}

const Letter = (props: LetterProps) => {
  const { templateType, name, content, date, images } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const newContent = ["content", content, content];
  const totalPage = newContent.length;

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPage ? prev + 1 : prev));
  };

  return (
    <Container templateType={templateType}>
      <TopContainer>
        <button onClick={handleNextPage}>next</button>
        <button onClick={handlePrevPage}>prev</button>
        <Name>From.{name}</Name>
        <img src="/assets/icons/ic_more.svg" />
      </TopContainer>
      <Date>{date}</Date>
      <Content>
        <SwipeableContent
          content={newContent}
          setPage={setCurrentPage}
          direction={0}
          totalPage={totalPage}
          page={currentPage}
        />
      </Content>
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </Container>
  );
};

export default Letter;

const Container = styled.div<{ templateType: number }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: 20px;
    max-width: 354px;
    min-height: 357px;
    background-image: ${({ templateType }) =>
      `url('/assets/letter/background_${templateType}.png')`};
    background-size: 100% auto; 
    background-position: center;
    background-repeat: no-repeat;
    color: white;
`;

const TopContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    button{
        color: white;
    }
`;

const Name = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    ${(props: any) => props.theme.fonts.title01};
`;

const Date = styled.div`
    width: 100%;
    ${(props: any) => props.theme.fonts.body06};
`;

const Content = styled.div`
    width: 100%;
    ${(props: any) => props.theme.fonts.body04};
    overflow: hidden;
`;

const Image = styled.div`
    width: 100%;
`;

const PageNation = styled.div`
    width: 100%;
`;
