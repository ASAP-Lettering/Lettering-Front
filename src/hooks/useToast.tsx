import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { toastState } from "@/recoil/toastStore";

interface ShowToastOptions {
  icon?: boolean;
  close?: boolean;
  duration?: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  padding?: string;
}

export const useToast = () => {
  const setToast = useSetRecoilState(toastState);

  const showToast = useCallback(
    (message: string, options: ShowToastOptions = {}) => {
      const {
        icon = false,
        close = false,
        duration = 3000,
        top = "",
        bottom = "65px",
        left = "50%",
        right = "",
        padding = "",
      } = options;

      // 토스트 상태 설정
      setToast({
        show: true,
        message,
        icon,
        close,
        top,
        bottom,
        left,
        right,
        padding,
      });

      // duration 후에 토스트 자동 닫기
      setTimeout(() => {
        setToast({
          show: false,
          message: "",
          icon: false,
          close: false,
          top,
          bottom,
          left,
          right,
          padding,
        });
      }, duration);
    },
    [setToast]
  );

  return { showToast };
};
