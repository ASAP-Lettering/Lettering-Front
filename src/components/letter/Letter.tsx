import React from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";

interface LetterProps {
  templateType: number;
  name: string;
  content: string;
  date: string;
  images?: string[];
}

const Letter = (props: LetterProps) => {
  const { templateType, name, content, date, images } = props;

  return (
    <Container templateType={templateType}>
      <Header>
        <Name>From.{name}</Name>
        <Date>{date}</Date>
      </Header>
      <Content>{content}</Content>
      <PageNation></PageNation>
    </Container>
  );
};

export default Letter;

const Container = styled.div<{ templateType: number }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    max-width: 354px;
    min-height: 357px;
    background-image: ${({ templateType }) =>
      `url('/assets/letter/background_${templateType}.png')`};
    background-size: 100% auto; 
    background-position: center;
    background-repeat: no-repeat;
`;

const Header = styled.div`
    width: 100%;
`;

const Name = styled.div`
    width: 100%;
`;

const Date = styled.div`
    width: 100%;
`;

const Content = styled.div`
    width: 100%;
`;

const Image = styled.div`
    width: 100%;
`;

const PageNation = styled.div`
    width: 100%;
`;
