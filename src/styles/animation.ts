import { keyframes } from "styled-components";

export const flipAnimation = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
`;
