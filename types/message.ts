export type Message = {
  id: string;
  username: string;
  text: string;
  createdAt: Date;
};

export type MessageDocument = {
  username: string;
  text: string;
  createdAt: Date;
};
