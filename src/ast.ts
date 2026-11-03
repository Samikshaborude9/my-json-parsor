export interface Position {
  offset: number;
  line: number;
  column: number;
}

export interface StringNode {
  type: "string";
  value: string;
  pos: Position;
}

export interface NumberNode {
  type: "number";
  value: string; // raw text, e.g. "-12.5e3"
  pos: Position;
}

export interface BooleanNode {
  type: "boolean";
  value: boolean;
  pos: Position;
}

export interface NullNode {
  type: "null";
  pos: Position;
}

export interface ArrayNode {
  type: "array";
  elements: JsonNode[];
  pos: Position;
}

export interface ObjectMember {
  key: StringNode;
  value: JsonNode;
}

export interface ObjectNode {
  type: "object";
  members: ObjectMember[];
  pos: Position;
}

export type JsonNode =
  | StringNode
  | NumberNode
  | BooleanNode
  | NullNode
  | ArrayNode
  | ObjectNode;