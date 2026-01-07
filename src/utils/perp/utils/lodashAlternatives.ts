/**
 * 原生 JavaScript 实现 Lodash 常用方法
 *
 * 为了减少 bundle 大小和内存占用，使用原生 JavaScript 替代 lodash
 * 这些方法与 lodash 的对应方法行为保持一致
 */

/**
 * 检查值是否为 null 或 undefined (lodash.isNil 替代)
 * @param value - 要检查的值
 * @returns 如果是 null 或 undefined 返回 true
 */
export const isNil = (value: unknown): value is null | undefined => {
  return value == null;
};

/**
 * 从对象中选择指定的属性 (lodash.pick 替代)
 * @param obj - 源对象
 * @param keys - 要选择的属性键数组
 * @returns 包含指定属性的新对象
 */
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T | null | undefined,
  keys: K[]
): Pick<T, K> => {
  if (!obj) return {} as Pick<T, K>;

  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });

  return result;
};

/**
 * 获取对象的所有键 (lodash.keys 替代)
 * @param obj - 目标对象
 * @returns 键数组
 */
export const keys = <T extends Record<string, unknown>>(obj: T | null | undefined): string[] => {
  if (!obj) return [];
  return Object.keys(obj);
};

/**
 * 从数组中移除指定的元素 (lodash.without 替代)
 * @param array - 源数组
 * @param values - 要移除的值
 * @returns 移除指定值后的新数组
 */
export const without = <T>(array: T[], ...values: T[]): T[] => {
  return array.filter(item => !values.some(value => value === item));
};

/**
 * 遍历对象的值并应用映射函数 (lodash.mapValues 替代)
 * @param obj - 源对象
 * @param mapper - 映射函数，接收值和键，返回新值
 * @returns 映射后的新对象
 */
export const mapValues = <
  T extends Record<string, unknown>,
  R
>(
  obj: T | null | undefined,
  mapper: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> => {
  if (!obj) return {} as Record<keyof T, R>;

  const result = {} as Record<keyof T, R>;
  const objKeys = Object.keys(obj) as (keyof T)[];

  objKeys.forEach(key => {
    result[key] = mapper(obj[key], key);
  });

  return result;
};

/**
 * 创建一个 keyBy 映射 (lodash.keyBy 替代)
 * @param array - 源数组
 * @param keyGetter - 获取键的函数
 * @returns 键值对对象
 */
export const keyBy = <T, K extends string | number | symbol>(
  array: T[],
  keyGetter: (item: T) => K
): Record<K, T> => {
  const result = {} as Record<K, T>;

  array.forEach(item => {
    const key = keyGetter(item);
    result[key] = item;
  });

  return result;
};

/**
 * 链式操作的简化实现 (用于替代 lodash.chain)
 * 注意：这只是一个简化版本，只实现了项目中用到的功能
 */
export const chain = <T>(value: T) => ({
  keyBy: <K extends string | number | symbol>(keyGetter: (item: any) => K) => ({
    mapValues: <R>(mapper: (value: any, key: K) => R) => ({
      value: () => {
        // 这是一个简化的实现，专门用于当前的用例
        // chain([1,2,3]).keyBy(x => x).mapValues(x => x * 2)
        // 实际上等同于：{1: 2, 2: 4, 3: 6}
        if (Array.isArray(value)) {
          const keyed = keyBy(value, keyGetter);
          return mapValues(keyed, mapper as any);
        }
        return {};
      }
    })
  }),
  value: () => value
});

// 默认导出所有方法，便于按需导入
export default {
  isNil,
  pick,
  keys,
  without,
  mapValues,
  keyBy,
  chain
};