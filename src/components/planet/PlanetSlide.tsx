import { theme } from "@/styles/theme";
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { SpaceInfo } from "@/types/space";
import { Orbit } from "@/constants/orbit";

interface PlanetSlideProps {
  idx: number;
  currentPage: number;
  totalPage: number;
  currentOrbits: Orbit[] | null;
  spaceInfo: SpaceInfo | null;
  direction: number;
  onEditPlanetName: (newName: string) => void;
  setCurrentOrbits: React.Dispatch<React.SetStateAction<Orbit[] | undefined>>;
}

const slideVariants = {
  entry: (direction: number) => ({
    x: direction ? -1000 : 1000,
    opacity: 0,
    scale: 0,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5 },
  },
  exit: (direction: number) => ({
    x: direction ? 1000 : -1000,
    y: -200,
    opacity: 0,
    scale: 0,
    transition: { duration: 0.5 },
  }),
};
const PlanetSlide = ({
  idx,
  currentPage,
  totalPage,
  direction,
  spaceInfo,
  currentOrbits,
  setCurrentOrbits,
  onEditPlanetName,
}: PlanetSlideProps) => {
  return (
    <AnimatePresence custom={direction}>
      <Container
        key={currentPage}
        custom={direction}
        variants={slideVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* <Planet
            planetType={spaceInfo?.templateType || 0}
            planet={spaceInfo?.spaceName || ""}
            orbits={currentOrbits || []}
            onEditPlanetName={onEditPlanetName}
            setCurrentOrbits={setCurrentOrbits}
          /> */}
        <TestDiv />
      </Container>
    </AnimatePresence>
  );
};

export default PlanetSlide;

const TestDiv = styled.div`
    background-color: aqua;
    width: 300px;
    height: 400px;
`;

const Container = styled(motion.div)`
    display: flex;
    justify-content: center;
`;
