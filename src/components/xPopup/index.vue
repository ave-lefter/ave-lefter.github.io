<template>
  <div @mouseover.stop="onEnter1">
    <slot v-bind="contentProps">
      <a
        :href="contentProps.info?.twitter_url"
        target="_blank"
        class="mr-4px w-12px h-12px rounded-2px bg-[--d-1A1A1A-l-F2F2F2] flex items-center justify-center"
      >
        <Icon name="custom:twitter" class="text-10px pointer-events-none" />
      </a>
    </slot>
  </div>
</template>

<script setup lang='ts'>
import { useXPopup } from './utils'

const props = defineProps({
  tokenId: {
    type: String,
    default: ''
  },
  type: {
    type: Number as PropType<0 | 1 | 2 | 3>,
    default: undefined
  }
})

let curTokenId = ''

const { onEnter, contentProps } = useXPopup()

function onEnter1(e: { target: any }) {
  if (curTokenId === props.tokenId) {
    onEnter(props.tokenId, e, props.type as 1 | 2 | 3, false)
    return
  }
  onEnter(props.tokenId, e, props.type as 1 | 2 | 3, true)
  curTokenId = props.tokenId
}

</script>

