<script setup lang="ts">
defineProps<{
  row: any
}>()

function goBrowser(row) {
  window.open(formatSwapUrl(row.token, row.chain, row.amm))
}
</script>
<template>
  <div>
    <img
      v-if="row.amm === 'unknown'"
      v-tooltip="getSwapInfo(row.chain, row.amm)?.show_name"
      class="w-16px h-16px cursor-pointer rounded-full"
      src="@/assets/images/icon-unknown.png"
      alt=""
    >
    <img
      v-else
      v-tooltip="getSwapInfo(row.chain, row.amm)?.show_name"
      class="w-16px h-16px cursor-pointer rounded-full"
      :src="formatIconSwap(row.amm)"
      alt=""
      @click.stop.self="goBrowser(row)"
    >
  </div>
</template>
