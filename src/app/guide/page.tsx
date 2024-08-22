"use client";

import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";

const GuidePage = () => {
  const [isCheckedDefault, setIsCheckedDefault] = useState(false);
  const [isCheckedBox, setIsCheckedBox] = useState(false);

  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedDefault(e.target.checked);
  };

  const handleBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedBox(e.target.checked);
  };

  return (
    <Container>
      <h1>Guide</h1>
      <br />
      <h3>Button</h3>
      <Button buttonType="primary" size="large" text="Primary Large Button" />
      <Button buttonType="primary" size="medium" text="Primary Medium Button" />
      <Button buttonType="primary" size="small" text="Primary Small Button" />
      <Button
        buttonType="secondary"
        size="large"
        text="Secondary Large Button"
      />
      <Button
        buttonType="secondary"
        size="medium"
        text="Ssecondary Medium Button"
      />
      <Button
        buttonType="secondary"
        size="small"
        text="Secondary Small Button"
      />
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
            src="/assets/icons/ic_arrow_right.svg"
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
    </Container>
  );
};

export default GuidePage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
