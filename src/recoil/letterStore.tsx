import { AtomEffect, atom, useSetRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

/* Next14에서 persistAtom 사용하기 */
const ssrCompletedState = atom({
  key: "SsrCompleted",
  default: false,
});

export const useSsrComplectedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState);
  return () => setSsrCompleted(true);
};

const { persistAtom } = recoilPersist();

export const persistAtomEffect = <T,>(param: Parameters<AtomEffect<T>>[0]) => {
  param.getPromise(ssrCompletedState).then(() => persistAtom(param));
};

type DroppedItem = {
  tagId: string;
  name: string;
  isNew?: boolean;
};

export const registerLetterState = atom({
  key: "registerLetterState",
  default: {
    senderName: "",
    content: "",
    images: [] as string[],
    templateType: 0,
  },
  effects_UNSTABLE: [persistAtomEffect],
});

export const sendLetterState = atom({
  key: "sendLetterState",
  default: {
    draftId: null as string | null,
    receiverName: "",
    content: "",
    images: [] as string[],
    templateType: 0,
  },
  effects_UNSTABLE: [persistAtomEffect],
});

export const draftState = atom({
  key: "draftState",
  default: "",
});

export const droppedLetterState = atom<DroppedItem>({
  key: "droppedLetterState",
  default: {
    tagId: "",
    name: "",
  },
});
