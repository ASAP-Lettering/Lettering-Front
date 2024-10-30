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

/* div,
img
{
  //드래그방지
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
} */

button {
  cursor:pointer;
  border: none;
  background: transparent;
  
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select:none;

}

input, textarea {
  border: none;
  outline: none;
  resize: none;
}

@font-face {
    font-family: "Pretendard";
    //src: url("/public/assets/fonts/PretendardVariable.woff2") format('font-woff2'); 
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
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
