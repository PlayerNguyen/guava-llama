export class RandomUtils {
  /**
   * Generates a random, readable ID of specified length.
   *
   * The generated ID is created by taking a portion of a random string in base 36,
   * effectively producing a cryptographically secure pseudorandom value that can be easily
   * read and understood as human-readable text.
   */
  public static generateRandomReadableId() {
    return Math.random().toString(36).substring(2, 12);
  }
}
