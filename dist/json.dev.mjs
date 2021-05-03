// tokenize.src.ts
var tokenize = (src) => {
  let pos = 0;
  const tokens2 = [];
  while (pos < src.length) {
    const token = src[pos];
    if ([" ", "	", "\n"].includes(token)) {
      pos++;
      continue;
    }
    if (token === "n" && src.slice(pos, pos + 4) === "null") {
      tokens2.push({
        token: "null",
        type: "null"
      });
      pos += 4;
      continue;
    }
    if (token === "{") {
      tokens2.push({
        token,
        type: "leftBrace"
      });
      pos++;
      continue;
    }
    if (token === "}") {
      tokens2.push({
        token,
        type: "rightBrace"
      });
      pos++;
      continue;
    }
    if (token === ",") {
      tokens2.push({
        token,
        type: "comma"
      });
      pos++;
      continue;
    }
    if (token === ":") {
      tokens2.push({
        token,
        type: "colon"
      });
      pos++;
      continue;
    }
    if (token === "[") {
      tokens2.push({
        token,
        type: "leftBracket"
      });
      pos++;
      continue;
    }
    if (token === "]") {
      tokens2.push({
        token,
        type: "rightBracket"
      });
      pos++;
      continue;
    }
    if (token === '"') {
      const onset = pos;
      let offset = pos;
      do {
        offset++;
      } while (src[offset] !== '"' && src[offset - 1] !== "\\");
      tokens2.push({
        token: src.slice(onset, offset + 1),
        type: "string"
      });
      pos = offset + 1;
      continue;
    }
    if ("0123456789".includes(token)) {
      const onset = pos;
      let offset = pos;
      while ("0123456789.".includes(src[offset])) {
        offset++;
      }
      const token2 = src.slice(onset, offset);
      tokens2.push({token: token2, type: "number"});
      if (!token2.match(/^\d+(.\d+)?$/)) {
        throw new SyntaxError(`Invalid number: ${token2}`);
      }
      pos = offset;
      continue;
    }
  }
  return tokens2;
};

// tokenize.ts
var tokens = tokenize(`[
	11,
	"2",
	{"three": null},
]`);
console.assert(tokens[0].type === "leftBracket", "Should spot opening array bracket.");
console.assert(tokens[1].type === "number", "Should spot the first array element (11).");
console.assert(tokens[1].token === "11", "Should have the number 11 as a string in .value.");
console.assert(tokens[2].type === "comma", "Should register the comma delimeter.");
console.assert(tokens[3].type === "string", 'Should spot the string: "2".');
console.assert(tokens[3].token === '"2"', "Should have the string value in including the quotes.");
console.assert(tokens[5].type === "leftBrace", "Should spot the opening brace for the embedded object.");
console.assert(tokens[7].type === "colon", "Should spot the property assignment colon.");
console.assert(tokens[8].type === "null", "Should spot the null value at array[2].three.");
console.assert(tokens[9].type === "rightBrace", "Should spot the closing brace.");
console.assert(tokens[11].type === "rightBracket", "Should spot the closing bracket.");

// types/AstNode.ts
var AstNode = class {
  constructor(type, parent) {
    this.type = type;
    this.value = "";
    this.children = [];
    this.parent = parent ?? this;
    if (parent) {
      parent.children.push(this);
    }
  }
  static lookup(ast, path) {
    const segments = path.split(".");
    let host = ast;
    while (segments.length) {
      const propNodes = [];
      host.children.forEach((astNode) => {
        if (astNode.type === "property") {
          propNodes.push(astNode);
        }
        if (astNode.type === "object") {
          propNodes.push(...astNode.children);
        }
      });
      const segment = segments.shift() ?? "";
      const foundNode = propNodes.find((astNode) => {
        return astNode.children[0].value === `"${segment}"`;
      });
      if (!foundNode) {
        throw new TypeError(`Path "${path}" lookup failed at: .${segment}`);
      }
      host = foundNode.children[1].children[0];
    }
    return host;
  }
  static _print(ast, depth) {
    const indent = "\n" + "".padStart(depth * 2, " ");
    return indent + "- " + ast.type + ": " + ast.value + ast.children.map((child) => AstNode._print(child, depth + 1)).join("");
  }
  static print(ast) {
    return AstNode._print(ast, 0);
  }
};

// constructs/string.ts
var parseString = (state) => {
  if (state.tokens[state.pos].type === "string") {
    const stringNode = new AstNode("string", state.host);
    stringNode.value = state.tokens[state.pos].token;
    state.pos++;
  }
};

// constructs/number.ts
var parseNumber = (state) => {
  if (state.tokens[state.pos].type === "number") {
    const numNode = new AstNode("number", state.host);
    numNode.value = state.tokens[state.pos].token;
    state.pos++;
  }
};

// constructs/null.ts
var parseNull = (state) => {
  if (state.tokens[state.pos].token === "null") {
    const stringNode = new AstNode("null", state.host);
    stringNode.value = "null";
    state.pos++;
  }
};

// constructs/array.ts
var parseElement = (state) => {
  if (state.tokens[state.pos].type !== "rightBracket") {
    const nextTokenType = state.tokens[state.pos].type;
    if (nextTokenType === "leftBrace") {
      parseObject(state);
    } else if (nextTokenType === "leftBracket") {
      parseArray(state);
    } else if (nextTokenType === "string") {
      parseString(state);
    } else if (nextTokenType === "number") {
      parseNumber(state);
    } else if (nextTokenType === "null") {
      parseNull(state);
    }
    if (state.tokens[state.pos].type === "comma") {
      state.pos++;
      parseElement(state);
    }
  }
};
var parseArray = (state) => {
  if (state.tokens[state.pos].type === "leftBracket") {
    const arrayNode = new AstNode("array", state.host);
    state.host = arrayNode;
    state.pos++;
    while (state.tokens[state.pos].type !== "rightBracket") {
      parseElement(state);
    }
    state.host = arrayNode.parent;
    state.pos++;
  }
};

// constructs/object.ts
var parseProperty = (state) => {
  if (state.tokens[state.pos].type === "string") {
    const propNode = new AstNode("property", state.host);
    const propNameNode = new AstNode("propertyName", propNode);
    const propValueNode = new AstNode("propertyValue", propNode);
    propNameNode.value = state.tokens[state.pos].token;
    state.pos++;
    state.pos++;
    state.host = propValueNode;
    const nextTokenType = state.tokens[state.pos].type;
    if (nextTokenType === "leftBrace") {
      parseObject(state);
    } else if (nextTokenType === "leftBracket") {
      parseArray(state);
    } else if (nextTokenType === "string") {
      parseString(state);
    } else if (nextTokenType === "number") {
      parseNumber(state);
    } else if (nextTokenType === "null") {
      parseNull(state);
    }
    state.host = propNode.parent;
    if (state.tokens[state.pos].type === "comma") {
      state.pos++;
      parseProperty(state);
    }
  }
};
var parseObject = (state) => {
  if (state.tokens[state.pos].type === "leftBrace") {
    const objNode = new AstNode("object", state.host);
    state.host = objNode;
    state.pos++;
    while (state.tokens[state.pos].type !== "rightBrace") {
      parseProperty(state);
    }
    state.host = objNode.parent;
    state.pos++;
  }
};

// main.src.ts
var parseTokens = (tokens2) => {
  const root = new AstNode("root");
  const state = {
    tokens: tokens2,
    pos: 0,
    ast: root,
    host: root
  };
  while (state.pos < tokens2.length) {
    const start = state.pos;
    parseNumber(state);
    if (state.pos > start) {
      break;
    }
    parseString(state);
    if (state.pos > start) {
      break;
    }
    parseNull(state);
    if (state.pos > start) {
      break;
    }
    parseArray(state);
    if (state.pos > start) {
      break;
    }
    parseObject(state);
    if (state.pos > start) {
      break;
    }
  }
  return state.ast;
};
var parse = (src) => {
  const tokens2 = tokenize(" " + src + " ");
  const tree = parseTokens(tokens2);
  return tree;
};
export {
  parse
};
//# sourceMappingURL=json.dev.mjs.map
