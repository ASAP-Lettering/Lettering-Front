"use client";

import StyledJsxRegistry from "./registry";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import { RecoilRoot } from "recoil";
import GlobalStyles from "@/styles/GlobalStyles";
import ToastProvider from "@/provider/ToastProvider";

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledJsxRegistry>
      <RecoilRoot>
        <GlobalStyles />
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
        <ToastProvider />
      </RecoilRoot>
    </StyledJsxRegistry>
  );
}
