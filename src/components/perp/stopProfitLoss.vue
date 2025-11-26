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
const size = ref(null)
const tempData = ref({
  tpPercent: null,
  slPercent: null,
  sizePercent: null,
})
const tpForm = ref({
  triggerPrice: null,
  triggerPriceType: 'LAST_PRICE',
  price: null,
  type: 'TAKE_PROFIT_MARKET',
})
const slForm = ref({
  triggerPrice: null,
  triggerPriceType: 'LAST_PRICE',
  price: null,
  type: 'STOP_MARKET',
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
  size.value = (val / 100) * (props.row.openSize ? Math.abs(props.row.openSize) : 0)
}
</script>

<template>
  <el-dialog append-to-body v-model="visible" :title="t('takeProfitStopLoss2')" width="500px">
    <div class="max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-hide mx--16px px-16px">
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
            <span>{{
              tpForm.type === 'TAKE_PROFIT_MARKET' ? t('marketStop') : t('limitStop')
            }}</span>
            <SuffixIcon />
          </span>
          <template #dropdown>
            <el-dropdown-menu class="[--el-font-size-base:12px]">
              <el-dropdown-item @click="tpForm.type = 'TAKE_PROFIT_MARKET'">{{
                t('marketStop')
              }}</el-dropdown-item>
              <el-dropdown-item @click="tpForm.type = 'TAKE_PROFIT_LIMIT'">{{
                t('limitStop')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="flex items-center gap-10px mt-8px mb-16px">
          <!-- 止盈 -->
          <el-input-number
            v-model.number="tpForm.triggerPrice"
            :controls="false"
            align="left"
            class="flex-1"
            :placeholder="t('triggerPrice')"
          >
            <template #suffix>
              <el-dropdown trigger="click">
                <span class="flex items-center gap-4px cursor-pointer text-12px">
                  <span>{{
                    tpForm.triggerPriceType === 'LAST_PRICE' ? t('latestPrice') : t('indexPrice')
                  }}</span>
                  <SuffixIcon />
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="[--el-font-size-base:12px]">
                    <el-dropdown-item @click="tpForm.triggerPriceType = 'LAST_PRICE'">{{
                      t('latestPrice')
                    }}</el-dropdown-item>
                    <el-dropdown-item @click="tpForm.triggerPriceType = 'INDEX_PRICE'">{{
                      t('indexPrice')
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-input-number>
          <el-input-number
            v-model.number="tempData.tpPercent"
            :controls="false"
            align="left"
            class="w-100px text-12px"
            :placeholder="t('RIO')"
          >
            <template #suffix> % </template>
          </el-input-number>
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
          class="mb-30px [&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--white] ml-4px [&&]:w-456px"
        />
        <el-input-number
          v-if="tpForm.type === 'TAKE_PROFIT_LIMIT'"
          v-model.number="tpForm.price"
          :controls="false"
          align="left"
          class="text-12px [&&]:w-full"
          :placeholder="t('price')"
        />

        <!-- 止损 -->
        <el-dropdown trigger="click">
          <span class="mt-16px flex items-center gap-4px cursor-pointer">
            <span>{{ slForm.type === 'STOP_MARKET' ? t('marketStop') : t('limitStop') }}</span>
            <SuffixIcon />
          </span>
          <template #dropdown>
            <el-dropdown-menu class="[--el-font-size-base:12px]">
              <el-dropdown-item @click="slForm.type = 'STOP_MARKET'">{{
                t('marketStop2')
              }}</el-dropdown-item>
              <el-dropdown-item @click="slForm.type = 'STOP_LIMIT'">{{
                t('limitStop2')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="flex items-center gap-10px mt-8px mb-16px">
          <!-- 止损 -->
          <el-input-number
            v-model.number="slForm.triggerPrice"
            :controls="false"
            align="left"
            class="flex-1"
            :placeholder="t('triggerPrice')"
          >
            <template #suffix>
              <el-dropdown trigger="click">
                <span class="flex items-center gap-4px cursor-pointer text-12px">
                  <span>{{
                    slForm.triggerPriceType === 'LAST_PRICE' ? t('latestPrice') : t('indexPrice')
                  }}</span>
                  <SuffixIcon />
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="[--el-font-size-base:12px]">
                    <el-dropdown-item @click="slForm.triggerPriceType = 'LAST_PRICE'">{{
                      t('latestPrice')
                    }}</el-dropdown-item>
                    <el-dropdown-item @click="slForm.triggerPriceType = 'INDEX_PRICE'">{{
                      t('indexPrice')
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-input-number>
          <el-input-number
            v-model.number="tempData.slPercent"
            :controls="false"
            align="left"
            class="w-100px text-12px"
            :placeholder="t('RIO')"
          >
            <template #suffix> % </template>
          </el-input-number>
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
          class="mb-30px [&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--white] ml-4px [&&]:w-456px"
        />
        <el-input-number
          v-if="slForm.type === 'STOP_LIMIT'"
          v-model.number="slForm.price"
          :controls="false"
          align="left"
          class="text-12px [&&]:w-full"
          :placeholder="t('price')"
        />

        <!-- 委托数量 -->
        <div class="mt-16px mb-16px">
          <el-input-number
            class="[&&]:w-full"
            v-model.number="size"
            :controls="false"
            align="left"
            :placeholder="t('orderSize')"
            :max="Math.abs(props.row.openSize)"
            @change="
              (val) => {
                tempData.sizePercent = (val / Math.abs(props.row.openSize)) * 100
              }
            "
          />
        </div>
        <el-slider
          v-model="tempData.sizePercent"
          :min="0"
          :max="100"
          :step="1"
          :marks="{
            0: '0%',
            25: '25%',
            50: '50%',
            75: '75%',
            100: '100%',
          }"
          class="[&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--white] ml-4px [&&]:w-456px"
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
          <span>{{ size }}{{ typeDict[props.row.contractId].replace('USD', '') }}</span>
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
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
:deep(.el-slider__marks-text) {
  margin-top: 10px;
}
:deep(.el-slider__marks-stop) {
  width: 8px;
  height: 8px;
  top: -3px;
}
</style>
