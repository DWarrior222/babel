const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const fs = require('fs');
const path = require('path');
const plugin = require('../../../packages/babel-plugin-function-docs/index');

const sourceCode = fs.readFileSync(path.join(__dirname, './source-code.js'), {
  encoding: 'utf-8'
});

const ast = parser.parse(sourceCode, {
  sourceType: 'module',
  // plugins: ['typescript']
})

transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      plugin,
      {
        // outputDir: path.resolve(__dirname, './docs')
        include: 'utils.js',
        filename: 'index',
        ext: '.md'
      }
    ]
  ]
})