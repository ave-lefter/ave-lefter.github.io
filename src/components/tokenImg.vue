<script setup lang="ts">
const props = defineProps({
  row: {
    type: Object as PropType<{
      chain: string;
      logo_url: string;
      symbol?: string;
    }>,
    default: () => ({
      chain: '',
      logo_url: '',
      symbol: ''
    })
  },
  tokenClass: {
    type: String,
    default: 'w-24px h-24px'
  },
  chainClass: {
    type: String,
    default: 'w-12px h-12px'
  },
  isCircle:{
    type:Boolean,
    default:true
  }
})
const {token_logo_url} = useConfigStore()
const shouldAddPrefix = computed(() => {
  if (props.row.logo_url) {
    return !props.row.logo_url.startsWith('http')
  }
  return false
})
const tokenLogoUrl = computed(() => {
  if (props.row.logo_url) {
    return shouldAddPrefix.value
      ? `${token_logo_url}${props.row.logo_url}`
      : props.row.logo_url
  }
  return getSymbolDefaultIcon(props.row,props.isCircle?'circle':'rect')
})
</script>

<template>
  <div class="relative text-0">
    <el-image
      :class="`mr-3px ${isCircle?'rounded-full':''}  block ${tokenClass}`"
      :src="tokenLogoUrl"
    >
      <template #error>
        <img class="w-full block" src="@/assets/images/icon-default.png" alt="">
      </template>
    </el-image>
    <img
      v-if="row.chain"
      :class="`rounded-full absolute right-0 bottom-0 block ${chainClass}`"
      :src="`${token_logo_url}chain/${row.chain}.png`"
      alt=""
    >
  </div>
</template>

<style scoped>

</style>
