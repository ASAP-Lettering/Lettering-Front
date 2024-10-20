import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NewItemPicker from "../signup/NewItemPicker";
import Button from "../common/Button";
import Calendar from "./Calendar";
import { motion } from "framer-motion";

interface ModalProps {
  confirmText?: string;
  onConfirm: (birthday: string) => void;
  onDateChange: (date: string) => void;
  onClose: () => void;
  initialYear: string;
  initialMonth: string;
  initialDate: string;
}

const Modal = (props: ModalProps) => {
  const {
    confirmText = "선택 완료",
    onConfirm,
    onDateChange,
    onClose,
    initialDate,
    initialMonth,
    initialYear,
  } = props;

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selecetedDate, setSelecetedDate] = useState(initialDate);
  const [newYearItem, setNewYearItem] = useState<string | null>();
  const [newMonthItem, setNewMonthItem] = useState<string | null>();
  const [isContainerVisible, setIsContainerVisible] = useState(false);

  const [type, setType] = useState(true);

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

  const handleSumbitNewBirthday = () => {
    let month = selectedMonth;
    let date = selecetedDate;
    if (parseInt(selectedMonth) < 10) {
      month = "0" + selectedMonth;
    }
    if (parseInt(selecetedDate) < 10) {
      date = "0" + selecetedDate;
    }
    const fullDate = `${selectedYear}.${month}.${date}`;
    onDateChange(fullDate);
    console.log("제출되었습니다", fullDate);
    onConfirm(fullDate);
  };

  useEffect(() => {
    console.log(selectedYear + "." + selectedMonth + "." + selecetedDate);
  }, [selecetedDate, selectedYear, selectedMonth]);

  useEffect(() => {
    setTimeout(() => {
      setIsContainerVisible(true);
    }, 500);
  }, []);

  const handleLeftClick = () => {
    let intMonth = parseInt(selectedMonth);
    let intYear = parseInt(selectedYear);
    if (intMonth > 1) {
      intMonth = intMonth - 1;
      handleSelectMonthChange(intMonth.toString());
      console.log("leftClick" + selectedMonth);
      setNewYearItem(intYear.toString());
      setNewMonthItem(intMonth.toString());
    } else {
      if (intYear > 1910) {
        intYear = intYear - 1;
        handleSelectYearChange(intYear.toString());
        handleSelectMonthChange("12");
      }
      setNewYearItem(intYear.toString());
      setNewMonthItem(intMonth.toString());
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
      setNewYearItem(intYear.toString());
      setNewMonthItem(intMonth.toString());
    } else {
      if (intYear < 2024) {
        intYear = intYear + 1;
        handleSelectYearChange(intYear.toString());
        handleSelectMonthChange("1");
      }
      setNewYearItem(intYear.toString());
      setNewMonthItem(intMonth.toString());
    }
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ModalContainer
        initial={{ opacity: 0, y: "100vh" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100vh" }}
        transition={{
          type: "spring",
          stiffness: 170,
          damping: 20,
          bounce: 0.25,
          duration: 0.6,
        }}
      >
        <Header>
          <DateSwapWrapper isVisible={isContainerVisible}>
            <IconButton
              src="/assets/profile/ic_arrow_left.svg"
              onClick={handleLeftClick}
            />
            <HeaderTitle>
              {selectedYear + ". " + selectedMonth}
              <IconButton
                src={
                  type
                    ? "/assets/profile/ic_arrow_up.svg"
                    : "/assets/profile/ic_arrow_down.svg"
                }
                onClick={() => setType(!type)}
              />
            </HeaderTitle>
            <IconButton
              src="/assets/profile/ic_arrow_right.svg"
              onClick={handleRightClick}
            />
          </DateSwapWrapper>
          <IconButton src="/assets/profile/ic_close.svg" onClick={onClose} />
        </Header>
        <ContentWrapper>
          {type ? (
            <ItemPickerWrapper>
              <NewItemPicker
                items={years}
                defaultItem={selectedYear}
                unit="년"
                onChange={handleSelectYearChange}
                newItem={newYearItem}
              />
              <NewItemPicker
                items={months}
                defaultItem={selectedMonth}
                unit="월"
                onChange={handleSelectMonthChange}
                newItem={newMonthItem}
              />
              <NewItemPicker
                items={days}
                defaultItem={selecetedDate}
                unit="일"
                onChange={handleSelectDayChange}
              ></NewItemPicker>
              <PickedItemContainer />
            </ItemPickerWrapper>
          ) : (
            <Calendar
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDate={selecetedDate}
              onDateChange={handleSelectDayChange}
            />
          )}
        </ContentWrapper>
        <ButtonWrapper>
          <Button
            buttonType="primary"
            size="medium"
            text={confirmText}
            onClick={handleSumbitNewBirthday}
            width="80%"
          />
        </ButtonWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

const ModalOverlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 360px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.gray900};
  backdrop-filter: blur(4px);
  position: fixed;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray800};
`;

const DateSwapWrapper = styled.div<{ isVisible: boolean }>`
    display: flex;
    align-items: center;
    gap: 28px;
    opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
    transition: opacity 0.5s ease-in-out;
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
  margin-bottom: 10px;
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

const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
`;
