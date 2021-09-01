// import pluginTester from 'babel-plugin-tester';
const pluginTester = require('babel-plugin-tester').default;
const consolePlugin = require('../index');

pluginTester({
  plugin: consolePlugin,
  babelOptions: {
    parserOpts: {
      sourceType: 'unambiguous'
    }
  },
  tests: {
    'console.xx前插入了CallExpression的AST': {
      code: `
        let a = 1;
        console.log(a);
        [1, 2].map(d => d);
        console.error('error');

        {
          const cc = 3;
          console.log(cc, 'cc');
        }
      `,
      snapshot: true,
    }
  }
})