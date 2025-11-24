<script setup lang="ts">
import BigNumber from 'bignumber.js'
import { usePerpStore } from '~/stores/perp'
import { useThemeStore } from '~/stores/theme'

const visible = defineModel<boolean>('visible')
const props = defineProps<{
  row: any
}>()
const perpStore = usePerpStore()
const themeStore = useThemeStore()
const { t } = useI18n()
const formData = ref({
  size: undefined,
})
const tempData = ref({
  tpPrice: '',
  slPrice: '',
  tpType: 'market',
  slType: 'market',
  tpPercent: 0,
  slPercent: 0,
  sizePercent: 0,
})
// {
//   "price": "0",
//   "size": "0.001",
//   "type": "STOP_MARKET",
//   "timeInForce": "GOOD_TIL_CANCEL",
//   "reduceOnly": true,
//   "isPositionTpsl": true,
//   "isSetOpenTp": false,
//   "isSetOpenSl": false,
//   "accountId": "682587604448707540",
//   "contractId": "10000001",
//   "side": "BUY",
//   "triggerPrice": "110803.9",
//   "triggerPriceType": "LAST_PRICE",
//   "clientOrderId": "48741240911198647",
//   "expireTime": "1765525479702",
//   "l2Nonce": "1766231858",
//   "l2Value": "844.042",
//   "l2Size": "0.001",
//   "l2LimitFee": "1",
//   "l2ExpireTime": "1766303079702",
//   "l2Signature": "0402264f73a3a196f02eb68e0f944a7b6c32176b6ea2097bd71eea1741bc24ea028402cc44d39eaa261017a4adec95b2f33a061d27654b311b35630f17ee1c68",
//   "extraType": "",
//   "extraDataJson": "",
//   "symbol": "BTCUSD",
//   "confirm": false
// }
const typeDict = computed(() => {
  const contractMap =
    perpStore.metadata?.contractList?.reduce?.(
      (prev, cur) => {
        prev[cur.contractId] = cur.contractName
        return prev
      },
      {} as Record<string, string>
    ) || {}
  contractMap.ALL = t('all')
  return contractMap
})

const sizePercentChange = (val: number) => {
  formData.value.size = (val / 100) * (props.row.openSize ? Math.abs(props.row.openSize) : 0)
}
</script>

<template>
  <el-dialog append-to-body v-model="visible" :title="t('takeProfitStopLoss2')" width="500px">
    <div class="mb-19px flex items-center gap-8px text-14px font-bold color-[--main-text]">
      {{ typeDict[props.row.contractId] }}
      <div :class="getColorClass(props.row.openValue)">
        {{ props.row.openValue > 0 ? t('long') : t('short') }} {{ props.row.maxLeverage }}x
      </div>
    </div>
    <div class="flex items-center mb-10px">
      <div class="flex-1 flex flex-col gap-4px color-[--main-text]">
        <label class="color-[--third-text]">{{ t('entryPrice') }}</label>
        {{
          formatNumber(new BigNumber(props.row.openValue).div(props.row.openSize).toString(), {
            limit: 20,
          })
        }}
      </div>
      <div class="flex-1 flex flex-col gap-4px color-[--main-text]">
        <label class="color-[--third-text]">{{ t('latestPrice') }}</label>
        {{
          formatNumber(row.oraclePrice, {
            limit: 20,
            decimals: 1,
          })
        }}
      </div>
    </div>
    <div class="mb-24px text-12px color-[--yellow]">
      {{ t('stopTips') }}
    </div>
    <div>
      <el-dropdown trigger="click">
        <span class="flex items-center gap-4px cursor-pointer">
          <span>{{ tempData.tpType === 'market' ? t('marketStop') : t('limitStop') }}</span>
          <SuffixIcon />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="tempData.tpType = 'market'">{{
              t('marketStop')
            }}</el-dropdown-item>
            <el-dropdown-item @click="tempData.tpType = 'limit'">{{
              t('limitStop')
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="flex items-center gap-10px mt-8px mb-16px">
        <el-input class="flex-1" :placeholder="t('triggerPrice')">
          <template #suffix>
            <el-dropdown trigger="click">
              <span class="flex items-center gap-4px cursor-pointer text-12px">
                <span>{{
                  tempData.tpPrice === 'latest' ? t('latestPrice') : t('indexPrice')
                }}</span>
                <SuffixIcon />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="tempData.tpPrice = 'latest'">{{
                    t('latestPrice')
                  }}</el-dropdown-item>
                  <el-dropdown-item @click="tempData.tpPrice = 'index'">{{
                    t('indexPrice')
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-input>
        <el-input class="w-100px text-12px" :placeholder="t('RIO')">
          <template #suffix> % </template>
        </el-input>
      </div>
      <el-slider
        v-model="tempData.tpPercent"
        :min="0"
        :max="200"
        :step="1"
        :marks="{
          0: '0%',
          50: '50%',
          100: '100%',
          150: '150%',
          200: '200%',
        }"
        class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--white] ml-4px [&&]:w-456px"
      />
      <el-dropdown trigger="click">
        <span class="flex items-center gap-4px mt-49px cursor-pointer">
          <span>{{ tempData.slType === 'market' ? t('marketStop') : t('limitStop') }}</span>
          <SuffixIcon />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="tempData.slType = 'market'">{{
              t('marketStop2')
            }}</el-dropdown-item>
            <el-dropdown-item @click="tempData.slType = 'limit'">{{
              t('limitStop2')
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="flex items-center gap-10px mt-8px mb-16px">
        <el-input class="flex-1" :placeholder="t('triggerPrice')">
          <template #suffix>
            <el-dropdown trigger="click">
              <span class="flex items-center gap-4px cursor-pointer text-12px">
                <span>{{
                  tempData.slPrice === 'latest' ? t('latestPrice') : t('indexPrice')
                }}</span>
                <SuffixIcon />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="tempData.slPrice = 'latest'">{{
                    t('latestPrice')
                  }}</el-dropdown-item>
                  <el-dropdown-item @click="tempData.slPrice = 'index'">{{
                    t('indexPrice')
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-input>
        <el-input class="w-100px text-12px" :placeholder="t('RIO')">
          <template #suffix> % </template>
        </el-input>
      </div>
      <el-slider
        v-model="tempData.slPercent"
        :min="0"
        :max="200"
        :step="1"
        :marks="{
          0: '0%',
          50: '50%',
          100: '100%',
          150: '150%',
          200: '200%',
        }"
        class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--white] ml-4px [&&]:w-456px"
      />
      <div class="mt-53px mb-16px">
        <el-input :placeholder="t('orderSize')" v-model="formData.size" />
      </div>
      <el-slider
        v-model="tempData.sizePercent"
        :min="0"
        :max="200"
        :step="1"
        :marks="{
          0: '0%',
          50: '50%',
          100: '100%',
          150: '150%',
          200: '200%',
        }"
        class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--white] ml-4px [&&]:w-456px"
        @change="sizePercentChange"
      />
      <div class="mt-53px flex items-center justify-between">
        <span class="color-[--third-text]">{{ t('contractSize') }}</span>
        <span
          >{{ Math.abs(props.row.openSize)
          }}{{ typeDict[props.row.contractId].replace('USD', '') }}</span
        >
      </div>
      <div class="mt-16px mb-40px flex items-center justify-between">
        <span class="color-[--third-text]">{{ t('orderSize') }}</span>
        <span>{{ formData.size }}{{ typeDict[props.row.contractId].replace('USD', '') }}</span>
      </div>
      <div class="flex">
        <el-button class="h-30px flex-1 m-l-auto" :color="themeStore.isDark ? '#333' : '#F2F2F2'">
          {{ $t('reset') }}
        </el-button>
        <el-button type="primary" class="h-30px flex-1 m-l-auto">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
:deep(.el-slider__marks-text) {
  margin-top: 7px;
}
</style>
