const pluginTester = require('babel-plugin-tester').default;
const plugin = require('../../index');
const path = require('path');

pluginTester({
  plugin: plugin,
  babelOptions: {
    parserOpts: {
      plugins: ['typescript']
    },
    generatorOpts: {},
    babelrc: false,
    configFile: false,
  },
  snapshot: true,
  tests: {
    '声明式函数': {
      code: `
      interface FilterFn {
        (list: ListItem[]): ListItem[];
      }
      
      interface ListItem {
        [propName: string]: any;
      }
      
      /**
       * 递归过滤数据
       * @param  {Array<ListItem>} list 注释1
       * @param  {FilterFn[]} fnList 注释2
       * @param  {string} test 注释3
       * @param  {string[]} arr
       * @returns 注释5
       */
      function deepFilter(list: Array<ListItem>, fnList: FilterFn[], test: string, arr: string[]): ListItem[] {
        if (!fnList.length) {
          return list;
        }
        let fn = fnList.shift();
        const data = fn(list);
        return deepFilter(data, fnList, '1', ['1']);
      }
      `,
      pluginOptions: {
        outputDir: path.resolve(__dirname, './docs'),
        filename: 'function'
      }
    },
    'export声明式函数': {
      code: `
        interface FilterFn {
          (list: ListItem[]): ListItem[];
        }
        
        interface ListItem {
          [propName: string]: any;
        }
        
        /**
         * 递归过滤数据
         * @param  {Array<ListItem>} list 注释1
         * @param  {FilterFn[]} fnList 注释2
         * @param  {string} test 注释3
         * @param  {string[]} arr
         * @returns 注释5
         */
        export function deepFilter(list: Array<ListItem>, fnList: FilterFn[], test: string, arr: string[]): ListItem[] {
          if (!fnList.length) {
            return list;
          }
          let fn = fnList.shift();
          const data = fn(list);
          return deepFilter(data, fnList, '1', ['1']);
        }
      `,
      pluginOptions: {
        outputDir: path.resolve(__dirname, './docs'),
        filename: 'export-function'
      }
    },
    '简单函数': {
      code: `
        /**
         * 递归过滤数据
         * @param  {string} a 注释1
         * @param  {string} b 注释2
         * @returns {string} 注释3
         */
        export function deepFilter(a: string, b: string): string {
          return a + b;
        }
      `,
      pluginOptions: {
        outputDir: path.resolve(__dirname, './docs'),
        filename: 'simple-function'
      }
    },
    'nocode': {
      fixture: path.join(__dirname, 'source-code.ts'),
      outputFixture: path.join(__dirname, 'source-code-output.ts')
    }
  }
})