<script setup lang="ts">
defineProps<{
  activeCategory: string
}>()

function goBrowser(row) {
  window.open(formatSwapUrl(row.token, row.chain, row.amm))
}
</script>
<template>
  <el-table-column
    v-if="['hot', 'gainer', 'new'].includes?.(activeCategory)"
    label="DEX"
    prop="amm"
    align="center"
    width="70"
  >
    <template #default="{ row }">
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
  </el-table-column>
</template>
