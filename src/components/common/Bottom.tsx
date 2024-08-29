import React from "react";
import styled from "styled-components";
import Tag from "./Tag";
import Button from "./Button";
import { theme } from "@/styles/theme";
import { ORBIT_MESSAGE } from "@/constants/orbit";

const Bottom = () => {
  return (
    <Container>
      <Title>나의 궤도 메세지</Title>
      {ORBIT_MESSAGE ? (
        <Orbits>
          {ORBIT_MESSAGE.map((item) => (
            <Tag
              key={item.id}
              tagType="orbit"
              read={item.read}
              name={item.name}
            />
          ))}
        </Orbits>
      ) : (
        <NoOrbit>등록된 편지가 없습니다. 편지를 등록해볼까요?</NoOrbit>
      )}
      <Divider />
      <Button buttonType="primary" size="large" text="새 편지 등록하기" />
    </Container>
  );
};

export default Bottom;

const Container = styled.div`
  width: 100%;
  height: 214px;
  padding: 19px 24px 33px 24px;
  border-radius: 20px 20px 0px 0px;
  background: #181b29;
  position: sticky;
  bottom: 0;
  left: 0;
  z-index: 10;
`;

const Title = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.semibold16};
  margin-bottom: 8px;
`;

const Orbits = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  overflow-x: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const NoOrbit = styled.div`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.regular14};
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${theme.colors.gray800};
  margin: 16px 0;
`;
