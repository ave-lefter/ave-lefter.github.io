<template>
  <div @mouseover.stop="onEnter1">
    <slot v-bind="contentProps">
      <a
        :href="contentProps.info?.detail_url"
        target="_blank"
        class="min-w-42px h-15px rd-4px bg-[--d-1A1A1A-l-F2F2F2] flex items-center justify-center text-10px bg-#55D592 bg-opacity-30 mr-4px"
        @click.stop
      >
        <img src="~/assets/images/pump.png" class="mr-4px pointer-events-none" width="10" height="10" alt="" srcset="">
        <span class="font-500 color-[--main-text] pointer-events-none">LIVE</span>
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
  }
})

let curTokenId = ''

const { onEnter, contentProps } = useXPopup()

function onEnter1(e: { target: any }) {
  if (curTokenId === props.tokenId) {
    onEnter(props.tokenId, e, false)
    return
  }
  onEnter(props.tokenId, e, true)
  curTokenId = props.tokenId
}

</script>

