import { JsonNode, ObjectMember, Position } from "./ast";
import { ParseError } from "./errors";
import { Lexer } from "./lexer";
import { Token, TokenType } from "./token";

export class Parser {
  private lexer: Lexer;
  private current: Token;

  constructor(input: string) {
    this.lexer = new Lexer(input);
    this.current = this.lexer.nextToken();
  }

  parse(): JsonNode {
    const value = this.parseValue();
    if (this.current.type !== TokenType.EOF) {
      this.fail("Unexpected content after the JSON value");
    }
    return value;
  }

  private advance(): Token {
    const previous = this.current;
    this.current = this.lexer.nextToken();
    return previous;
  }

  private expect(type: TokenType, what: string): Token {
    if (this.current.type !== type) {
      this.fail(`Expected ${what}, got ${this.describeCurrent()}`);
    }
    return this.advance();
  }

  private describeCurrent(): string {
    if (this.current.type === TokenType.EOF) return "end of input";
    return `'${this.current.literal}'`;
  }

  private currentIs(type: TokenType): boolean {
    return this.current.type === type;
  }

  private fail(message: string): never {
    throw new ParseError(
      message,
      this.current.line,
      this.current.column,
      this.current.offset
    );
  }

  private posOf(token: Token): Position {
    return { offset: token.offset, line: token.line, column: token.column };
  }

  private parseValue(): JsonNode {
    const token = this.current;

    switch (token.type) {
      case TokenType.String:
        this.advance();
        return { type: "string", value: token.literal, pos: this.posOf(token) };

      case TokenType.Number:
        this.advance();
        return { type: "number", value: token.literal, pos: this.posOf(token) };

      case TokenType.True:
        this.advance();
        return { type: "boolean", value: true, pos: this.posOf(token) };

      case TokenType.False:
        this.advance();
        return { type: "boolean", value: false, pos: this.posOf(token) };

      case TokenType.Null:
        this.advance();
        return { type: "null", pos: this.posOf(token) };

      case TokenType.LeftBracket:
        return this.parseArray();

      case TokenType.LeftBrace:
        return this.parseObject();

      case TokenType.Illegal:
        this.fail(token.message ?? `Unexpected '${token.literal}'`);

      default:
        this.fail(`Expected a value, got ${this.describeCurrent()}`);
    }
  }

  private parseArray(): JsonNode {
    const opening = this.expect(TokenType.LeftBracket, "'['");
    const elements: JsonNode[] = [];

    if (this.currentIs(TokenType.RightBracket)) {
      this.advance();
      return { type: "array", elements, pos: this.posOf(opening) };
    }

    while (true) {
      elements.push(this.parseValue());

      if (this.currentIs(TokenType.RightBracket)) {
        this.advance();
        return { type: "array", elements, pos: this.posOf(opening) };
      }

      this.expect(TokenType.Comma, "','");
      if (this.currentIs(TokenType.RightBracket)) {
        this.fail("Trailing commas are not allowed in arrays");
      }
    }
  }

  private parseObject(): JsonNode {
    const opening = this.expect(TokenType.LeftBrace, "'{'");
    const members: ObjectMember[] = [];

    if (this.currentIs(TokenType.RightBrace)) {
      this.advance();
      return { type: "object", members, pos: this.posOf(opening) };
    }

    while (true) {
      const key = this.expect(TokenType.String, "an object key");
      this.expect(TokenType.Colon, "':'");
      members.push({
        key: { type: "string", value: key.literal, pos: this.posOf(key) },
        value: this.parseValue(),
      });

      if (this.currentIs(TokenType.RightBrace)) {
        this.advance();
        return { type: "object", members, pos: this.posOf(opening) };
      }

      this.expect(TokenType.Comma, "','");
      if (this.currentIs(TokenType.RightBrace)) {
        this.fail("Trailing commas are not allowed in objects");
      }
    }
  }
}