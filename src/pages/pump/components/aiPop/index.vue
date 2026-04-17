<template>
  <div class="h-12px" @mouseenter.stop="onEnter1">
    <slot v-bind="contentProps">
    </slot>
  </div>
</template>

<script setup lang='ts'>
import { useXPopup } from './utils'

const props = defineProps({
  summary: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: undefined
  }
})

let curTokenId = ''

const { onEnter, contentProps } = useXPopup()

function onEnter1(e: { target: any }) {
  onEnter(e, {summary: props.summary, score:  props.score})
}

</script>

