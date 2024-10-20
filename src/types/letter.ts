export type LetterType = {
  id: number; //편지 고유 id
  url?: string; // 편지 url
  templateType: number; // 편지 배경
  sender: string; // 편지를 보낸 사람
  receiver?: string; // 편지를 받은 사람
  content: string; // 편지의 내용
  images: string[]; // 편지에 image 배열
  date: string; // 편지 날짜
};

export type LetterDetailType = {
  id: number; //편지 고유 id
  url?: string; // 편지 url
  templateType: number; // 편지 배경
  sender: string; // 편지를 보낸 사람
  receiver?: string; // 편지를 받은 사람
  content: string; // 편지의 내용
  images: string[]; // 편지에 image 배열
  date: string; // 편지 날짜
  space_name: string;
  letter_count: number;
  prev_letter?: {
    letter_id: string;
    sender_name: string;
  };
  next_letter?: {
    letter_id: string;
    sender_name: string;
  };
};

export type SendedLetterType = {
  id: number; //편지 고유 id
  templateType: number; // 편지 배경
  receiver: string; // 편지를 받은 사람
  content: string; // 편지의 내용
  images: string[]; // 편지에 image 배열
  date: string; // 편지 날짜
};

export type IndependentLetterType = {
  senderName: string;
  letterCount: number;
  content: string;
  sendDate: string;
  images: string[];
  templateType: number;
  prevLetter?: {
    letterId: string;
    senderName: string;
  } | null;
  nextLetter?: {
    letterId: string;
    senderName: string;
  } | null;
};

export type SentLetterListType = {
  letterId: string;
  receiverName: string;
  sendDate: string;
};

export type SentDetailLetterType = {
  receiverName: string;
  sendDate: string;
  content: string;
  images: string[];
  templateType: number;
};
