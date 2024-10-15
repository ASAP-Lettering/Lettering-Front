import { theme } from "@/styles/theme";
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { SpaceInfo } from "@/types/space";
import { Orbit } from "@/constants/orbit";
import Planet from "../common/Planet";

interface PlanetSlideProps {
  idx: number;
  currentOrbits: Orbit[] | null;
  spaceInfo: SpaceInfo | null;
  direction: number;
  onEditPlanetName: (newName: string) => void;
  setCurrentOrbits: React.Dispatch<React.SetStateAction<Orbit[] | undefined>>;
}

const slideVariants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  }),
};

const PlanetSlide = ({
  idx,
  direction,
  spaceInfo,
  currentOrbits,
  setCurrentOrbits,
  onEditPlanetName,
}: PlanetSlideProps) => {
  return (
    <AnimatePresence custom={direction}>
      <Container
        key={idx}
        custom={direction}
        variants={slideVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Planet
          planetType={spaceInfo?.templateType || 0}
          planet={spaceInfo?.spaceName || ""}
          orbits={currentOrbits || []}
          onEditPlanetName={onEditPlanetName}
          setCurrentOrbits={setCurrentOrbits}
        />
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
