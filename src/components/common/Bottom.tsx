import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Tag from "./Tag";
import Button from "./Button";
import { theme } from "@/styles/theme";
import { Orbit } from "@/constants/orbit";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BottomProps {
  orbitMessages: Orbit[] | null;
  onDelete: (deleteId: string) => void;
}

const Bottom = (props: BottomProps) => {
  const { orbitMessages, onDelete } = props;

  const router = useRouter();
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  return (
    <Container>
      <Top>
        <Title>
          나의 궤도 메세지
          {orbitMessages && orbitMessages?.length > 0 && (
            <Span>{orbitMessages?.length}개</Span>
          )}
        </Title>
        {orbitMessages && orbitMessages?.length > 0 && (
          <EditButton onClick={() => setIsDeleteMode(!isDeleteMode)}>
            {isDeleteMode ? "완료" : "수정"}
          </EditButton>
        )}
      </Top>
      {orbitMessages && orbitMessages?.length > 0 ? (
        <Droppable droppableId="droppable-bottom">
          {(provided) => (
            <Orbits ref={provided.innerRef} {...provided.droppableProps}>
              {orbitMessages.map((item, index) => (
                <Draggable
                  key={`${item.letterId}-orbits`}
                  draggableId={item.letterId}
                  index={index}
                  disableInteractiveElementBlocking
                >
                  {(provided) => (
                    <Tag
                      tagType="orbit"
                      tagId={item.letterId}
                      name={item.senderName}
                      isNew={item.isNew}
                      isDeleteMode={isDeleteMode}
                      innerRef={provided.innerRef}
                      dragHandleProps={provided.dragHandleProps}
                      draggableProps={provided.draggableProps}
                      onDelete={onDelete}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Orbits>
          )}
        </Droppable>
      ) : (
        <NoOrbit>등록된 편지가 없습니다. 편지를 등록해볼까요?</NoOrbit>
      )}
      <Divider />
      <ButtonRow>
        <Button
          buttonType="primary"
          size="large"
          text="새 편지 등록하기"
          height="60px"
          onClick={() => {
            router.push("/letter/register");
          }}
        />
        <Button
          buttonType="secondary"
          size="large"
          width="96px"
          height="60px"
          onClick={() => router.push("/send/write")}
        >
          <Image
            src="/assets/icons/ic_rocket.svg"
            width={40}
            height={40}
            alt="rocket"
          />
        </Button>
      </ButtonRow>
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

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.button01};
  margin-bottom: 8px;
`;

const Span = styled.span`
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.button03};
`;

const EditButton = styled.button`
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.button03};
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
  ${(props) => props.theme.fonts.caption02};
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${theme.colors.gray800};
  margin: 16px 0;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 11px;
`;
