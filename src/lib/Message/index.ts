export interface Message {
  id: string;
  content: string;
  at: Date;
  type: "system" | "user" | "bot";
}
