<template>
  <div @mouseenter.stop="onEnter1">
    <slot v-bind="contentProps" />
  </div>
</template>

<script setup lang='ts'>
import { useDevPop } from './utils'

const props = defineProps({
  tokenId: {
    type: String,
    default: ''
  }
})

let curTokenId = ''

const { onEnter, contentProps } = useDevPop()

function onEnter1(e: { target: any }) {
  // if (curTokenId === props.tokenId) {
  //   onEnter(props.tokenId, e, false)
  //   return
  // }
  onEnter(props.tokenId, e, true)
  curTokenId = props.tokenId
}

</script>

