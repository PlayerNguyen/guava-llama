import { Message } from "../Message";

export default class Session {
  messages: Message[] = new Array();
  uniqueId: string;
  title?: string;
  model?: string;

  isUsed: boolean = false;

  constructor(uniqueId: string) {
    this.uniqueId = uniqueId;
  }
}
