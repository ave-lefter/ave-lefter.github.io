<template>
  <a
    v-if="['solana', 'bsc']?.includes(chain)"
    class="bubble"
    href=""
    @click.stop.prevent="show_bubble = !show_bubble"
  >
    <Icon name="custom:bubble" class="color-[--d-696E7C-l-fff] icon-bubble" />
  </a>
  <el-dialog
    v-model="show_bubble"
    width="860"
    height="600"
    class="search-dialog"
    header-class="p-0! pl-20px! p-0!"
    :title="$t('holderBubble')"
    @opened="openDialog"

  >
  <iframe
   class="mt-20px"
    style="
        width: 100%;
        height: 100%;
        border: none;
        height: 700px;
        min-height: 500px;
        max-height: 700px;
    "
    :src="`https://app.insightx.network/bubblemaps/${
        chain == 'bsc' ? 56 : chain
    }/${tokenAddress}`"
    allow="clipboard-write"
    />
  </el-dialog>
</template>

<script setup lang="ts">
const route = useRoute()
const { token } = storeToRefs(useTokenStore())
const show_bubble = shallowRef(false)
const addressAndChain = computed(() => {
  const id = route.params.id as string
  if (id) {
    return getAddressAndChainFromId(id)
  }
  return {
    address: token.value?.token || '',
    chain: token.value?.chain || '',
  }
})
const tokenAddress= computed(()=>{
  return addressAndChain.value?.address
})
const chain= computed(()=>{
  return addressAndChain.value?.chain
})
function openDialog() { }
</script>

<style lang="scss" scoped>
.bubble{
//    background: rgba($color: #3F80F7, $alpha: 0.1);
  display: flex;
  align-items: center;
  border: none;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  background: var(--d-2D3037-l-999);
  transition: all .2s;
}
</style>
