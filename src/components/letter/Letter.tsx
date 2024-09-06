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
    <Container>
      <Header>From.{name}</Header>
    </Container>
  );
};

export default Letter;

const Container = styled.div`
    display: flex;
    width: 100%;
    max-width: 354px;
    background:white;
`;

const Header = styled.div`
    width: 100%;
`;
