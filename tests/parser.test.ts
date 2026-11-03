import { describe, expect, it } from "vitest";
import { ParseError, parseJson } from "../src/index";

describe("parseJson", () => {
  it("parses every JSON value type and preserves source positions", () => {
    expect(parseJson('{"name":"Juno","items":[1,-2.5e3,true,false,null]}')).toEqual({
      type: "object",
      pos: { offset: 0, line: 1, column: 1 },
      members: [
        {
          key: {
            type: "string",
            value: "name",
            pos: { offset: 1, line: 1, column: 2 },
          },
          value: {
            type: "string",
            value: "Juno",
            pos: { offset: 8, line: 1, column: 9 },
          },
        },
        {
          key: {
            type: "string",
            value: "items",
            pos: { offset: 15, line: 1, column: 16 },
          },
          value: {
            type: "array",
            pos: { offset: 23, line: 1, column: 24 },
            elements: [
              {
                type: "number",
                value: "1",
                pos: { offset: 24, line: 1, column: 25 },
              },
              {
                type: "number",
                value: "-2.5e3",
                pos: { offset: 26, line: 1, column: 27 },
              },
              {
                type: "boolean",
                value: true,
                pos: { offset: 33, line: 1, column: 34 },
              },
              {
                type: "boolean",
                value: false,
                pos: { offset: 38, line: 1, column: 39 },
              },
              { type: "null", pos: { offset: 44, line: 1, column: 45 } },
            ],
          },
        },
      ],
    });
  });

  it("decodes JSON string escapes", () => {
    expect(parseJson('"quote: \\" newline: \\n unicode: \\u263A"')).toEqual({
      type: "string",
      value: 'quote: " newline: \n unicode: ☺',
      pos: { offset: 0, line: 1, column: 1 },
    });
  });

  it("rejects malformed structure and trailing commas", () => {
    for (const input of ["[1,]", '{"a":1,}', '{"a" 1}', "[1 2]"]) {
      expect(() => parseJson(input)).toThrow(ParseError);
    }
  });

  it("rejects malformed numbers and strings", () => {
    for (const input of ["01", "1.", "1e", '"unterminated', '"bad\\q"']) {
      expect(() => parseJson(input)).toThrow(ParseError);
    }
  });
});
