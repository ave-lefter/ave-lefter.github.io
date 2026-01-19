<template>
    <el-image
      class="token-icon max-w-228px max-h-228px w-228px flex items-center justify-center"
      style="display: flex"
      fit="cover"
      :src="getSymbolDefaultIcon(row)"
      preview-teleported
    >
      <template #error>
        <img
          class="token-icon h-228px w-228px text-16px color-#fff"
          :src="getChainDefaultIcon(row.chain, row.symbol)"
        >
      </template>
      <template #placeholder>
        <img
          class="token-icon h-228px w-228px text-16px color-#fff"
          :src="getChainDefaultIcon(row.chain, row.symbol)"
        >
      </template>
    </el-image>
</template>

<script setup lang='ts'>
  defineProps({
    row: {
      type: Object as PropType<{chain: string, symbol: string}>,
      default: () => {
        return {
          chain: '',
          symbol: ''
        }
      }
    }
  })
</script>

<style>

</style>
