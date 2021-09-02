const pluginTester = require('babel-plugin-tester').default;
const path = require('path');

// normally you would import this from your plugin module
function identifierReversePlugin() {
  return {
    name: 'identifier reverse',
    visitor: {
      Identifier(idPath) {
        idPath.node.name = idPath.node.name.split('').reverse().join('')
      },
    },
  }
}
pluginTester({
  plugin: identifierReversePlugin,
  babelOptions: {
    parserOpts: {},
    generatorOpts: {},
    babelrc: false,
    configFile: false,
  },
  tests: {
    'reverse': {
      fixture: path.join(__dirname, 'index.js'),
      outputFixture: path.join(__dirname, 'index-output.js')
    }
  }
})