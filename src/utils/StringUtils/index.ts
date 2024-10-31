export default class StringUtils {
  public static escapeBreakLineJsonString(input: string) {
    return input.replace(/(\r\n|\n|\r)/gm, "\\n");
  }
}
