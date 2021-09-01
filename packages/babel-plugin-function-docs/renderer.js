module.exports = function (docs, common = {}) {
  // docs
  // `[
  //   {
  //     type: 'function',
  //     name: 'deepFilter',
  //     description: '递归过滤数据',
  //     params: [ [Object], [Object] ],
  //     returns: [ [Object] ]
  //   }
  // ]
  
  // params
  // {
  //   type: 'array',
  //   title: 'param',
  //   description: '过滤函数列表',
  //   name: 'fnList'
  // }
  // `
  
  return docs.reduce((pre, {
    type,
    name,
    description,
    params,
    returns,
    interface
  }) => {
    pre = `${pre}${getTitleAndDescr(name, description, type)}${getCallWay(name, params, returns)}${getParams(params)}${getInterface(interface, common)}`
    
    return pre;
  }, '');
}

function getTitleAndDescr(title, description, type) {
  return `## ${title}(${type})\n${description}\n\n`;
}

function getCallWay(name, params, returns) {
  const paramsStr = params.map(d => `${d.name}: ${d.type}`).join(', ');
  const content = `${name}(${paramsStr}): ${returns.type} `
  return `### 调用方式\n${content} \n\n`
}

function getParams(params) {
  if (!params.length) return '';
  const content = params.reduce((pre, {
    type,
    description,
    name
  }) => {
    pre = pre + `- ${name}(${type}) ${description || ''}\n`;
    return pre;
  }, '')
  return `### Parameters\n${content}\n`
}

function getInterface(interface = [], common = {}) {
  if (!interface.length) return '';
  const content = interface.map(d => `// ${common[d].name} \n${common[d].code}\n`).join('\n');
  
  return `### 接口定义\n\`\`\`js\n${content}\`\`\``
}