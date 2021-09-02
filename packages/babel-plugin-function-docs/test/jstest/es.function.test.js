const pluginTester = require('babel-plugin-tester').default;
const plugin = require('../../index');
const path = require('path');

pluginTester({
  plugin: plugin,
  babelOptions: {
    parserOpts: {},
    generatorOpts: {lineTerminator: '\n'},
    babelrc: false,
    configFile: false,
  },
  snapshot: true,
  tests: {
    '声明式函数注释生成文档': {
      code: `
        /**
         * 递归过滤数据
         * @param {array} list 数据源列表
         * @param {array} fnList 过滤函数列表
         * @returns {array} 过滤后的列表
         */
        function deepFilter(list = [], fnList = []) {
          if (!fnList?.length) {
            return list;
          }
          let fn = fnList.shift();

          if (typeof fn !== "function") {
            fn = (v) => v;
          }

          const data = fn(list);
          const ret = Array.isArray(data) ? data : [];
          return deepFilter(ret, fnList);
        }
      `,
      pluginOptions: {
        outputDir: path.resolve(__dirname, './docs'),
        filename: 'function'
      }
    },
    'export声明式函数注释生成文档': {
      code: `
        /**
         * 递归过滤数据
         * @param {array} list 数据源列表
         * @param {array} fnList 过滤函数列表
         * @returns {array} 过滤后的列表
         */
        export function deepFilter(list = [], fnList = []) {
          if (!fnList?.length) {
            return list;
          }

          let fn = fnList.shift();

          if (typeof fn !== "function") {
            fn = (v) => v;
          }

          const data = fn(list);
          const ret = Array.isArray(data) ? data : [];
          return deepFilter(ret, fnList);
        }
      `,
      pluginOptions: {
        outputDir: path.resolve(__dirname, './docs'),
        filename: 'export-function'
      }
    }
  }
})