export enum TokenType {
  LeftBrace = "{",
  RightBrace = "}",
  LeftBracket = "[",
  RightBracket = "]",
  Colon = ":",
  Comma = ",",

  String = "STRING",
  Number = "NUMBER",
  True = "TRUE",
  False = "FALSE",
  Null = "NULL",

  EOF = "EOF",
  Illegal = "ILLEGAL",
}

export interface Token {
  type: TokenType;
  literal: string;
  offset: number;
  line: number;
  column: number;
  message?: string;
}