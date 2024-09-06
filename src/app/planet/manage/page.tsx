"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { PLANETS } from "@/constants/planet";
import PlanetList from "@/components/planet/PlanetList";
import Image from "next/image";
import ConfirmModal from "@/components/common/ConfirmModal";
import Toast from "@/components/common/Toast";

const PlanetManagePage = () => {
  const router = useRouter();

  const count = 7;
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [checkedPlanets, setCheckedPlanets] = useState<number[]>([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const [deletePlanet, setDeletePlanet] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleClickDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleChangeChecked = (id: number) => {
    if (checkedPlanets.includes(id)) {
      setCheckedPlanets(checkedPlanets.filter((planetId) => planetId !== id));
    } else {
      setCheckedPlanets([...checkedPlanets, id]);
    }
  };

  const handleDeletePlanet = () => {
    setConfirmDeleteModal(true);
  };

  const handleConfirmDeletePlanet = () => {
    /* 행성 삭제하기 */
    // 추후 작성
    setConfirmDeleteModal(false);
    setDeleteMode(false);
    setDeletePlanet("ASAP"); // 삭제한 행성명으로
    handleShowToast();
  };

  const handleCancelDeletePlanet = () => {
    setConfirmDeleteModal(false);
  };

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <Layout>
      <NavigatorBar title="나의 행성 관리" cancel={false} />
      <Container>
        <Top>
          <Label>총 {count}개</Label>
          <DeleteModeButton onClick={handleClickDeleteMode}>
            {deleteMode ? (
              <DeleteModeButtonRow>
                <Image
                  src="/assets/icons/ic_check_small.svg"
                  width={13}
                  height={9}
                  alt="check"
                />
                전체 선택
              </DeleteModeButtonRow>
            ) : (
              <DeleteModeButtonRow>삭제</DeleteModeButtonRow>
            )}
          </DeleteModeButton>
        </Top>
        <Divider />
        <PlanetBoxList>
          {PLANETS.map((item) => (
            <PlanetList
              key={item.id}
              id={item.id}
              planetName={item.name}
              count={item.count}
              checked={checkedPlanets}
              deleteMode={deleteMode}
              isMain={item.current}
              onClick={() => {
                handleChangeChecked(item.id);
              }}
            />
          ))}
        </PlanetBoxList>
        {deleteMode && (
          <ButtonWrapper>
            <Button
              buttonType="primary"
              size="large"
              text="삭제하기"
              disabled={checkedPlanets?.length === 0}
              onClick={handleDeletePlanet}
            />
          </ButtonWrapper>
        )}
      </Container>
      {confirmDeleteModal && (
        <ConfirmModal
          title="해당 행성를 정말 삭제할까요?"
          sub="행성에 등록된 편지들도 함께 삭제됩니다."
          onConfirm={handleConfirmDeletePlanet}
          onCancel={handleCancelDeletePlanet}
        />
      )}
      {showToast && (
        <Toast
          text={`${deletePlanet} 행성과 등록된 편지들이 함께 삭제 되었어요`}
          icon={false}
          bottom="65px"
          left="50%"
        />
      )}
    </Layout>
  );
};

export default PlanetManagePage;

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

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 34px;
`;

const Label = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
`;

const DeleteModeButton = styled.button`
  display: flex;
  align-items: center;
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.body09};
`;

const DeleteModeButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
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

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
