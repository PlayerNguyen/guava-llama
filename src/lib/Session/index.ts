import { Message } from "../Message";

export default class Session {
  messages: Message[] = new Array();
  uniqueId: string;
  title?: string;
  model?: string;
  createdAt: Date;
  updatedAt: Date;

  isUsed: boolean = false;

  constructor(uniqueId: string) {
    this.uniqueId = uniqueId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
