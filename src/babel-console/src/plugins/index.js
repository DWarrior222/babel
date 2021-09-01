
const targetCalleeName = ['log', 'info', 'error', 'debug'].map(d => `console.${d}`);

module.exports = function({ types, template }, options, dirname) {
  return {
    visitor: {
      CallExpression (path, state) {
        // 新节点不处理
        if (path.node.isNew) {
            return;
        }
        // const calleeName = generate(path.node.callee).code;
        const calleeName = path.get('callee').toString();
        if (targetCalleeName.includes(calleeName)) {
          const { line, column } = path.node.loc.start;
          const newNode = template.expression(`console.log("${dirname || 'unkown filename'}: (${line}, ${column})")`)();
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
    }
  }
}