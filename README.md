
# My JSON Parser

A lightweight JSON parser written in TypeScript that converts JSON text into an Abstract Syntax Tree (AST).

## Features

- Parses JSON strings into AST
- Supports objects and arrays
- Supports strings, numbers and booleans
- Supports null values
- Handles string escape sequences
- Provides parsing errors with source positions
- Written in TypeScript

## Installation

```bash
npm install my-json-parser
```

## Usage

```typescript
import { parseJson } from "my-json-parser";

const input = '{"name":"Juno","age":25}';

const ast = parseJson(input);

console.log(ast);
```

## Using the Parser Class

```typescript
import { Parser } from "my-json-parser";

const parser = new Parser('{"hello":"world"}');

const ast = parser.parse();

console.log(ast);
```

## Error Handling

```typescript
import { parseJson, ParseError } from "my-json-parser";

try {
  const ast = parseJson('{"name":}');
  console.log(ast);
} catch (error) {
  if (error instanceof ParseError) {
    console.error(error.message);
  }
}
```

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
```

## License

MIT
