import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NewItemPicker from "../signup/NewItemPicker";
import Button from "../common/Button";

interface ModalProps {
  confirmText?: string;
  onConfirm: () => void;
}

const Modal = (props: ModalProps) => {
  const { confirmText = "선택 완료", onConfirm } = props;

  const [selectedYear, setSelectedYear] = useState("2001");
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [selecetedDate, setSelecetedDate] = useState("1");

  const years = Array.from({ length: 115 }, (_, i) => (1910 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (1 + i).toString());
  const days = Array.from(
    {
      length: new Date(
        parseInt(selectedYear),
        parseInt(selectedMonth),
        0
      ).getDate(),
    },
    (_, i) => (1 + i).toString()
  );

  const handleSelectYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleSelectMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleSelectDayChange = (day: string) => {
    setSelecetedDate(day);
  };

  const handleLeftClick = () => {
    let intMonth = parseInt(selectedMonth);
    let intYear = parseInt(selectedYear);
    if (intMonth > 1) {
      intMonth = intMonth - 1;
      handleSelectMonthChange(intMonth.toString());
      console.log("leftClick" + selectedMonth);
    } else {
      if (intYear > 1910) {
        intYear = intYear - 1;
        handleSelectYearChange(intYear.toString());
        handleSelectMonthChange("12");
      }
    }
  };

  const handleRightClick = () => {
    let intMonth = parseInt(selectedMonth);
    let intYear = parseInt(selectedYear);

    if (intMonth < 12) {
      intMonth = intMonth + 1;
      console.log(intMonth);
      handleSelectMonthChange(intMonth.toString());
      console.log("rightClick" + selectedMonth);
    } else {
      if (intYear < 2024) {
        intYear = intYear + 1;
        handleSelectYearChange(intYear.toString());
        handleSelectMonthChange("1");
      }
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <DateSwapWrapper>
            <IconButton
              src="/assets/profile/ic_arrow_left.svg"
              onClick={handleLeftClick}
            />
            <HeaderTitle>
              {selectedYear + ". " + selectedMonth}
              <img src="/assets/profile/ic_arrow_up.svg" />
            </HeaderTitle>
            <IconButton
              src="/assets/profile/ic_arrow_right.svg"
              onClick={handleRightClick}
            />
          </DateSwapWrapper>
        </Header>
        <ContentWrapper>
          <ItemPickerWrapper>
            <NewItemPicker
              items={years}
              defaultItem={"2004"}
              unit="년"
              onChange={handleSelectYearChange}
              scrollToItem={selectedYear}
            />
            <NewItemPicker
              items={months}
              defaultItem={"1"}
              unit="월"
              onChange={handleSelectMonthChange}
              scrollToItem={selectedMonth}
            />
            <NewItemPicker
              items={days}
              defaultItem={"1"}
              unit="일"
              onChange={handleSelectDayChange}
            ></NewItemPicker>
            <PickedItemContainer />
          </ItemPickerWrapper>
        </ContentWrapper>
        <Button
          buttonType="primary"
          size="small"
          text={confirmText}
          onClick={onConfirm}
          width="100%"
        />
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

const ModalOverlay = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 27px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 12px;
  background: rgba(62, 65, 81, 0.7);
  backdrop-filter: blur(4px);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DateSwapWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 28px;
`;

const HeaderTitle = styled.div`
    display: flex;
    gap: 8px;
    justify-content: space-between;
    width: 75px;
    overflow: hidden;
    min-width: 90px;
    max-width: 90px;
    ${(props) => props.theme.fonts.title02};
    white-space: nowrap;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.caption03};
`;

const ModalTitle = styled.div`
  ${(props) => props.theme.fonts.subtitle};
`;

const ItemPickerWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  gap: 5px;
  flex-direction: row;
  justify-content: center;
  position: relative;
`;

const PickedItemContainer = styled.div`
  position: absolute;
  top: 79px;
  width: 95%;
  height: 60px;
  background-color: ${(props) => props.theme.colors.gray800};
  border-radius: 8px;
  z-index: 2;
`;

const IconButton = styled.img`
    cursor: pointer;
`;
