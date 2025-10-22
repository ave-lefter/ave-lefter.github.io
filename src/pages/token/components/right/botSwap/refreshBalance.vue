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
  },
  isBatch: {
    type: Boolean,
    default: false
  }
})

// const botStore = useBotStore()
// const tokenStore = useTokenStore()

const { loading, refreshTokenBalance } = useBotSwap(props.type, props.isBatch)

// function _refreshTokenBalance() {
//   if (props.isBatch) {
//     botStore.getUserAllChainBalance()
//   } else {
//     let walletAddress = botStore.userInfo?.addresses?.find((i) => i?.chain === chain)?.address
//     let payToken = tokenStore.swap.payToken
//     refreshTokenBalance(props.isPayToken)
//   }
// }




</script>
