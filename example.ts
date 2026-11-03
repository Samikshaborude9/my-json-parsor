import { parseJson } from "./src/index";

const input = `
{
  "name": "Juno",
  "age": 25,
  "active": true,
  "tags": ["json", "parser"],
  "address": null
}
`;

const tree = parseJson(input);

console.log(JSON.stringify(tree, null, 2));