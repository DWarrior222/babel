## deepFilter(function)
递归过滤数据

### 调用方式
deepFilter(list: Array<ListItem>, fnList: FilterFn[], test: string, arr: string[]): ListItem[]  

### Parameters
- list(Array<ListItem>) 注释1
- fnList(FilterFn[]) 注释2
- test(string) 注释3
- arr(string[]) 

### 接口定义
```js
// ListItem 
interface ListItem {
  [propName: string]: any;
}

// FilterFn 
interface FilterFn {
  (list: ListItem[]): ListItem[];
}
```