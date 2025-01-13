export interface Orbit {
  letterId: string;
  senderName: string;
  receivedDate?: string;
  isNew?: boolean;
  date?: string;
}

export type OrbitMessage = {
  id: number;
  name: string;
  read: boolean;
  date: string;
};
