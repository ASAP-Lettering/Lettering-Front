'use client';

import BlinkTag from '@/components/common/BlinkingTag';
import Button from '@/components/common/Button';
import Check from '@/components/common/Check';
import ConfirmModal from '@/components/common/ConfirmModal';
import GuideText from '@/components/common/GuideText';
import Input from '@/components/common/Input';
import KakaoShareButton from '@/components/common/KakaoShareButton';
import NavigatorBar from '@/components/common/NavigatorBar';
import Tag from '@/components/common/Tag';
import Toast from '@/components/common/Toast';
import Letter from '@/components/letter/Letter';
import NewItemPicker from '@/components/signup/NewItemPicker';
import Picker from '@/components/timecapsule/Picker';
import ItemPicker from '@/components/timecapsule/Picker';
import { LETTER_DUMMY } from '@/constants/letterDummy';
import { theme } from '@/styles/theme';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';
import styled from 'styled-components';

const GuidePage = () => {
  /* Check */
  const [isCheckedDefault, setIsCheckedDefault] = useState(false);
  const [isCheckedBox, setIsCheckedBox] = useState(false);

  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedDefault(e.target.checked);
  };

  const handleBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedBox(e.target.checked);
  };

  /* Input */
  const [text, setText] = useState('');
  const [textarea, setTextarea] = useState('');

  /* Toast */
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  /* Confirm Modal */
  const [confirmModal, setConfirmModal] = useState(false);

  const handleShowConfirmModal = () => {
    setConfirmModal(true);
  };

  const handleConfirm = () => {
    alert('삭제 완료');
    setConfirmModal(false);
  };

  const handleCancel = () => {
    setConfirmModal(false);
  };

  //ItemPicker
  const items = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const [selectedItem, setSelectedItem] = useState(items[0]);

  const handleItemChange = (item: string) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    console.log(selectedItem);
  }, [selectedItem]);

  //Letter
  const letterData = LETTER_DUMMY[0];
  const imageData = [
    'https://lettering-images.s3.amazonaws.com/0192e660-0efb-7729-b107-19f5ed4a7fb9/4c182685-da2a-49fd-8251-ecc8914733c6',
    'https://lettering-images.s3.amazonaws.com/0192e660-0efb-7729-b107-19f5ed4a7fb9/4c182685-da2a-49fd-8251-ecc8914733c6',
    'https://lettering-images.s3.amazonaws.com/0192e660-0efb-7729-b107-19f5ed4a7fb9/4c182685-da2a-49fd-8251-ecc8914733c6'
  ];

  //bottomSheet
  const [viewportRef, { height: viewportHeight }] = useMeasure();
  const [isBottomUp, setIsBottomUp] = useState(false);
  const [isDisplayed, setIsDisplayed] = useState(true);

  const handleBottomUpChange = (state: boolean) => {
    setIsBottomUp(state);
  };

  const handleDisplay = () => {
    setIsDisplayed(!isDisplayed);
  };

  return (
    <Container>
      <h1>Guide</h1>
      <br />
      <h3>Button</h3>
      <Button buttonType="primary" size="large" text="Primary Large Button" />
      <Button buttonType="primary" size="medium" text="Primary Medium Button" />
      <Button buttonType="primary" size="small" text="Button" />
      <Button
        buttonType="secondary"
        size="large"
        text="Secondary Large Button"
      />
      <Button
        buttonType="secondary"
        size="medium"
        text="Secondary Medium Button"
      />
      <Button buttonType="secondary" size="small" text="Button" />
      <Button buttonType="secondary" size="default" text="Button" />
      <br />
      <h3>Check</h3>
      <Check
        checkType="default"
        label="Default Checkbox"
        checked={isCheckedDefault}
        onChange={handleDefaultChange}
      >
        <SpaceBetween>
          <Gray>(필수)</Gray>
          <Image
            src="/assets/icons/ic_chevron_right.svg"
            width={24}
            height={24}
            alt="arrow"
          />
        </SpaceBetween>
      </Check>
      <Check
        checkType="box"
        label="Box Checkbox"
        checked={isCheckedBox}
        onChange={handleBoxChange}
      />

      <br />
      <h3>Input</h3>
      <Input
        inputType="underline"
        value={text}
        onChange={setText}
        placeholder="Underline Input"
      />
      <Input
        inputType="boxText"
        value={text}
        onChange={setText}
        placeholder="BoxText Input"
      />
      <Input
        inputType="boxTextArea"
        value={textarea}
        onChange={setTextarea}
        placeholder="BoxTexarea Input"
      />
      <Input
        inputType="boxTextArea"
        value={textarea}
        onChange={setTextarea}
        placeholder="BoxTexarea Input (height=150px)"
        height="150px"
      />
      <br />
      <h3>NavigatorBar</h3>
      <NavigatorBar cancel={false} />
      <NavigatorBar title="NavigatorBar" cancel={true} />
      <br />
      <h3>Toast</h3>
      {showToast && <Toast message="Toast Msg" icon={false} iconType="info" />}
      {showToast && <Toast message="Toast Msg" icon={true} iconType="info" />}
      <Button
        buttonType="secondary"
        size="small"
        text="Show Toast"
        onClick={handleShowToast}
      />
      <br />
      <h3>GuideText</h3>
      <GuideText text="클릭하면 편지 내용을 확인할 수 있어요!" />
      <br />
      <h3>Tag</h3>
      <Tag tagType="orbit" isNew={false} name="Orbit" />
      <Tag tagType="orbit" isNew={true} name="Orbit" />
      <Tag tagType="planet" name="Planet" icon="chevron" />
      <Tag tagType="planet" name="Planet" icon="edit" />
      <Tag tagType="planet" name="" icon="plus" />
      <Tag tagType="letter" name="Letter" />
      <BlinkTag tagId="123" name="반짝임" />
      <br />
      <h3>Confirm Modal</h3>
      {confirmModal && (
        <ConfirmModal
          title="Title Text"
          sub="Sub Text"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <Button
        buttonType="secondary"
        size="small"
        text="Show Confirm Modal"
        onClick={handleShowConfirmModal}
        width="100%"
      />
      <h3>ItemPicker</h3>
      <PickedItemContainer>
        <Picker
          items={items}
          value={selectedItem}
          onChange={handleItemChange}
          height={200}
          visibleCount={3}
        />
      </PickedItemContainer>
      <h3>Letter</h3>
      <Letter
        showType="receive"
        id={letterData.id.toString()}
        templateType={letterData.templateType}
        name={letterData.sender}
        content={letterData.content}
        date={letterData.date}
        isImage={false}
      />
      <Letter
        showType="receive"
        id={letterData.id.toString()}
        templateType={letterData.templateType}
        name={letterData.sender}
        images={imageData}
        date={letterData.date}
        isImage={true}
      />
      <Letter
        showType="send"
        contentType="all"
        id={letterData.id.toString()}
        templateType={letterData.templateType}
        name={letterData.sender}
        content={letterData.content}
        date={letterData.date}
        isImage={false}
        height="450px"
      />
      <Letter
        showType="send"
        contentType="one"
        id={letterData.id.toString()}
        templateType={letterData.templateType}
        name={letterData.sender}
        images={imageData}
        date={letterData.date}
        isImage={true}
        height="450px"
      />
      <Letter
        showType="url"
        contentType="one"
        id={letterData.id.toString()}
        templateType={letterData.templateType}
        name={letterData.sender}
        content={letterData.content}
        date={letterData.date}
        isImage={false}
      />
      <h3>BottomSheet</h3>
      <ButtonContainer>
        <Button
          buttonType="secondary"
          size="default"
          text="Click It!"
          onClick={() => handleBottomUpChange(!isBottomUp)}
        />
        <Button
          buttonType="secondary"
          size="default"
          text="display"
          onClick={handleDisplay}
        />
      </ButtonContainer>
      <h3>카카오톡 공유하기</h3>
      <KakaoShareButton letterId="aa" />
      <KakaoShareButton type="small" letterId="aa" />
    </Container>
  );
};

export default GuidePage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: 10px;
  padding: 20px;
  background-color: ${theme.colors.bg};

  h1,
  h3 {
    color: ${theme.colors.white};
  }
`;

const Gray = styled.div`
  color: ${theme.colors.gray500};
`;

const SpaceBetween = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const PickedItemContainer = styled.div`
  width: 120px;
  margin: 0 auto;
`;

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
  background-color: white;
`;

const Mobile = styled.div`
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 600px;
  overflow: hidden;
  box-shadow: 0 0 50px 1px rgba(0, 0, 0, 0.2);
`;

const Content = styled.div`
  width: 100%;
  padding: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
