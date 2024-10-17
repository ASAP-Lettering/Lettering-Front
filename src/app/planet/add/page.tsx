"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import PlanetPalette from "@/components/planet/PlanetPalette";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { postNewSpace } from "@/api/planet/space/space";

const PlanetAddPage = () => {
  const router = useRouter();
  const [planet, setPlanet] = useState<string>("");
  const [templateType, setTemplateType] = useState<number>(0);

  const handleChangeType = (id: number) => {
    setTemplateType(id);
  };

  const handleAddPlanet = async () => {
    /* 새 행성 추가하기 */
    try {
      const response = await postNewSpace({
        spaceName: planet,
        templateType: templateType,
      });
      console.log("새 행성 추가 성공:", response.data);
      // 추가 완료 후 페이지 이동
      router.push("/planet");
    } catch (error) {
      console.error("새 행성 추가 실패:", error);
    }
  };

  return (
    <Layout>
      <NavigatorBar title="새 행성 추가하기" cancel={false} />
      <Container>
        <Essential>* 필수</Essential>
        <Column>
          <Label>추가할 행성의 이름을 입력해주세요 *</Label>
          <Input
            inputType="boxText"
            value={planet}
            onChange={setPlanet}
            placeholder="최대 10자까지 입력할 수 있어요"
          />
          <Add>내 스페이스에 {planet} 행성이 추가돼요</Add>
        </Column>
        <Label>원하는 행성의 종류를 선택해주세요 *</Label>
        <PlanetWrapper>
          <Image
            src={`/assets/images/planet/planet${templateType}.png`}
            width={200}
            height={200}
            alt="planet"
          />
        </PlanetWrapper>
        <PlanetPalette id={templateType} onClick={handleChangeType} />
        <ButtonWrapper>
          <Button
            buttonType="primary"
            size="large"
            text="완료"
            disabled={!planet || templateType === undefined}
            onClick={handleAddPlanet}
          />
        </ButtonWrapper>
      </Container>
    </Layout>
  );
};

export default PlanetAddPage;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  gap: 7px;
  padding: 20px;
  background-color: ${theme.colors.bg};
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Essential = styled.div`
  text-align: right;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption03};
  margin-bottom: 17px;
`;

const Column = styled.div`
  margin-bottom: 40px;
`;
const Label = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
  margin-bottom: 20px;
`;

const Add = styled.div`
  text-align: left;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption04};
  margin-top: 8px;
  margin-left: 25px;
`;

const PlanetWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
