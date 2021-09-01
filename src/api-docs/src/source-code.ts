
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
