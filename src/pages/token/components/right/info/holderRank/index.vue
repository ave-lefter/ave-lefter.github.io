<template>
  <div @mouseover.stop="onEnter1">
    <slot v-bind="contentProps" :type="type"/>
  </div>
</template>

<script setup lang='ts'>
import { useDevPop } from './utils'

const props = defineProps({
  tokenId: {
    type: String,
    default: ''
  },
  type: {
    type: Number,
    default: 0
  },
  ratio: {
    type: Number,
    default: 0
  },
})

let curTokenId = ''

const { onEnter, contentProps } = useDevPop()

function onEnter1(e: { target: any }) {
  if (curTokenId === props.tokenId + props.type) {
    onEnter(props.tokenId, e, {type: props.type, ratio: props.ratio}, false)
    return
  }
  onEnter(props.tokenId, e, {type: props.type, ratio: props.ratio}, true)
  curTokenId = props.tokenId + props.type
}

</script>

