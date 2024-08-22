"use client";

import Button from "@/components/common/Button";
import React from "react";
import styled from "styled-components";

const GuidePage = () => {
  return (
    <Container>
      <h1>Guide</h1>
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
    </Container>
  );
};

export default GuidePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
