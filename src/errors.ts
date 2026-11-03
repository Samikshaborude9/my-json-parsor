export class ParseError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number,
    public offset: number
  ) {
    super(`${message} (line ${line}, column ${column})`);
    this.name = "ParseError";
  }
}