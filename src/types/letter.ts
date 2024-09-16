export type LetterType = {
  id: number; //편지 고유 id
  url: string; // 편지 url
  templateType: number; // 편지 배경
  sender: string; // 편지를 보낸 사람
  receiver: string; // 편지를 받은 사람
  content: string; // 편지의 내용
  images: String[]; // 편지에 image 배열
  date: string; // 편지 날짜
};

export type LetterDetailType = {
  id: number; //편지 고유 id
  url: string; // 편지 url
  templateType: number; // 편지 배경
  sender: string; // 편지를 보낸 사람
  receiver: string; // 편지를 받은 사람
  content: string; // 편지의 내용
  images: String[]; // 편지에 image 배열
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
