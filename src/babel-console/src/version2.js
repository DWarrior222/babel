const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template');

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
    // 新节点不处理
    if (path.node.isNew) {
        return;
    }
    const calleeName = generate(path.node.callee).code;
    if (targetCalleeName.includes(calleeName)) {
      const { line, column } = path.node.loc.start;
      const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)();
      newNode.isNew = true;

      // JSX 中的 console 代码不能在前面插入一个节点，而要把整体替换成一个数组表达式
      // 所以要通过 path.findParent 判断当前节点是否在 JSXElement 之下
      // 如果是 JSX 语法，则用 replaceWith 替换，并跳过后续遍历
      // 如果是普通 JS 节点，则在节点前插入新的节点即可
      if (path.findParent(path => path.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]));
        path.skip();
      } else {
        path.insertBefore(newNode);
      }
    }
  }
});

const { code } = generate(ast);
console.log(code);