<template>
  <div
    v-if="newTags?.length > 0"
    class="flex cursor-pointer"
    @mouseover.stop="onEnter"
    @mouseleave.stop="onLeave">
    <template v-for="(i, index) in newTags" :key="index">
      <img
        v-if="i.type?.includes('TOP') && i.type?.slice(3) <25 || Number(i.type)"
        style="pointer-events: none;"
        :class="getTagClass(index) + ' signal-tag-hover'" :src="formatNewTags(i.icon)" alt=""
        height="15">
    </template>
  </div>
</template>
<script setup lang="ts">
import TagsContent from './tagsContent.vue'
import {formatNewTags} from '~/utils'

const {$tooltip} = useNuxtApp()
const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  tagClass: {
    type: String,
    default: 'ml-3px'
  },
  walletAddress: {
    type: String,
    default: ''
  },
  chain: {
    type: String,
    default: ''
  }
})
const {getPublicPortrait} = usePublicPortraitStore()
const newTags = computed(() => {
  if (!props.walletAddress || !props.chain) return props.tags
  const wsTags = getPublicPortrait(props.walletAddress, props.chain)?.new_tags || []
  const tags = wsTags?.length > 0 ? wsTags : props.tags
  return tags || []
})

// 过滤出实际显示的标签
const visibleTags = computed(() => {
  return newTags.value.filter(i => i.type?.includes('TOP') && i.type?.slice(3) < 25 || Number(i.type))
})

// 根据索引决定是否添加右边距，最后一个图标不添加右边距
function getTagClass(index: number) {
  // 找到当前标签在可见标签中的索引
  let visibleIndex = -1
  let visibleCount = 0

  for (let i = 0; i <= index; i++) {
    const tag = newTags.value[i]
    if (tag && (tag.type?.includes('TOP') && tag.type?.slice(3) < 25 || Number(tag.type))) {
      if (i === index) {
        visibleIndex = visibleCount
      }
      visibleCount++
    }
  }

  // 如果是最后一个可见的标签，不添加右边距
  const isLast = visibleIndex === visibleTags.value.length - 1
  return isLast ? '' : props.tagClass
}

function onEnter(e: { target: any }) {
  if (!newTags.value.some((i: { type: any }) => Number(i.type))) {
    return
  }
  $tooltip.show({
    content: {
      is: TagsContent,
      props: {
        tags: newTags.value
      }
    },
    target: e.target,
    props: {
      placement: 'top',
      'popper-class': 'signal-tags-tooltip'
    }
  })
}

function onLeave() {
  $tooltip.hide()
}
</script>
