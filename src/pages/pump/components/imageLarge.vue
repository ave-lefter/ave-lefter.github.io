<template>
  <div class="rounded-4px">
    <div v-if="!isEmpty" class="p-12px color-[--main-text] flex items-center gap-4px">
      <template v-if="type === 'new'">
        {{ t('progress') }}: {{ formatNumber(row.progress, 1) }}%
      </template>
      <template v-else-if="type === 'soon'">
        {{ t('soon') }}
      </template>
      <template v-else-if="type === 'graduated'">
        {{ t('migrated') }}
        <div v-tooltip="formatDate(row?.created_at || row?.time)" class="time" :style="{
          color:
            Number(formatTimeFromNow(row?.created_at || row?.time, true)) <= 600
              ? '#FFA622'
              : '#12B886',
        }">
          <template v-if="!(row?.created_at || row?.time)"> - </template>
          <template v-else-if="Number(formatTimeFromNow(row?.created_at || row?.time, true)) >= 60">
            {{
              formatCountdown(
                Number(row?.created_at) * 1000 || Number(row?.time) * 1000,
                false
              )
            }}
          </template>
          <TimerCount v-else-if="
            (row?.created_at || row?.time) &&
            Number(formatTimeFromNow(row?.created_at || row?.time, true)) < 60
          " :key="`${row.created_at}`" :timestamp="row.created_at" :end-time="60">
            <template #default="{ seconds }">
              <span class="color-#FFA622">
                <template v-if="seconds < 60"> {{ seconds }}s </template>
                <template v-else>
                  {{ formatTimeFromNow(row.created_at) }}
                </template>
              </span>
            </template>
          </TimerCount>
        </div>
      </template>
    </div>
    <el-image class="token-icon w-228px h-228px flex items-center justify-center" style="display: flex" fit="cover"
      :src="getSymbolDefaultIcon(row, 'rect')" preview-teleported>
      <template #error>
        <img class="token-icon w-228px h-228px text-16px color-#fff object-cover"
          :src="getChainDefaultIcon(row.chain, row.symbol, 'rect')">
      </template>
    </el-image>
    <div v-if="similarpic.length" class="p-12px">
      <div class="flex justify-between">
        <div class="text-12px lh-12px color-[--third-text] mb-12px">{{ t('similarPic') }}({{ similarpic.length }})</div>
        <div class="text-12px lh-12px color-[--third-text] mb-12px">{{ t('mcap') }}</div>
      </div>
      <div class="flex flex-col gap-8px">
        <div v-for="token in similarpic" :key="token.id" class="flex items-center gap-8px cursor-pointer"
          @click="navigateTo(`/token/${token.token}-${token.chain}`)">
          <div class="flex-1">
            <div class="lh-16px color-[--main-text]">{{ token.symbol }}</div>
            <div class="lh-12px">
              {{ token.token.slice(0, 4) + '...' + token.token.slice(-4) }}
            </div>
          </div>
          <div class="text-12px text-right flex flex-col">
            <div class="lh-16px" :style="{ color: getDataColor('mc', token.market_cap) }">${{
              formatNumber(token.market_cap, 1) }}
              </div>
            <div v-tooltip="t('createdTime') + ':' + formatDate(token.created_at, 'YYYY-MM-DD HH:mm:ss')"
              class="justify-end lh-12px color-[--third-text] text-10px">{{ formatTimeFromNow(token.created_at) }}</div>
            </div>
        </div>
      </div>
    </div>
    <div v-if="!isEmpty" class="p-12px">
      <div class="flex justify-between">
        <div class="text-12px lh-12px color-[--third-text] mb-12px">{{ t('similarTokens') }}({{ tokens.length }})</div>
        <div class="text-12px lh-12px color-[--third-text] mb-12px">{{ t('mcap') }}</div>
      </div>
      <div class="flex flex-col gap-8px">
        <div v-for="token in tokens" :key="token.id" class="flex items-center gap-8px cursor-pointer"
          @click="navigateTo(`/token/${token.token}-${token.chain}`)">
          <TokenImg :row="token" />
          <div class="flex-1">
            <div class="lh-16px color-[--main-text]">{{ token.symbol }}</div>
            <div v-tooltip="formatDate(token.last_trade_at, 'YYYY-MM-DD HH:mm:ss')" class="lh-12px"><span
                class="text-12px color-[--third-text] text-10px">{{ t('lastTx') }}:{{
                  formatTimeFromNow(token.last_trade_at) }}</span>
            </div>
          </div>
          <div class="text-12px text-right flex flex-col">
            <div class="lh-16px" :style="{ color: getDataColor('mc', token.market_cap) }">${{
              formatNumber(token.market_cap, 1) }}
              </div>
            <div v-tooltip="t('createdTime') + ':' + formatDate(token.created_at, 'YYYY-MM-DD HH:mm:ss')"
              class="justify-end lh-12px color-[--third-text] text-10px">{{ formatTimeFromNow(token.created_at) }}</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { getSimilarTokens, getTokenSimilarpic } from '~/api/token'
const { t } = useI18n()

const props = defineProps({
  row: {
    type: Object as PropType<{ chain: string, symbol: string }>,
    default: () => {
      return {
        chain: '',
        symbol: ''
      }
    }
  },
  type: {
    type: String,
    default: () => '',
  },
  getDataColor: {
    type: Function,
    default: () => { },
  }
})
const tokens = ref([])
const similarpic = ref([])
const isEmpty = computed(() => {
  return tokens.value.length === 0
})
async function _getSimilarToken() {
  const res = await getSimilarTokens(props.row.id)
  tokens.value = res.tokens || []
}

async function _getSimilarpic() {
  const res = await getTokenSimilarpic(props.row.id)
  similarpic.value = res.tokens || []
}

_getSimilarToken()
// _getSimilarpic()
watch(() => props.row, () => {
  tokens.value = []
  _getSimilarToken()
  // _getSimilarpic()
})
</script>

<style></style>
