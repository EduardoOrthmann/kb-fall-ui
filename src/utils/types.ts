export interface Message {
  text: string;
  user: string;
  timestamp: string;
}

export interface Conversation {
  _id: string;
  name: string;
  user: string;
}
