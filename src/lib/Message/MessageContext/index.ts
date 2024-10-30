

export class MessageContext {
  public static readonly instance = new MessageContext();

  public messages = [];
  private constructor() { }


}