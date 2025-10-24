<script setup lang="ts">
import { SuffixIcon } from '#components'
import { useStorage } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import type { IGetTreasureConfig } from '~/api/market'

const props = defineProps<{
  storageKey: string
  getDefaultColumns: (t: ReturnType<typeof useI18n>['t']) => any
  ammList: IGetTreasureConfig['swaps']
}>()
const { t } = useI18n()
const storeColumns = useStorage(props.storageKey, props.getDefaultColumns(t))
const visible = ref(false)
const searchKey = ref('')
const tempFilter = ref<Record<string,any>>({})
const activeTab = ref('chainToken')
const globalStore = useGlobalStore()

const intervals = computed(() => {
  return [
    { name: '1m', id: '1m' },
    { name: '5m', id: '5m' },
    { name: '15m', id: '15m' },
    { name: '1h', id: '1h' },
    { name: '4h', id: '4h' },
    { name: '24h', id: '24h' },
  ]
})
const ammOptions = computed(()=>{
    return [
        {
            chain:'',
            name:' ',
            swap_url:'',
            show_name:t('allDex'),
        }
    ].concat(props.ammList)
})
const filteredAmmList = computed(()=>{
    return ammOptions.value.filter((el)=>{
        return el.show_name && el.show_name.includes(searchKey.value)
    })
})
const filterNumber = computed(() => {
  return 0
})
const modelColumns = computed(() => storeColumns.value?.filter((item: any) =>item.children || item.isVisible))
const dexVisible = computed(() => modelColumns.value?.find((item: any) => item.key === 'dex')?.isVisible)

watch(visible,()=>{
  // 打开弹窗同步所有筛选条件
  if(visible.value){
    tempFilter.value = cloneDeep(globalStore.rankConditions[globalStore.rankActiveTab]?.filter)
    tempFilter.value.amm = tempFilter.value.amm || ' '
    tempFilter.value.activeInterval = globalStore.rankCommon.activeInterval
  }
})

function confirm(data:Record<string,any>) {
  const {activeInterval,...rest} = data
  for(const [restKey,restVal] of Object.entries(rest)){
    const newVal = restVal === ' ' ? '' :restVal
    globalStore.rankConditions[globalStore.rankActiveTab].filter[restKey] = newVal
  }
  for(const [filterKey] of Object.entries(globalStore.rankConditions[globalStore.rankActiveTab].filter)){
    const newVal = rest[filterKey] === ' ' ? '' :rest[filterKey]
    globalStore.rankConditions[globalStore.rankActiveTab].filter[filterKey] = newVal
  }
  if(activeInterval){
    globalStore.rankCommon.activeInterval = activeInterval
  }
  visible.value=false
}
</script>

<template>
  <el-popover
      v-model:visible="visible"
      placement="bottom"
      popper-class="w-pumpFilter popper new-popover"
      title=""
      :width="398"
      trigger="click"
      popper-style="padding: 10px"
      append-to-body
    >
    <template #reference>
        <div :class="['filter-btn mr-2', { active: visible }, filterNumber > 0 ? 'hight': '']">
          <Icon
            id="custom-filter"
            name="custom:filter"
            class="text-10px cursor-pointer mr-4px"
          />
          <span>{{ $t('filter') }}</span>
          <span v-if="filterNumber > 0" class="filter-number">{{ filterNumber }}</span>
        </div>
      </template>
      <template #default>
        <span class="text-14px block border pb-10px">{{ $t('FilterSetting') }}</span>
        <div v-if="dexVisible" class="flex items-center justify-between text-12px mb-16px">
          <span class="color-[--secondary-text]">{{ $t('dexSelect') }}</span>
          <el-select v-model.trim="tempFilter.amm" :teleported="false" class="[&&]:w-206px" :suffix-icon="SuffixIcon">
            <template #label="{label,value}">
             <div class="flex items-center gap-4px">
              <img v-if="value!==' '" class="w-16px h-16px rounded-full" :src="`${globalStore.token_logo_url}swap/${value}.jpeg`" alt="">
              <Icon v-else name="custom:switch" class="text-16px"/>
              <span>{{ label }}</span>
             </div>
            </template>
            <template #header>
              <div>
                <el-input
                    v-model="searchKey"
                    class="[--el-border-color:transparent]"
                    :placeholder="$t('search')"
                    clearable
                >
                    <template #prefix>
                    <Icon name="hugeicons:search-01" />
                    </template>
                </el-input>
            </div>
            </template>
            <el-option v-for="item in filteredAmmList" :key="item.name" class="flex items-center gap-4px w-206px" :value="item.name" :label="item.show_name">
              <img v-if="item.chain" class="w-16px h-16px rounded-full" :src="`${globalStore.token_logo_url}swap/${item.name}.jpeg`" alt="">
              <Icon v-else name="custom:switch" class="text-16px"/>
              <span class="truncate">{{ item.show_name }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="flex items-center justify-between text-12px mb-24px">
          <span class="color-[--secondary-text]">{{ $t('intervalSelect') }}</span>
          <div class="p-1 rounded-1 bg-[--border]">
              <button
                v-for="(item, index) in intervals"
                :key="index"
                class="lh-16px py-2px px-8px border-none cursor-pointer rounded-2px"
                :class="
                  tempFilter.activeInterval === item.id
                    ? 'bg-[--dialog-tab-active-bg] color-[--main-text]'
                    : 'bg-transparent color-[--secondary-text]'
                "
                @click.stop="tempFilter.activeInterval = item.id"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div class="flex items-center p-4px rounded-4px text-center color-[--third-text] bg-[--border] mb-16px">
          <span v-for="text in ['chainToken','marketIndices']" :key="text" class="flex-1 lh-28px cursor-pointer" :class="{'color-[--main-text] bg-[--dialog-tab-active-bg]': activeTab === text}" @click.stop="activeTab = text">{{ $t(text) }}</span>
        </div>
        <div v-if="activeTab==='chainToken'" class="flex items-center justify-between text-12px py-6px mb-8px">
          <span class="color-[--secondary-text]">{{ $t('openTime') }}</span>
          <div class="flex items-center gap-8px">
            <el-input
              v-model.trim.number="tempFilter.created_at_max"
              class="w-106px"
              :placeholder="$t('minor')"
              clearable
            >
              <template #suffix>
                <span>min</span>
              </template>
            </el-input>
            <span class="color-[--third-text]">~</span>
            <el-input
              v-model.trim.number="tempFilter.created_at_min"
               class="w-106px"
              :placeholder="$t('max1')"
              clearable
            >
              <template #suffix>
                <span>min</span>
              </template>
            </el-input>
          </div>
        </div>
        <template v-for="item in modelColumns">
          <template v-if="activeTab==='chainToken'">
            <!-- Dev% -->
          <div v-if="item.key === 'dev_balance_ratio_cur' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">DEV%</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.created_at_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              >
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.created_at_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              >
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
            </div>
          </div>
          <!-- 持币人 -->
          <div v-if="item.key === 'holders' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">{{ $t('holders') }}</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.holder_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              />
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.holder_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              />
            </div>
          </div>
          <!-- 钱包数 -->
          <div v-if="item.key === 'markers_dynamic' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">
              <span
                class="lh-16px rounded-2px px-2px text-12px bg-[--border] color-[--secondary-text]"
              >
                {{ tempFilter.activeInterval }}</span
              >
              {{ $t('markers') }}
            </span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter[`makers_${tempFilter.activeInterval}_min`]"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              />
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter[`makers_${tempFilter.activeInterval}_max`]"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              />
            </div>
          </div>
          <!-- Top10持仓 -->
          <div v-if="item.key === 'holders_top10_ratio' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">{{ $t('top10') }}</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.holders_top10_ratio_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              />
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.holders_top10_ratio_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              />
            </div>
          </div>
          <!-- 狙击人数 -->
          <div v-if="item.key === 'sniper_tx_count' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">{{ $t('snipers') }}</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.sniper_tx_count_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              />
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.sniper_tx_count_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              />
            </div>
          </div>
          <!-- 聪明钱买入笔数 -->
          <div v-if="item.key === 'smart_money_buy_volume_24h' && item.isVisible" :key="item.key+0" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">{{ $t('smarterBuyTxns') }}</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.smart_money_buy_count_24h_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              />
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.smart_money_buy_count_24h_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              />
            </div>
          </div>
          <!-- 聪明钱卖出笔数 -->
          <div v-if="item.key === 'smart_money_buy_volume_24h' && item.isVisible" :key="item.key+1" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">{{ $t('smarterSellTxns') }}</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.smart_money_sell_count_24h_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              />
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.smart_money_sell_count_24h_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              />
            </div>
          </div>
          <!-- 老鼠仓 -->
          <div v-if="item.key === 'insider_balance_ratio_cur' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">{{$t('insiders')}}</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.insider_balance_ratio_cur_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              >
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.insider_balance_ratio_cur_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              >
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
            </div>
          </div>
          </template>
          <template v-if="activeTab==='marketIndices'">
            <!-- 进度 % -->
            <div v-if="item.key === 'progress' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">{{ $t('progress') }}</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.progress_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              >
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.progress_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              >
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
            </div>
          </div>
          <!-- 市值¥ -->
          <div v-if="item.key === 'mCap' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">{{ $t('mCap') }}($)</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.marketcap_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              >
                <template #suffix>
                  <span>$</span>
                </template>
              </el-input>
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.marketcap_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              >
                <template #suffix>
                  <span>$</span>
                </template>
              </el-input>
            </div>
          </div>
          <!-- 池子¥ -->
          <div v-if="item.key === 'mCap' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">{{ $t('liquidity1') }}($)</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter.tvl_min"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              >
                <template #suffix>
                  <span>$</span>
                </template>
              </el-input>
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter.tvl_max"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              >
                <template #suffix>
                  <span>$</span>
                </template>
              </el-input>
            </div>
          </div>
          <!-- 交易量 -->
          <div v-if="item.key === 'dynamicVolAndTxs' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]"><span
                class="lh-16px rounded-2px px-2px text-12px bg-[--border] color-[--secondary-text]"
                >{{ tempFilter.activeInterval }}</span
              >{{ $t('Vol') }}</span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter[`volume_u_${tempFilter.activeInterval}_min`]"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              >
                <template #suffix>
                  <span>$</span>
                </template>
              </el-input>
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter[`volume_u_${tempFilter.activeInterval}_max`]"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              >
                <template #suffix>
                  <span>$</span>
                </template>
              </el-input>
            </div>
          </div>
          <!-- 交易数 -->
          <div v-if="item.key === 'dynamicVolAndTxs' && item.isVisible" :key="item.key" class="flex items-center justify-between text-12px py-6px mb-8px">
            <span class="color-[--secondary-text]">
              <span
                class="lh-16px rounded-2px px-2px text-12px bg-[--border] color-[--secondary-text]"
                >{{ tempFilter.activeInterval }}</span
              >
              {{ $t('txns') }}
            </span>
            <div class="flex items-center gap-8px">
              <el-input
                v-model.trim.number="tempFilter[`tx_${tempFilter.activeInterval}_count_min`]"
                class="w-106px"
                :placeholder="$t('minor')"
                clearable
              />
              <span class="color-[--third-text]">~</span>
              <el-input
                v-model.trim.number="tempFilter[`tx_${tempFilter.activeInterval}_count_min`]"
                class="w-106px"
                :placeholder="$t('max1')"
                clearable
              />
            </div>
          </div>
          </template>
        </template>
        <div class="mt-20px flex">
          <el-button
            class="h-30px flex-1 m-l-auto"
            @click="confirm(tempFilter={})"
          >
            {{ $t('reset') }}
          </el-button>
          <el-button type="primary" class="h-30px flex-1 m-l-auto"
          @click="confirm(tempFilter)"
          >
            {{ $t('confirm') }}
          </el-button>
        </div>
      </template>
    </el-popover>
</template>

<style scoped lang="scss">
/* Add your component styles here */

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  cursor: pointer;
  color: var(--third-text);
  background: var(--main-input-button-bg);
  border-radius: 4px;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0;
  font-weight: 500;
  box-sizing: border-box;
  height: 26px;
  position: relative;
  &.hight{
    color: var(--main-text)
  }

  img {
    margin-right: 2px;
  }

  .filter-number {
    position: relative;
    display: inline-block;
    border-radius: 2px;
    width: 14px;
    height: 14px;
    text-align: center;
    background-color: var(--third-text);
    color: var(--main-text);
    margin-left: 4px;
    font-size: 10px;
  }

  &:hover {
    cursor: pointer;
    color: var(--main-text);
    .iconify {
      color: var(--main-text);
    }
  }

  /* &.active {
        color: var(--a-text-1-dark-color);
        background: var(--a-bg-active-color);
    } */
}

</style>