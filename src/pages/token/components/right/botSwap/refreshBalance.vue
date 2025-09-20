<template>
  <VLoading v-if="loading" class="ml-5px text-14px" />
  <Icon
    v-else
    name="custom:refresh-left"
    class="ml-5px clickable text-14px"
    @click.stop="refreshTokenBalance(props.isPayToken)"
  />
</template>

<script lang="ts" setup>
import { useBotSwap } from '~/composables/botSwap'

const props = defineProps({
  type: {
    type: Number,
    default: 0
  },
  isPayToken: {
    type: Boolean,
    default: false
  }
})

const { loading, refreshTokenBalance } = useBotSwap(props.type)


</script>
