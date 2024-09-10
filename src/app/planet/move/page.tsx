"use client";

import React, { Suspense, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import PlanetBox from "@/components/planet/PlanetBox";
import { PLANETS } from "@/constants/planet";
import Loader, { LoaderContainer } from "@/components/common/Loader";

const PlanetMovePage = () => {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const { letterId } = searchParams.get("letter");

  const name = "규리";
  const [checkePlanet, setCheckedPlanet] = useState<number>(PLANETS[0].id);

  const handleChangeChecked = (id: number) => {
    setCheckedPlanet(id);
  };

  const handleMovePlanet = () => {
    /* 편지 이동하기 */
    // 추후 작성
    router.push("/planet");
  };

  const handleMoveOrbit = () => {
    /* 편지 궤도로 보내기 */
  };

  return (
    <Layout>
      <NavigatorBar title="편지 이동하기" cancel={false} />
      <Container>
        <Label>{name}의 편지를 어디로 이동할까요?</Label>
        <Divider />
        <PlanetBoxList>
          {PLANETS.map((item) => (
            <PlanetBox
              key={item.id}
              id={item.id}
              planetName={item.name}
              count={item.count}
              checked={checkePlanet}
              current={item.current}
              onClick={() => {
                handleChangeChecked(item.id);
              }}
            />
          ))}
        </PlanetBoxList>
        <SendOrbitAreaWrapper>
          <SendOrbitArea onClick={handleMoveOrbit}>
            행성 궤도로 보내기
            <Small>
              궤도로 옮겨질 시, 홈에서 끌어당겨 언제든 추가할 수 있어요
            </Small>
          </SendOrbitArea>
        </SendOrbitAreaWrapper>
        <ButtonWrapper>
          <Button
            buttonType="primary"
            size="large"
            text="이동하기"
            disabled={checkePlanet === PLANETS[0].id}
            onClick={handleMovePlanet}
          />
        </ButtonWrapper>
      </Container>
    </Layout>
  );
};

export default function PlanetMovePaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <PlanetMovePage />
    </Suspense>
  );
}

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  gap: 7px;
  padding: 74px 20px 20px 20px;
  background-color: ${theme.colors.bg};
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
  margin-top: 34px;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${theme.colors.gray800};
  margin-top: 20px;
  margin-bottom: 22px;
`;

const PlanetBoxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SendOrbitAreaWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 110px;
  left: 0;
`;

const SendOrbitArea = styled.div`
  width: 100%;
  height: 84px;
  padding: 19px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: 10px;
  background: ${theme.colors.gray900};
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.body08};
`;

const Small = styled.div`
  text-align: center;
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.caption03}
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
