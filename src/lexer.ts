import { CharReader } from "./reader";
import { Token, TokenType } from "./token";

const SYMBOLS: Record<string, TokenType> = {
  "{": TokenType.LeftBrace,
  "}": TokenType.RightBrace,
  "[": TokenType.LeftBracket,
  "]": TokenType.RightBracket,
  ":": TokenType.Colon,
  ",": TokenType.Comma,
};
const KEYWORDS: Record<string, TokenType> = {
  true: TokenType.True,
  false: TokenType.False,
  null: TokenType.Null,
};

function isLetter(ch: string): boolean {
  return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
}
function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

export class Lexer {
  private reader: CharReader;

  constructor(input: string) {
    this.reader = new CharReader(input);
  }

  private skipWhitespace(): void {
    while (
      this.reader.peek() === " " ||
      this.reader.peek() === "\n" ||
      this.reader.peek() === "\r" ||
      this.reader.peek() === "\t"
    ) {
      this.reader.next();
    }
  }

  nextToken(): Token {
    this.skipWhitespace();
    const pos = this.reader.getPosition();

    if (this.reader.isAtEnd()) {
      return {
        type: TokenType.EOF,
        literal: "",
        offset: pos.offset,
        line: pos.line,
        column: pos.column,
      };
    }
    if (this.reader.peek() === "-" || isDigit(this.reader.peek())) {
      return this.readNumber(pos);
    }
    if (isLetter(this.reader.peek())) {
      return this.readKeyword(pos);
    }
    if (this.reader.peek() === '"') {
      return this.readString(pos);
    }

    const char = this.reader.next();
    const type = SYMBOLS[char];

    if (type !== undefined) {
      return {
        type,
        literal: char,
        offset: pos.offset,
        line: pos.line,
        column: pos.column,
      };
    }

    return {
      type: TokenType.Illegal,
      literal: char,
      offset: pos.offset,
      line: pos.line,
      column: pos.column,
    };
  }
  private makeToken(
    type: TokenType,
    literal: string,
    pos: { offset: number; line: number; column: number },
    message?: string
  ): Token {
    return {
      type,
      literal,
      offset: pos.offset,
      line: pos.line,
      column: pos.column,
      ...(message !== undefined && { message }),
    };
  }

  private readString(pos: {
    offset: number;
    line: number;
    column: number;
  }): Token {
    this.reader.next(); // consume opening quote
    let value = "";

    while (true) {
      if (this.reader.isAtEnd()) {
        return this.makeToken(
          TokenType.Illegal,
          value,
          pos,
          "Unterminated string"
        );
      }

      const ch = this.reader.next();

      if (ch === '"') {
        return this.makeToken(TokenType.String, value, pos);
      }

      if (ch === "\\") {
        if (this.reader.isAtEnd()) {
          return this.makeToken(
            TokenType.Illegal,
            value,
            pos,
            "Unterminated string"
          );
        }
        const esc = this.reader.next();
        switch (esc) {
          case '"':
            value += '"';
            break;
          case "\\":
            value += "\\";
            break;
          case "/":
            value += "/";
            break;
          case "b":
            value += "\b";
            break;
          case "f":
            value += "\f";
            break;
          case "n":
            value += "\n";
            break;
          case "r":
            value += "\r";
            break;
          case "t":
            value += "\t";
            break;
          case "u": {
            let hex = "";
            for (let i = 0; i < 4; i++) {
              if (!/[0-9a-fA-F]/.test(this.reader.peek())) {
                return this.makeToken(
                  TokenType.Illegal,
                  hex,
                  pos,
                  "Invalid unicode escape"
                );
              }
              hex += this.reader.next();
            }
            value += String.fromCharCode(parseInt(hex, 16));
            break;
          }
          default:
            return this.makeToken(
              TokenType.Illegal,
              esc,
              pos,
              "Invalid escape sequence"
            );
        }
      } else if (ch < " ") {
        return this.makeToken(
          TokenType.Illegal,
          ch,
          pos,
          "Control character in string"
        );
      } else {
        value += ch;
      }
    }
  }
  private readNumber(pos: {
    offset: number;
    line: number;
    column: number;
  }): Token {
    let text = "";

    const readDigits = () => {
      while (isDigit(this.reader.peek())) {
        text += this.reader.next();
      }
    };

    // optional minus
    if (this.reader.peek() === "-") {
      text += this.reader.next();
    }

    // integer part
    if (this.reader.peek() === "0") {
      text += this.reader.next();
      if (isDigit(this.reader.peek())) {
        return this.makeToken(
          TokenType.Illegal,
          text,
          pos,
          "Leading zeros are not allowed"
        );
      }
    } else if (isDigit(this.reader.peek())) {
      readDigits();
    } else {
      return this.makeToken(
        TokenType.Illegal,
        text,
        pos,
        "Expected digit after '-'"
      );
    }

    // fraction
    if (this.reader.peek() === ".") {
      text += this.reader.next();
      if (!isDigit(this.reader.peek())) {
        return this.makeToken(
          TokenType.Illegal,
          text,
          pos,
          "Expected digit after decimal point"
        );
      }
      readDigits();
    }

    // exponent
    if (this.reader.peek() === "e" || this.reader.peek() === "E") {
      text += this.reader.next();
      if (this.reader.peek() === "+" || this.reader.peek() === "-") {
        text += this.reader.next();
      }
      if (!isDigit(this.reader.peek())) {
        return this.makeToken(
          TokenType.Illegal,
          text,
          pos,
          "Expected digit in exponent"
        );
      }
      readDigits();
    }

    return this.makeToken(TokenType.Number, text, pos);
  }
  private readKeyword(pos: {
    offset: number;
    line: number;
    column: number;
  }): Token {
    let word = "";

    while (isLetter(this.reader.peek())) {
      word += this.reader.next();
    }

    const type = Object.hasOwn(KEYWORDS, word) ? KEYWORDS[word] : undefined;

    if (type !== undefined) {
      return this.makeToken(type, word, pos);
    }

    return this.makeToken(
      TokenType.Illegal,
      word,
      pos,
      `Unexpected word '${word}'`
    );
  }
}