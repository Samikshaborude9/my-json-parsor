import { JsonNode, ObjectNode } from "./ast";

const p = { offset: 0, line: 1, column: 1 }; // reuse one position for simplicity

const tree: ObjectNode = {
  type: "object",
  pos: p,
  members: [
    {
      key: { type: "string", value: "name", pos: p },
      value: { type: "string", value: "juno", pos: p },
    },
    {
      key: { type: "string", value: "tags", pos: p },
      value: {
        type: "array",
        pos: p,
        elements: [
          { type: "number", value: "1", pos: p },
          { type: "boolean", value: true, pos: p },
        ],
      },
    },
  ],
};

console.log(JSON.stringify(tree, null, 2));

function describe(node: JsonNode): string {
  switch (node.type) {
    case "string":
      return `string "${node.value}"`;
    case "number":
      return `number ${node.value}`;
    case "boolean":
      return `boolean ${node.value}`;
    case "null":
      return "null";
    case "array":
      return `array of ${node.elements.length}`;
    case "object":
      return `object with ${node.members.length} keys`;
  }
}

console.log(describe(tree));
console.log(describe(tree.members[0]!.value));
console.log(describe(tree.members[1]!.value));