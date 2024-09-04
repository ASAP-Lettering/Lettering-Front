"use client";

import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import GuideText from "@/components/common/GuideText";
import Input from "@/components/common/Input";
import NavigatorBar from "@/components/common/NavigatorBar";
import Tag from "@/components/common/Tag";
import Toast from "@/components/common/Toast";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";

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
  const [text, setText] = useState("");
  const [textarea, setTextarea] = useState("");

  /* Toast */
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
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
      {showToast && <Toast text="Toast Msg" icon={false} />}
      {showToast && <Toast text="Toast Msg" icon={true} />}
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
      <Tag tagType="orbit" read={false} name="Orbit" />
      <Tag tagType="orbit" read={true} name="Orbit" />
      <Tag tagType="planet" name="Planet" icon="chevron" />
      <Tag tagType="planet" name="Planet" icon="edit" />
      <Tag tagType="planet" name="" icon="plus" />
      <Tag tagType="letter" name="Letter" />
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
