import {getAllTags, type IGetAllTagsResponse} from '~/api/token'

export const useTagStore = defineStore('tagStore', () => {
  const tagArr = shallowRef<IGetAllTagsResponse[]>([])
  const tagMap = shallowRef<{ [key: string]: IGetAllTagsResponse }>({})

  async function getTagArr() {
    try {
      const res = await getAllTags()
      tagArr.value = res || []
      tagArr.value.forEach(el => {
        tagMap.value[el.type] = el
      })
    } catch (error) {
      console.log('=>(tag.ts:15) error', error)
    }
  }

  function matchTag(type: string) {
    return tagMap.value[type]
  }

  return {
    tagArr,
    getTagArr,
    matchTag
  }
})

