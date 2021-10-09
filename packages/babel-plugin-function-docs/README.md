# 安装
```
npm i @luyuant/babel-plugin-function-docs -D  # yarn add @luyuant/babel-plugin-function-docs -D
```
# 配置
```js
// babel.config.js
const docsPlugin = require('@luyuant/babel-plugin-function-docs');

module.exports = {
  plugins: [
    [
      docsPlugin,
      {
        outputDir: path.resolve(__dirname, './docs')
        include: 'utils.js',
        filename: 'index',
        ext: '.md'
      }
    ]
  ]
};

```