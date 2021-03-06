/**
 * 提供一组处理数据的工具方法
 * @author steven 2018.12.7
 */

/**
 * 将数字 0 以及字符串 '0' 作为空串，其他保留原值
 * @param val 值
 */
export function zeroAsEmpty(val: any) {
  return val !== 0 && val !== '0' ? val : ''
}

/**
 * 批量将 data 的 fields 字段，进行 zeroAsEmpty 操作
 * @param data 数据对象
 * @param fields 以 , 号分割的字段名
 */
export function batchZeroAsEmpty(data: any, fields: string) {
  const list = fields.split(',')
  list.forEach(name => data[name] = zeroAsEmpty(data[name]))
  return data
}

/**
 * 删除 list 中的每一项的 fields 字段
 * @param list 列表
 * @param fields 以 , 号分割的字段名
 */
export function delFields(list: any[], fields: string) {
  const fieldList = fields.split(',')
  list.forEach(it => {
    fieldList.forEach(field => delete it[field])
  })
}

/**
 * 将对象列表转换成标准化的 { id, name } 对象列表
 * @param list 列表
 * @param idKey id key
 * @param nameKey name key
 */
export function normalizeList(list: any[], idKey: string, nameKey: string) {
  return (list || []).reduce((result, it, index) => {
    if (VAR.env === 'dev' && index === 0) {
      idKey !== 'id' && 'id' in it && console.warn('源列表含有 id 值') // tslint:disable-line
      nameKey !== 'name' && 'name' in it && console.warn('源列表含有 name 值') // tslint:disable-line
    }
    result.push({
      ...it,
      id: it[idKey],
      name: it[nameKey]
    })
    return result
  }, [])
}

/**
 * 格式化数字（每三位加逗号
 * @param nums 数字
 */
export function toThousands(nums: any) {
  let num = (nums || 0).toString()
  let result = ''
  while (num.length > 3) {
      result = ',' + num.slice(-3) + result
      num = num.slice(0, num.length - 3)
  }
  if (num) { result = num + result }
  return result
}

interface KeyTextControlStatus {
  key: string | number
  text: string
  controlStatus: number
}

/**
 * 根据 controlStatus 的值，过滤列表（只保留 controlStatus 为 1 的项）
 * @param list 要过来的列表
 */
export function filterByControlStatus(list: KeyTextControlStatus[]) {
  return (list || []).filter(it => !('controlStatus' in it) || it.controlStatus == 1)
}

interface KeyTextControlStatusMap {
  [key: string]: KeyTextControlStatus[]
}

/**
 * 批量根据 controlStatus 的值，过滤列表（只保留 controlStatus 为 1 的项）
 * @param listMap list 集合，对象形式
 */
export function filterListByControlStatus(listMap: KeyTextControlStatusMap) {
  return Object.entries(listMap).reduce((map, [key, list]) => {
    map[key] = filterByControlStatus(list)
    return map
  }, {} as KeyTextControlStatusMap)
}

interface InListDefValMap {
  [key: string]: string | number
}

/**
 * 根据 listMap 中的对象值，过滤对象 item 中的值
 * @param item 对象
 * @param listMap list 集合
 * @param defValMap 默认值集合
 */
export function filterItemInList(
  item: any,
  listMap: KeyTextControlStatusMap,
  defValMap: InListDefValMap) {
  const newItem = { ...item }
  Object.entries(listMap).forEach(([key, list]) => {
    if (key in newItem) {
      const val = newItem[key]
      const found = list.find(t => val == t.key)
      const defVal = defValMap[key]
      // 若 val 在 list 中能找到，则 val 是合法的值，否则使用 defVal
      newItem[key] = found != null && found.controlStatus == 1 ? val : defVal
    }
  })
  return newItem
}
