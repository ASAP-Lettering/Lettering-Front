"use client";

import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import PlanetBox from "@/components/planet/PlanetBox";
import { Planet } from "@/constants/planet";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import {
  putLetterToIndep,
  putLetterToPlanet,
} from "@/api/planet/letter/spaceLetter";
import Image from "next/image";
import { getSpaceList } from "@/api/planet/space/space";
import { useToast } from "@/hooks/useToast";

const PlanetMovePage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letter");
  const senderName = searchParams.get("senderName");

  const [planets, setPlanets] = useState<Planet[]>();
  const [checkedPlanet, setCheckedPlanet] = useState<string>("");
  const [checkedIndep, setCheckedIndep] = useState<boolean>(false);
  const [checkePlanetName, setCheckedPlanetName] = useState<string>("");

  useEffect(() => {
    const fetchSpaceList = async () => {
      try {
        const response = await getSpaceList();
        console.log("전체 스페이스 목록 조회 성공:", response.data);
        setPlanets(response.data.spaces);
        setCheckedPlanet(response.data.spaces[0].spaceId);
      } catch (error) {
        console.error("전체 스페이스 목록 조회 실패:", error);
      }
    };

    fetchSpaceList();
  }, []);

  const handleChangeChecked = (item: Planet) => {
    setCheckedPlanet(item.spaceId);
    setCheckedPlanetName(item.spaceName);
    setCheckedIndep(false);
  };

  const handleMovePlanet = async () => {
    /* 편지 다른 행성 또는 궤도로 이동하기 */
    if (letterId) {
      try {
        // 우선, 편지 궤도(독립 편지)로 보내기
        await putLetterToIndep(letterId);
        console.log("편지 궤도 보내기 성공");

        // checkedPlanet가 있을 경우, 다른 행성으로 이동
        if (checkedPlanet) {
          await putLetterToPlanet({
            letterId: letterId,
            spaceId: checkedPlanet,
          });
          console.log("편지 다른 행성 이동 성공");

          showToast(
            `${senderName} 님의 편지가 ${checkePlanetName} 행성으로 이동했어요`,
            {
              icon: false,
              close: false,
              bottom: "230px",
              padding: "11px 20px",
            }
          );
        } else {
          showToast(
            `${senderName} 님의 편지가 ${checkePlanetName} 궤도로 이동했어요`,
            {
              icon: false,
              close: false,
              bottom: "230px",
            }
          );
        }

        router.push("/planet");
      } catch (error) {
        console.log("편지 이동 실패", error);
      }
    }
  };

  const handleMoveOrbit = () => {
    if (checkedIndep) {
      setCheckedIndep(false);
    } else {
      setCheckedIndep(true);
      setCheckedPlanet("");
    }
  };

  return (
    <Layout>
      <NavigatorBar title="편지 이동하기" cancel={false} />
      <Container>
        <Label>{senderName}의 편지를 어디로 이동할까요?</Label>
        <Divider />
        <PlanetBoxList>
          {planets?.map((item, index) => (
            <PlanetBox
              key={item.spaceId}
              id={item.spaceId}
              planetName={item.spaceName}
              count={item.letterCount}
              checked={checkedPlanet}
              current={index === 0}
              onClick={() => {
                handleChangeChecked(item);
              }}
            />
          ))}
        </PlanetBoxList>
      </Container>
      <SendOrbitAreaWrapper>
        <SendOrbitArea onClick={handleMoveOrbit}>
          <Top>
            {checkedIndep && (
              <Image
                src={`/assets/icons/ic_check.svg`}
                width={20}
                height={20}
                alt="check"
              />
            )}
            행성 궤도로 보내기
          </Top>
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
          disabled={
            (checkedPlanet === "" && checkedIndep === false) ||
            checkedPlanet === planets?.[0]?.spaceId
          }
          onClick={handleMovePlanet}
        />
      </ButtonWrapper>
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
  height: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  gap: 7px;
  padding: 20px;
  background-color: ${theme.colors.bg};
  position: relative;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
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
  margin-bottom: 200px;
`;

const SendOrbitAreaWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  position: fixed;
  padding: 0 20px;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
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

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Small = styled.div`
  text-align: center;
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.caption03}
  white-space: nowrap;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  position: fixed;
  padding: 0 20px;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
`;
