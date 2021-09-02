const doctrine = require('doctrine');
const { declare } = require('@babel/helper-plugin-utils');
const fse = require('fs-extra');
const path = require('path');
const renderer = require('./renderer');
const generater = require('@babel/generator').default;
const readline = require('readline');

module.exports = declare((api, options, dirname) => {
  api.assertVersion(7);
  const defaultDocsName = options.filename || 'function-docs';
  const ext = options.ext || '.md'
  const outputDir = options.outputDir || path.resolve(process.cwd()) + '/docs';
  try {
    options.clean && fse.removeSync(outputDir);
    !options.clean && fse.removeSync(path.join(outputDir, defaultDocsName + ext))
  } catch (error) {
  }
  return {
    pre(file) {
      const filename = file.opts.filename;
      file.set('docs', []);
      file.set('common', {});
      file.set('docs-name', defaultDocsName)
      if (!filename) {
        return;
      }
      if (filename && !isInclude(filename, options.include)) return;
      const docsName = /[^\/]+\.js$/.exec(filename)[0] || defaultDocsName;
      file.set('docs-name', docsName)
    },
    visitor: {
      TSInterfaceDeclaration(path, state) {
        const filename = state.file.opts.filename;
        if (filename && !isInclude(filename, options.include)) return;
        const common = state.file.get('common');
        const comment = {
          leadingComments: undefined,
          innerComments: undefined,
          trailingComments: undefined
        }
        const node = { ...path.node, ...comment };
        const code = generater(node).code;
        const name = path.get('id').toString();
        common[name] = {
          name,
          code 
        }
        state.file.set('common', common);
      },
      FunctionDeclaration(path, state) {
        const filename = state.file.opts.filename;
        if (filename && !isInclude(filename, options.include)) return;
        // console.log(`resolve: ${filename}`);
        filename && updateLine(`resolve: ${filename}`)
        const isExportNamedDeclaration = path.parent.type === 'ExportNamedDeclaration'
        const leadingComments = isExportNamedDeclaration ? path.parent.leadingComments : path.node.leadingComments;
        const isTS = path.get('params').some(p => p.getTypeAnnotation().type === 'TSTypeAnnotation');
        const name = path.get('id').toString();
        const { description = '', tags = [] } = parseComment(leadingComments && leadingComments[0].value) || {};
        const docs = state.file.get('docs');

        if (isTS) {
          const interfaceSet = new Set([]);
          const nodeParams = path.get('params').map((paramPath, index) => {
            const name = paramPath.toString();
            // paramPath.getTypeAnnotation() === paramPath.container[index].typeAnnotation;
            const tsTypeAnnotation = paramPath.getTypeAnnotation().typeAnnotation;
            // getType(tsTypeAnnotation, interfaceSet.add)
            // unknown: Method Set.prototype.add called on incompatible receiver undefined
            let type = getType(tsTypeAnnotation, interfaceSet.add.bind(interfaceSet));
            return {
              name,
              type,
              tsTypeAnnotation: tsTypeAnnotation.type
            }
          })
          const mapFn = ({ type = {}, name, ...args }) => {
            const item = nodeParams.find(d => d.name === name) || {};
            return { ...item, name, ...args }
          };
          const params = tags.filter(d => d.title !== 'returns').map(mapFn);
          const returnType = getType(path.get('returnType').getTypeAnnotation(), interfaceSet.add.bind(interfaceSet));
          const returns = tags.filter(d => d.title === 'returns').map(mapFn)[0] || {};
          docs.push({
            type: 'function',
            name,
            description,
            params,
            returns: { type: returnType, ...returns },
            interface: [...interfaceSet]
          });
          state.file.set('docs', docs);
          
          return;
        }

        const mapFn = ({ type = {}, ...args }) => ({ type: type.name, ...args });
        const params = tags.filter(d => d.title !== 'returns').map(mapFn);
        const returns = tags.filter(d => d.title === 'returns').map(mapFn)[0] || {};
        docs.push({
          type: 'function',
          name,
          description,
          params,
          returns
        });
        state.file.set('docs', docs);
      }
    },
    post(file) {
      const filename = file.opts.filename;
      if (filename && !isInclude(filename, options.include)) return;
      const common = file.get('common');
      const docs = file.get('docs');
      const docsName = file.get('docs-name');
      fse.ensureDirSync(outputDir);
      let content = '';
      try {
        content = fse.readFileSync(path.join(outputDir, docsName + ext))
      } catch (error) {
        content = ''
      }
      fse.writeFileSync(path.join(outputDir, docsName + ext), content + renderer(docs, common));
    }
  }
})

function isInclude(filename, include) {
  if (filename.includes('node_modules')) return false;
  if (typeof include === 'string') return filename.search(include) !== -1;
  if (Array.isArray(include)) return include.some(d => filename.search(d) !== -1);
  return false;
}

function parseComment(comment) {
  if (!comment) {
    return;
  }
  return doctrine.parse(comment, {
    unwrap: true
  });
}

function resolveName(tsTypeAnnotation, callback) {
  switch (tsTypeAnnotation.type) {
    case 'TSTypeReference':
      const name = tsTypeAnnotation.typeName.name;
      name && callback && callback(name);
      return name;
  
    default:
      return resolveType(tsTypeAnnotation.type);
  }
}

function resolveType(tsType) {
  switch (tsType) {
    case 'TSStringKeyword': 
      return 'string';
    case 'TSNumberKeyword':
      return 'number';
    case 'TSBooleanKeyword':
      return 'boolean';
  }
}

function getType(tsTypeAnnotation, callback) {
  switch (tsTypeAnnotation.type) {
    case 'TSTypeReference':
      const name = tsTypeAnnotation.typeParameters.params[0].typeName.name;
      name && callback && callback(name)
      return `${tsTypeAnnotation.typeName.name}<${name}>`;
    case 'TSArrayType':
      return `${resolveName(tsTypeAnnotation.elementType, callback)}[]`;
    default:
      return resolveType(tsTypeAnnotation.type);
  }
}

function updateLine(text) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(text, 'utf-8');
}