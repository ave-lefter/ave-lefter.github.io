<template>
  <div class="rounded-4px">
    <div class="p-12px">
      已迁移
    </div>
    <el-image class="token-icon max-w-228px max-h-228px w-200px flex items-center justify-center" style="display: flex"
      fit="cover" :src="getSymbolDefaultIcon(row)" preview-teleported>
      <template #error>
        <img class="token-icon h-228px w-228px text-16px color-#fff" :src="getChainDefaultIcon(row.chain, row.symbol)">
      </template>
      <template #placeholder>
        <img class="token-icon h-228px w-228px text-16px color-#fff" :src="getChainDefaultIcon(row.chain, row.symbol)">
      </template>
    </el-image>
    <div class="p-12px">
      <div class="text-12px lh-12px color-[--secondary-text] mb-12px">{{ t('similarTokens') }}</div>
      <div class="flex flex-col gap-8px">
        <div v-for="token in tokens" :key="token.id" class="flex items-center gap-8px">
          <TokenImg :row="token" />
          <div class="flex-1">
            <div class="lh-16px color-[--main-text]">{{ token.symbol }}</div>
            <div v-tooltip="formatDate(token.last_trade_at, 'YYYY-MM-DD HH:mm:ss')"><span class="text-12px color-[--secondary-text] text-10px lh-12px">{{ t('lastTx') }}:{{ formatTimeFromNow(token.last_trade_at) }}</span>
            </div>
          </div>
          <div>
              <div class="lh-16px">
                <span>MC </span>
                <span>${{ formatNumber(token.market_cap, 1) }}</span>
              </div>
              <div class="lh-12px text-right">1h30min</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { getSimilarTokens } from '~/api/token'
const { t } = useI18n()
const configStore = useConfigStore()

const props = defineProps({
  row: {
    type: Object as PropType<{ chain: string, symbol: string }>,
    default: () => {
      return {
        chain: '',
        symbol: ''
      }
    }
  }
})
const tokens = ref([])
async function _getSimilarToken() {
  const res = await getSimilarTokens(props.row.id)
  tokens.value = res.tokens || []
}

_getSimilarToken()
</script>

<style></style>
