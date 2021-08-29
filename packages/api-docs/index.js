/**
 * 递归过滤数据
 * @param {array} list 数据源列表
 * @param {array} fnList 过滤函数列表
 */
export function deepFilter(list, fnList = []) {
  if (!fnList?.length) {
    return list;
  }
  let fn = fnList.shift();
  if (typeof fn !== 'function') {
    fn = v => v;
  }
  const data = fn(list);
  const ret = Array.isArray(data) ? data : [];

  return deepFilter(ret, fnList);
}

/**
 * 类测试
 */
export class Guang {
  name;
  constructor(name) {
    this.name = name;
  }

  sayHi () {
    return `hi, I'm ${this.name}`;
  }
}