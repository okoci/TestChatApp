export type Message = {
  id: string;
  uid: string;
  username: string;
  text: string;
  createdAt: Date;
};

export type MessageDocument = {
  uid: string;
  username: string;
  text: string;
  createdAt: Date;
};
