export * from "./ast";
export * from "./errors";
export * from "./lexer";
export * from "./parser";
export * from "./reader";
export * from "./token";

import { JsonNode } from "./ast";
import { Parser } from "./parser";

export function parseJson(input: string): JsonNode {
  return new Parser(input).parse();
}
