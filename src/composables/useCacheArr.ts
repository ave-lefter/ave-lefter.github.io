import { useStorage } from '@vueuse/core'

export function useCacheArr<T extends []>(cacheKey: string) {
    const cacheArr = useStorage(cacheKey, [] as T)

    function add<U extends never>(value:U) {
        if(cacheArr.value.length >=10){
            cacheArr.value.shift()
        }
        cacheArr.value.push(value)
    }
    return {
        cacheArr,
        add
    }
}