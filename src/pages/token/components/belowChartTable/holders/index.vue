<template>
  <New v-if="isNew" />
  <Old v-else />
</template>

<script setup>
import { SupportFullDataChain } from '@/utils/constants.ts'
import { getAddressAndChainFromId } from '@/utils/index.ts'
import New from './new'
import Old from './old'
import { useEventBus } from '@vueuse/core'

const avgPriceEvent = useEventBus('top100Price')
const route = useRoute()
const isNew = computed(() => {
  const { chain } = getAddressAndChainFromId(route.params?.id, 0)

  return SupportFullDataChain.includes(chain)
  // return ['solana', 'bsc','eth'].includes(chain)
})

onDeactivated(()=>{
  avgPriceEvent.emit(0,0)
})
</script>

<style lang="scss" scoped></style>
