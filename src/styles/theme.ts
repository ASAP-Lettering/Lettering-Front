import { DefaultTheme } from "styled-components";

const colors = {
  main01: "#424DA0",
  sub01: "#2C3361",
  sub02: "#565C81",
  sub03: "#424DA0",

  gray900: "#FBFBFD",
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
    line-height : ${size * 1.5}px;
    letter-spacing: -0.42px;
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
    "https://sparkling-streetcar-d42.notion.site/Lettering-a4a1bfc211c147ab92b4b1a43b71d2c9",
  service:
    "https://sparkling-streetcar-d42.notion.site/4993fe0fe9204fb6806ce6422aa686b2",
  marketing:
    "https://sparkling-streetcar-d42.notion.site/0178d3b682e54799952075c4364e8994",
};

export type ColorsTypes = typeof colors;
export type FontsTypes = typeof fonts;

export const theme: DefaultTheme = {
  colors,
  fonts,
};
