const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');

const sourceCode = `
let a = 1;
// 注释1
console.log(a);
// 注释2
[1, 2].map(d => d);
console.error('error');
`;
const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous'
})
const targetCalleeName = ['log', 'info', 'error', 'debug'].map(d => `console.${d}`);

traverse(ast, {
  CallExpression (path, state) {
    const calleeName = generate(path.node.callee).code;
    if (targetCalleeName.includes(calleeName)) {
      const { line, column } = path.node.loc.start;
      path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`))
      console.log(path.node.arguments, 'path.node.arguments');
    }
  },
  ArrayExpression(path, state) {
    // console.log(path.node, 'ArrayExpression');
  },
  VariableDeclaration(path, state) {
    // console.log(path.node, 'VariableDeclaration');
    if (path.node.kind === 'let') path.node.kind = 'var';
  }
});

const { code, map } = generate(ast);
console.log(code);