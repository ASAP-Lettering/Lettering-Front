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
      damping: 25, // Adjusted for a smoother feel
      mass: 0.5, // Added mass for more natural movement
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25, // Consistent with the enter transition
      mass: 0.5,
      ease: [0.4, 0.0, 0.2, 1], // Ease-in-out effect
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
      <ContainerWrapper>
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
          {/* <TestDiv /> */}
        </Container>
      </ContainerWrapper>
    </AnimatePresence>
  );
};

export default PlanetSlide;

const TestDiv = styled.div`
    background-color: aqua;
    width: 300px;
    height: 400px;
`;

const ContainerWrapper = styled.div`
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.bg};
`;

const Container = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.bg};
`;
