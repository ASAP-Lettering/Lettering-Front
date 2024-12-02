import { DefaultTheme } from "styled-components";

const colors = {
  main01: "#424DA0",
  sub01: "#2C3361",
  sub02: "#565C81",
  sub03: "#7783C5",

  gray900: "#181B29",
  gray800: "#202232",
  gray700: "#2E3040",
  gray600: "#3E4151",
  gray500: "#5B5F70",
  gray400: "#818491",
  gray300: "#9FA1AC",
  gray200: "#BEC0C8",
  gray100: "#D5D7DE",
  gray50: "#F7F8F9",

  bg: "#060812",
  white: "#FFFFFF",
  red: "#E1303E",
} as const;

interface Font {
  weight: number;
  size: number;
}

const FONT = ({ weight, size }: Font): string => {
  return `
    font-family : "Pretendard";
    font-weight : ${weight};
    font-size : ${size}px;
    line-height : ${size * 1.6}px;
    letter-spacing: -0.48px;
    `;
};

const fonts = {
  /* Design System */
  heading01: FONT({
    weight: 600,
    size: 24,
  }),
  heading02: FONT({
    weight: 400,
    size: 24,
  }),
  title01: FONT({
    weight: 600,
    size: 20,
  }),
  title02: FONT({
    weight: 600,
    size: 18,
  }),
  subtitle: FONT({
    weight: 600,
    size: 16,
  }),

  body01: FONT({
    weight: 500,
    size: 24,
  }),
  body02: FONT({
    weight: 500,
    size: 20,
  }),
  body03: FONT({
    weight: 400,
    size: 20,
  }),
  body04: FONT({
    weight: 500,
    size: 18,
  }),
  body05: FONT({
    weight: 400,
    size: 18,
  }),
  body06: FONT({
    weight: 500,
    size: 16,
  }),
  body07: FONT({
    weight: 400,
    size: 16,
  }),
  body08: FONT({
    weight: 500,
    size: 14,
  }),
  body09: FONT({
    weight: 400,
    size: 14,
  }),
  body10: FONT({  // 반응형 추가
    weight: 600,
    size: 12,
  }),
  body11: FONT({  // 반응형 추가
    weight: 500,
    size: 10,
  }),
  body12: FONT({  // 반응형 추가
    weight: 500,
    size: 11,
  }),
  body13: FONT({  // 반응형 추가
    weight: 400,
    size: 11,
  }),
  body14: FONT({  // 반응형 추가
    weight: 600,
    size: 15,
  }),
  body15: FONT({  // 반응형 추가
    weight: 500,
    size: 9,
  }),

  button01: FONT({
    weight: 600,
    size: 16,
  }),
  button02: FONT({
    weight: 600,
    size: 14,
  }),
  button03: FONT({
    weight: 400,
    size: 12,
  }),

  caption01: FONT({
    weight: 500,
    size: 14,
  }),
  caption02: FONT({
    weight: 400,
    size: 14,
  }),
  caption03: FONT({
    weight: 500,
    size: 12,
  }),
  caption04: FONT({
    weight: 400,
    size: 12,
  }),
  caption05: FONT({
    weight: 400,
    size: 10,
  }),
};

export const links = {
  personal:
    "https://purrfect-place-f01.notion.site/Lettering-11cf1d47368f8173a392e5c36d67a26d?pvs=74",
  service:
    "https://purrfect-place-f01.notion.site/11cf1d47368f812cbb0aeaf81806e635",
  marketing:
    "https://purrfect-place-f01.notion.site/11cf1d47368f81209dc0cb87132629e2?pvs=74",
};

export type ColorsTypes = typeof colors;
export type FontsTypes = typeof fonts;

export const theme: DefaultTheme = {
  colors,
  fonts,
};
