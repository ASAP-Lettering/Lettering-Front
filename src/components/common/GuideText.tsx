import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

interface GuideText {
  text: string;
}

const GuideText = (props: GuideText) => {
  const { text } = props;
  return (
    <Container>
      <Image
        src="/assets/icons/ic_triangle.svg"
        width={16}
        height={16}
        alt="click"
      />
      {text}
    </Container>
  );
};

export default GuideText;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.regular14};
`;
