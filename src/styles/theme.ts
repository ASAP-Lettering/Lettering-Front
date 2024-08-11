import { DefaultTheme } from "styled-components";

const colors = {
  white: "#FFFFFF",
  black: "#000000",
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
    `;
};

const fonts = {
  /*Bold*/
  bold45: FONT({
      weight: 700,
      size: 45,
  }),
  bold32: FONT({
      weight: 700,
      size: 32,
  }),
  bold25: FONT({
      weight: 700,
      size: 25,
  }),
  bold22: FONT({
      weight: 700,
      size: 22,
  }),
  bold20: FONT({
      weight: 700,
      size: 20,
  }),
  bold18: FONT({
      weight: 700,
      size: 18,
  }),
  bold16: FONT({
      weight: 700,
      size: 16,
  }),
  bold14: FONT({
      weight: 700,
      size: 14,
  }),
  bold12: FONT({
      weight: 700,
      size: 12,
  }),
  bold11: FONT({
      weight: 700,
      size: 11,
  }),
  bold10: FONT({
      weight: 700,
      size: 10,
  }),

  /*SemiBold*/
  semiBold18: FONT({
      weight: 600,
      size: 18,
  }),
  semiBold16: FONT({
      weight: 600,
      size: 16,
  }),
  semiBold15: FONT({
      weight: 600,
      size: 15,
  }),
  semiBold14: FONT({
      weight: 600,
      size: 14,
  }),
  semiBold12: FONT({
      weight: 600,
      size: 12,
  }),

  /*Medium*/
  medium16: FONT({
      weight: 500,
      size: 16,
  }),
  medium15: FONT({
      weight: 500,
      size: 15,
  }),
  medium14: FONT({
      weight: 500,
      size: 14,
  }),
  medium11: FONT({
      weight: 500,
      size: 11,
  }),

  /*Regular*/
  regular35: FONT({
      weight: 400,
      size: 35,
  }),
  regular28: FONT({
      weight: 400,
      size: 28,
  }),
  regular25: FONT({
      weight: 400,
      size: 25,
  }),
  regular20: FONT({
      weight: 400,
      size: 20,
  }),
  regular18: FONT({
      weight: 400,
      size: 18,
  }),
  regular16: FONT({
      weight: 400,
      size: 16,
  }),
  regular14: FONT({
      weight: 400,
      size: 14,
  }),
  regular12: FONT({
      weight: 400,
      size: 12,
  }),
  regular8: FONT({
      weight: 400,
      size: 8,
  }),
}

export type ColorsTypes = typeof colors;
export type FontsTypes = typeof fonts;

export const theme: DefaultTheme = {
  colors,
  fonts,
};