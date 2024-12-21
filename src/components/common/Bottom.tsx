import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Tag from "./Tag";
import Button from "./Button";
import { theme } from "@/styles/theme";
import { Orbit } from "@/constants/orbit";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BottomProps {
  orbitMessages: Orbit[] | null;
  onDelete: (deleteId: string) => void;
  onOrbitDrag: (item: Orbit) => void;
  onOrbitTouch: (item: Orbit) => void;
}

const Bottom = (props: BottomProps) => {
  const { orbitMessages, onDelete, onOrbitDrag, onOrbitTouch } = props;

  const router = useRouter();
  const goToOrbitDetail = (id: string) => {
    router.push(`/independent/${id}`);
  };
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  const handleDrag = (item: Orbit) => {
    onOrbitDrag(item);
  };

  const handleTouch = (item: Orbit) => {
    onOrbitTouch(item);
  };

  return (
    <Container>
      <Top>
        <Title>
          새 편지함
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
        <Orbits>
          {orbitMessages.map((item, index) => (
            <Tag
              key={index}
              tagType="orbit"
              tagId={item.letterId}
              name={item.senderName}
              isNew={item.isNew}
              isDeleteMode={isDeleteMode}
              onDelete={onDelete}
              onClick={() => goToOrbitDetail(item.letterId)}
              isDragable={true}
              onDragEnd={handleDrag}
              onTouchEnd={handleTouch}
            />
          ))}
        </Orbits>
      ) : (
        <NoOrbit>보관된 편지가 없습니다.</NoOrbit>
      )}
      <Divider />
      <ButtonRow>
        <Button
          buttonType="primary"
          size="large"
          text="받은 편지 보관하기"
          height="60px"
          onClick={() => {
            router.push("/letter/register");
          }}
        />
        <Button
          buttonType="secondary"
          size="large"
          text="편지 보내기"
          width="131px"
          height="60px"
          onClick={() => router.push("/send/letter")}
        />
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

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
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
  height: 40px;
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
