export function replaceNegOne(arr:any,key:string='value') {
  const length = arr.length

  for (let i = 0; i < length; i++) {
    if (arr[i][key] === -1) {
      // 尝试向前查找最近的非 -1 值
      let j = i - 1
      while (j >= 0 && arr[j][key] === -1) {
        j-- // 向前查找
      }
      // 如果找到有效值，替换
      if (j >= 0) {
        arr[i][key] = arr[j][key]
      } else {
        // 如果前面都没有有效值，继续向后查找
        let k = i + 1
        while (k < length && arr[k][key] === -1) {
          k++ // 向后查找
        }
        // 如果找到有效值，替换
        if (k < length) {
          arr[i][key] = arr[k][key]
        }
      }
    }
  }
  return arr
}
