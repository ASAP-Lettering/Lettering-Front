"use client";

import { createGlobalStyle, keyframes } from "styled-components";

const GlobalStyles = createGlobalStyle`    
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  width: 100%;
  height: 100%;
  max-width: 393px;
  margin: 0 auto;
  box-shadow: 0px 0px 64px 0px rgba(30, 41, 59, 0.1);
}

body {
  width: 100%;
  height: 100%;
  max-width: 393px;
  font-family: "Pretendard";
  white-space: pre-line;
}

a {
  color: inherit;
  text-decoration: none;
}

ol,
ul,
li {
  list-style: none;
}

button {
  cursor:pointer;
  border: none;
  background: transparent;
}

@font-face {
    font-family: "Pretendard";
    src: url("/public/assets/fonts/PretendardVariable.woff2") format('font-woff2'); 
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export default GlobalStyles;