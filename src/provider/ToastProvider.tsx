import { useRecoilValue } from "recoil";
import { toastState } from "@/recoil/toastStore";
import Toast from "@/components/common/Toast";

const ToastProvider = () => {
  const toast = useRecoilValue(toastState);

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          icon={toast.icon}
          iconType={toast.iconType as "info" | "message"}
          top={toast.top}
          bottom={toast.bottom}
          left={toast.left}
          right={toast.right}
          padding={toast.padding}
          close={toast.close}
        />
      )}
    </>
  );
};

export default ToastProvider;
