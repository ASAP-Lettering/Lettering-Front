import React, { useState } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import SwipeableContent from "./Content";

interface LetterProps {
  templateType: number;
  name: string;
  content?: string;
  date: string;
  isImage: boolean;
  images?: string[];
}

const Letter = (props: LetterProps) => {
  const { templateType, name, content, date, isImage, images } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const paginateContent = (content: string, maxCharsPerPage: number) => {
    const pages = [];
    for (let i = 0; i < content.length; i += maxCharsPerPage) {
      pages.push(
        content.substring(i, Math.min(content.length, i + maxCharsPerPage))
      );
    }
    return pages;
  };
  const contentPages = isImage ? images : paginateContent(content!, 150);
  const totalPage = isImage ? images!.length : contentPages!.length;

  return (
    <Container templateType={templateType}>
      <TopContainer>
        <Name>From.{name}</Name>
        <button>
          <img src="/assets/icons/ic_more.svg" />
        </button>
      </TopContainer>
      <Date>{date}</Date>
      <Content>
        <SwipeableContent
          content={isImage ? images! : contentPages!}
          setPage={setCurrentPage}
          totalPage={totalPage ? totalPage : 0}
          isImage={isImage}
          page={currentPage}
        />
      </Content>
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage ? totalPage : 0}
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
    display: flex;
    box-sizing: border-box;
    padding: 2.5rem 0;
    ${(props: any) => props.theme.fonts.body04};
    overflow: hidden;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
`;
