const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const fs = require('fs');
const path = require('path');
const insertBeforeConsole = require('./plugins/index');

const sourceCode = fs.readFileSync(path.join(__dirname, './source-code.js'), {
  encoding: 'utf-8'
});

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous'
})

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [insertBeforeConsole]
})

console.log(code);