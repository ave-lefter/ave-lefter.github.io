<template>
  <el-dialog v-model="localVisible" header-class="hidden"
    class="[--el-bg-color:--pump-bg] border-1px border-solid border-[--main-divider] dialog" title="" :width="488"
    style="padding: 0" append-to-body :persistent="false" :show-close="false">
    <template #default>
      <div
        class="text-14px py-14px px-16px flex items-center justify-between border-b-1px border-b-solid border-b-[--main-divider] font-500">
        {{ $t('FilterSetting') }}
        <Icon class="text-16px cursor-pointer" name="custom:close" @click="localVisible = false" />
      </div>
      <div class="flex items-center px-16px gap-16px border-b-1px border-b-solid border-b-[--main-divider] mb-16px">
        <div v-for="(item) in topTabs" :key="item.value" class="flex items-center gap-4px">
          <span
            :class="`flex items-center decoration-none text-12px lh-39px text-center b-b-solid b-b-2px cursor-pointer ${activeTab === item.value ? 'color-[--main-text] b-b-[--main-text] font-500' : 'b-b-transparent color-[--secondary-text]'}`"
            @click="activeTab = item.value">
            {{ item.name }}
          </span>
          <span v-show="getItemFilterNumber(item.value)"
            class="w-16px h-16px lh-16px bg-[--primary-color] rounded-4px color-#fff text-12px text-center">
            {{ getItemFilterNumber(item.value) }}
          </span>
        </div>
      </div>
      <el-form ref="formRef" class="scrollbar-hide w-pumpFilter" :model="form" label-width="auto" autocomplete="off"
        label-position="left" size="small" @submit.prevent>
        <el-scrollbar view-class="filter-height">
          <div class="px-16px pb-12px">
            <div class="flex justify-between items-center w-full mb-16px">
              <span class="text-12px">{{ $t('platform') }}</span>
              <span class="text-12px w-48px lh-24px rounded-4px bg-[--pump-filter-bg] text-center cursor-pointer"
                @click="form.platforms = platformsList.map(platform => platform.platform).join(',')">
                {{ $t('all1')
                }}
                </span>
            </div>
            <el-checkbox-group size="default" @change="(val) => form.platforms = val.join(',')"
              :model-value="form.platforms.split(',')" class="grid grid-cols-2 gap-12px flex-1">
              <el-checkbox v-for="platform in platformsList" :key="platform.platform" :label="platform.platform"
                class="[&&]:mr-0 [&&]:[--el-checkbox-height:28px]">
                <span
                  class="flex items-center gap-8px rounded-30px py-6px px-12px border-1px border-solid color-[--main-text]"
                  :style="{ borderColor: PlatformColors[platform.platform] }">
                  <el-image class="rounded w-14px" :src="`${configStore.token_logo_url}${platform.platform_icon?.replace(
                    '/signals/',
                    'signals/'
                  )}`" />
                  {{ platform.platform_show }}
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="px-16px border pb-12px">
            <div class="flex justify-between items-center w-full mb-16px">
              <span class="text-12px">{{ $t('QuoteTokens') }}</span>
              <span class="text-12px w-48px lh-24px rounded-4px bg-[--pump-filter-bg] text-center cursor-pointer" @click="form.base_tokens = baseTokens.map(token => token.token).join(',')">{{ $t('all1')
                }}</span>
            </div>
            <el-checkbox-group size="default" @change="(val) => form.base_tokens = val.join(',')"
              :model-value="form.base_tokens?.split?.(',') || []" class="grid grid-cols-2 gap-12px flex-1">
              <el-checkbox v-for="platform in baseTokens" :key="platform.token" :label="platform.token"
                class="[&&]:mr-0 [&&]:[--el-checkbox-height:28px]">
                <span
                  class="flex items-center gap-8px rounded-30px py-6px px-12px border-1px border-solid color-[--main-text]"
                  :style="{ borderColor: PlatformColors[platform.symbol] }">
                  <el-image class="rounded w-14px" :src="`${configStore.token_logo_url}${platform.logo_url?.replace(
                    '/signals/',
                    'signals/'
                  )}`" />
                  {{ platform.symbol }}
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="flex border px-16px py-12px mb-18px inline-form">
              <el-form-item label-position="top" :label="$t('searchTip')" :prop="form.q"
              class="w-full mr-8px">
              <div class="formItem inputRange">
                <el-input size="large" v-model.trim="form.q" class="search-input1" clearable placeholder="abc,abc,abc"
                  @input="(val) => form.q = val.replace(/\s/g, '')" />
              </div>

            </el-form-item>
            <el-form-item label-position="top" :label="$t('searchXAccount')" :prop="form.twitter_usernames"
              class="w-full">
              <div class="formItem inputRange">
                <el-input size="large" v-model.trim="form.twitter_usernames" class="search-input1" clearable placeholder="abc,abc,abc"
                  @input="(val) => form.twitter_usernames = val.replace(/\s/g, '')" />
              </div>

            </el-form-item>
          </div>
          <div class="mx-16px p-2px border-1px border-solid border-[--main-divider] flex items-center rounded-6px">
            <div class="flex-1 rounded-6px text-center lh-28px cursor-pointer" v-for="item in tabs2"
              :class="tabs2Active === item.id ? 'bg-[--pump-filter-bg] color-[--main-text]' : 'color-[--secondary-text]'"
              :key="item.id" @click="tabs2Active = item.id">
              {{ item.name }}
            </div>
          </div>
          <div v-show="tabs2Active === Tabs2Enum.indicator"
            class="grid grid-cols-2 gap-12px flex-1 px-16px py-12px border">
            <el-checkbox size="default" :model-value="form.dev_sale_out === 1"
               @change="(val) => form.dev_sale_out = val ? 1 : 0">
               <span class="color-[--secondary-text]">
                {{ t('devClose') }}
              </span>
            </el-checkbox>
            <el-checkbox size="default" :model-value="form.dev_sale_out === 2" @change="(val) => form.dev_sale_out = val ? 2 : 0">
               <span class="color-[--secondary-text]">
                {{ t('devNotClose') }}
              </span>
            </el-checkbox>
            <el-checkbox size="default" v-model="form[indicate.value]" v-for="indicate in indicatorArr"
              :key="indicate.value" :label="indicate.label" class="[&&]:mr-0 [&&]:[--el-checkbox-height:16px]">
              <span class="color-[--secondary-text]">
                {{ indicate.label }}
              </span>
            </el-checkbox>
          </div>
          <el-form-item v-if="!storage.value?.includes('_graduated') && tabs2Active===Tabs2Enum.indicator" :label="`${t('progress')}(%)`"
            class="mt-12px px-16px columns-form-item">

            <div class="formItem inputRange">
              <el-input style="--el-input-height:36px" v-model.trim.number="form.progress_min" :placeholder="$t('minor')" clearable
                @blur="(val) => handleBlur(['progress_min', 'progress_max'], val, 0)"
                @input="(val) => handleInput(['progress_min', 'progress_max'], val, 0)">
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
              <span class="gap">~</span>
              <el-input style="--el-input-height:36px" v-model.trim.number="form.progress_max" :placeholder="$t('max1')" clearable
                @blur="(val) => handleBlur(['progress_min', 'progress_max'], val, 1)"
                @input="(val) => handleInput(['progress_min', 'progress_max'], val, 1)">
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
            </div>
          </el-form-item>
          <template v-for="(column) in columns" :key="column.label">
            <el-form-item v-if="tabs2Active == column.tab" class="mt-12px px-16px" :class="column.tab !=='media'?'columns-form-item':''"
              :label="column.tab !== 'media' ? column.label : ''"
              :prop="isArray(column.prop) ? '' : isString(column.prop) ? column.prop : ''">
              <template v-if="column.type === 'inputRange'">
                <div :class="['formItem', column.type]">
                  <el-input style="--el-input-height:36px" v-model.trim.number="form[column.prop[0]]"
                    :placeholder="column?.placeholder && column?.placeholder[0]" clearable
                    @blur="(val) => handleBlur(column.prop, val, 0)" @input="(val) => handleInput(column.prop, val, 0)">
                    <template v-if="column.suffix" #suffix>
                      <span>{{ column.suffix }}</span>
                    </template>
                  </el-input>
                  <span class="gap">~</span>
                  <el-input style="--el-input-height:36px"  v-model.trim.number="form[column.prop[1]]"
                    :placeholder="column?.placeholder && column?.placeholder[1]" clearable
                    @blur="(val) => handleBlur(column.prop, val, 1)" @input="(val) => handleInput(column.prop, val, 1)">
                    <template v-if="column.suffix" #suffix>
                      <span>{{ column.suffix }}</span>
                    </template>
                  </el-input>
                </div>
              </template>
              <template v-else-if="column.type === 'media'">
                <el-checkbox-group size="default" class="grid grid-cols-2 gap-12px flex-1" v-model="form[column.prop]"
                  :disabled="form.has_sm == 1">
                  <el-checkbox v-for="(item, $index) in column.list" :key="$index"
                    class="[&&]:mr-0 [&&]:[--el-checkbox-height:16px]" :value="item.url">
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-else-if="column.type === 'checkbox'">
                <el-checkbox size="default" v-model="form[column.prop]" :true-value="1" :false-value="0"  class="[&&]:mr-0 [&&]:[--el-checkbox-height:16px]">{{
                  column.label }}</el-checkbox>
              </template>

              <template v-else>
                <div :class="['formItem', column.type]">
                  <el-input v-model="form[column.prop]" clearable>
                    <template v-if="column.suffix" #suffix>
                      <span>{{ column.suffix }}</span>
                    </template>
                  </el-input>
                </div>
              </template>
            </el-form-item>
          </template>
        </el-scrollbar>

        <el-form-item>
          <div style="display: flex; width: 100%" class="mt-18px px-16px">
            <el-button class="flex-1 rounded-8px"
              style="height: 36px; min-width: 60px; --el-button-font-weight: 400; background: var(--border); border: none;color: var(--main-text)"
              @click="reset">
              {{ $t('reset') }}
            </el-button>
            <el-button
              style="height: 36px; min-width: 60px; --el-button-font-weight: 400; background:#3F80F7; color: #f5f5f5"
              type="primary" class="flex-1 rounded-8px" @click="handleConfirm">
              {{ $t('confirm') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { handleError } from 'vue'
import { _isArray, _isString } from '@/utils/index.js'
import { getFilterNumber } from '../utils'
import { isEqual } from 'lodash-es'

const props = defineProps({
  activeChain: {
    type: String,
    default: 'bsc'
  },
  visible: {
    type: Boolean,
    default: false
  },
  activeFilterType: {
    type: String,
    default: 'new'
  },
  platformsList: {
    type: Array<any>,
    default: () => []
  },
  baseTokens:{
    type:Array<any>,
    default:() => []
  }
})

const emit = defineEmits(['update:filterData', 'update:visible'])
const globalStore = useGlobalStore()
const pumpStore = usePumpStore()
const configStore = useConfigStore()
const { isDark } = storeToRefs(globalStore)
const { t } = useI18n()
const activeTab = ref(props.activeFilterType)
watch(()=>props.activeFilterType,val=>activeTab.value = val)
const storage = computed(() => `pumpFilter_${props.activeChain}_${activeTab.value}`)
const topTabs = computed(() => {
  return [
    { name: t('new1'), value: 'new' },
    { name: t('soon'), value: 'soon' },
    { name: t('graduated'), value: 'graduated' },
  ]
})
const limitData = {
  q: '',
  dev_sale_out: 0,
  platforms: 'pump,moonshot',
  // platforms_pump: true,
  // platforms_moonshot: true,
  progress_min: 0, //进度
  progress_max: 100,

  lage: '', //代币时长
  rage: '',
  dev_balance_ratio_cur_min: 0, //dev 持仓%
  dev_balance_ratio_cur_max: 100,
  holder_min: 0, //持有人
  holder_max: 1000000,
  holders_top10_ratio_min: 0, //top10 持仓%
  holders_top10_ratio_max: 100,
  lsnip: '',   //狙击人数
  rsnip: '',
  smart_money_tx_count_24h_min: 0, // 聪明钱交易数 （买入数+卖出数）
  smart_money_tx_count_24h_max: 1000000,
  lins: '',  //老鼠仓
  rins: '',
  lkol: '',  //KOL交易人数
  rkol: '',
  lrug: '', //跑路概率
  rrug: '',

  market_cap_min: 0, // 市值
  market_cap_max: 10000000,
  volume_u_24h_min: 0, //交易额
  volume_u_24h_max: 10000000,

  lbtx: '',//买入交易数
  rbtx: '',
  lstx: '', //卖出交易数
  rstx: '',
  lmks: '', //24h 钱包数
  rmks: '',
  sm_list: [],
  has_sm: 0
}
const initForm = {
  q: '',
  dev_sale_out: 0,
  platforms: 'pump,moonshot',
  // platforms_pump: true,
  // platforms_moonshot: true,
  progress_min: '', //进度
  progress_max: '',

  lage: '', //代币时长
  rage: '',
  dev_balance_ratio_cur_min: '', //dev 持仓%
  dev_balance_ratio_cur_max: '',
  holder_min: '', //持有人
  holder_max: '',
  holders_top10_ratio_min: '', //top10 持仓%
  holders_top10_ratio_max: '',
  lsnip: '',   //狙击人数
  rsnip: '',
  smart_money_tx_count_24h_min: '', // 聪明钱交易数 （买入数+卖出数）
  smart_money_tx_count_24h_max: '',
  lins: '',  //老鼠仓
  rins: '',
  lkol: '',  //KOL交易人数
  rkol: '',
  lrug: '', //跑路概率
  rrug: '',

  market_cap_min: '', // 市值
  market_cap_max: '',
  volume_u_24h_min: '', //交易额
  volume_u_24h_max: '',
  lbtx: '',//买入交易数
  rbtx: '',
  lstx: '', //卖出交易数
  rstx: '',
  lmks: '', //卖出交易数
  rmks: '',
  sm_list: [],
  has_sm: 0

  // tvl_min: '',
  // tvl_max: '',

  // tx_24h_count_min: '',
  // tx_24h_count_max: '',

}
// 用 platform 作为 key 构建一个对象，这个对象值为边框色
const PlatformColors = {
  pump: '#88d693',
  bonk: '#e78c19',
  moonshot: '#ff88fe',
  raydium: '#ff3bb8',
  jupstudio: '#69d0b2',
  moon_new: '#dfff18',
  cookingcity: '#6C416F',
  bags: '#00d62b',
  heaven: '#e5e5e6',
  fourmeme: '#7ce660',
  web3binance: '#7ce660',
  'flap.sh': '#967aff',
  dyorswap: '#32C9FF',
  flap: '#967aff',
  'web3.binance.com':"#7ce660",
  "clanker": '#8a63d2',
  "bankr": '#9472ff',
  "baseapp": '#3679ff',
  "zoracreator": '#5a81f1',
  "zoracontent": '#5a81f1',
  'So11111111111111111111111111111111111111112':'#A357E6',
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB":"#00D62B",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v":"#2775C9",
  "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB":"#E78C19",
  "OKB":"#363636",
  "USDT":"#52d48f",
  "ETH":"#4d84f7",
  "USDC":"#2fc0f1",
  "VIRTUAL":"#3ab7b8",
  "ZORA":"#5a81f1",
  "BNB":"#fed15c",
  "ASTER":"#fed15c",
  "CAKE":"#d1884f",
  "U":"#d1b95c",
  "USD1":"#fed15c"
}
const localVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const formRef = ref()
type FormType = typeof initForm
const form = ref<FormType>(initForm)
let tableFilter = pumpStore.pumpV3[props.activeChain][activeTab.value]?.pumpFilter

const tabs2Active = ref('indicator')
const Tabs2Enum = {
  indicator: 'indicator',
  media: 'media'
}
const tabs2 = computed(() => {
  return [
    { name: t('indicator'), id: Tabs2Enum.indicator },
    { name: t('socialMedia'), id: Tabs2Enum.media },
  ]
})
const indicatorArr = computed(() => {
  return [
    // { label: t('devClose'), value: 'dev_sale_out' },
    // { label: t('devNotClose'), value: 'dev_sale_out' },
    // { label: t('noRepeatAvatar'), value: 'no_repeat_avatar' },
    { label: t('noRepeatSocialMedia'), value: 'no_repeat_social_media' },
    // { label: t('DEVBurn'), value: 'dev_burn' },
    // { label: t('filterBot'), value: 'filter_bot' },
    // { label: t('filterDevBot'), value: 'filter_dev_bot' },
    // { label: t('filterMouse'), value: 'filter_mouse' }
  ]
})
const setCheckedPlatforms = () => {
   const platformsAll = props.platformsList.map((i: any) => i.platform).join(',')
    let platforms = platformsAll
    if (tableFilter?.platforms) {
      let platformsArr = tableFilter?.platforms?.split?.(',')
      platformsArr = platformsArr.filter(el => {
        return props.platformsList.some((i: any) => i.platform === el)
      })
      platforms = platformsArr.join(',')
    }
    form.value = { ...tableFilter, platforms: platforms }
}
const setCheckedBaseTokens = () => {
  const baseTokensAll = props.baseTokens.map((i: any) => i.token).join(',')
  if (!('base_tokens' in tableFilter)) {
    form.value.base_tokens = baseTokensAll
  }
}
watch(() => props.platformsList, (val, oldValue) => {
  if (isEqual(val, oldValue)) return
  setCheckedPlatforms()
  emit('update:filterData', { ...form.value }, storage.value)
})
watch(() => props.visible, (val) => {
  if (val) {
   setCheckedPlatforms()
   setCheckedBaseTokens()
  }
})
watch(activeTab,()=>{
 tableFilter = pumpStore.pumpV3[props.activeChain][activeTab.value]?.pumpFilter
  setCheckedPlatforms()
  setCheckedBaseTokens()
})
// watch(() => storage.value, (val) => {
//     tableFilter.value = usePumpTableDataFetching(val)
// })

const columns = computed(() => {
  const c = [
    {
      label: `${t('tokenDuration')}`,
      prop: ['lage', 'rage'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      suffix: 'm',
      tab: Tabs2Enum.indicator
    },
    {
      label: `Dev ${t('positions')}(%)`,
      prop: ['dev_balance_ratio_cur_min', 'dev_balance_ratio_cur_max'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      suffix: '%',
      tab: Tabs2Enum.indicator
    },
    {
      label: `${t('tokenHolders')}`,
      prop: ['holder_min', 'holder_max'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      tab: Tabs2Enum.indicator
    },
    {
      label: `Top10 ${t('positions')}(%)`,
      prop: ['holders_top10_ratio_min', 'holders_top10_ratio_max'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      suffix: '%',
      tab: Tabs2Enum.indicator
    },

    {
      label: t('snipers'),
      prop: ['lsnip', 'rsnip'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      tab: Tabs2Enum.indicator
    },
    {
      label: t('smarterTxs'),
      prop: [
        'smart_money_tx_count_24h_min',
        'smart_money_tx_count_24h_max'
      ],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      suffix: '',
      tab: Tabs2Enum.indicator
    },

    {
      label: t('insiders'),
      prop: [
        'lins',
        'rins'
      ],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      suffix: '%',
      tab: Tabs2Enum.indicator
    },
    {
      label: t('KOLTraders'),
      prop: [
        'lkol',
        'rkol'
      ],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      tab: Tabs2Enum.indicator
    },
    {
      label: `${t('runPullRatio')}`,
      prop: [
        'lrug',
        'rrug'
      ],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      suffix: '%',
      tab: Tabs2Enum.indicator
    },

    {
      label: `${t('MC')}($)`,
      prop: ['market_cap_min', 'market_cap_max'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      suffix: '$',
      tab: Tabs2Enum.indicator
    },
    {
      label: `${t('24Volume')}($)`,
      prop: ['volume_u_24h_min', 'volume_u_24h_max'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      suffix: '$',
      tab: Tabs2Enum.indicator
    },
    {
      label: `${t('buyTxs')}`,
      prop: ['lbtx', 'rbtx'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      tab: Tabs2Enum.indicator
    },
    {
      label: `${t('sellTxs')}`,
      prop: ['lstx', 'rstx'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      tab: Tabs2Enum.indicator
    },
    {
      label: `${t('24hMarkers')}`,
      prop: ['lmks', 'rmks'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      tab: Tabs2Enum.indicator
    },
    {
      label: 'media',
      prop: 'sm_list',
      type: 'media',
      list: [
        {
          name: 'Website',
          url: 'website'
        },
        {
          name: 'Twitter',
          url: 'twitter'
        },
        {
          name: 'Telegram',
          url: 'telegram'
        },
        {
          name: 'Tiktok',
          url: 'tiktok'
        },
        {
          name: 'Instagram',
          url: 'instagram'
        }
      ],
      tab: Tabs2Enum.media
    },
    {
      label: `${t('oneOfficial')}`,
      prop: 'has_sm',
      type: 'checkbox',
      tab: Tabs2Enum.media
    },
    {
      label: `${t('liquidity')}($)`,
      prop: ['tvl_min', 'tvl_max'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
      suffix: '$',
       tab: Tabs2Enum.indicator
    },
    {
      label: t('Txs'),
      prop: ['tx_24h_count_min', 'tx_24h_count_max'],
      placeholder: [t('minor'), t('max1')],
      type: 'inputRange',
       tab: Tabs2Enum.indicator
    },
  ]
  return c || []
})

function handleConfirm() {
  localVisible.value = false
  // 使用 ref 来访问表单实例，并进行验证
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      const form1 = { ...form.value }
      tableFilter = { ...form1 }
      pumpStore.pumpV3[props.activeChain][activeTab.value].pumpFilter = { ...form1 }
      console.log('----------form1-------------', form1)
      emit('update:filterData', { ...form1 }, storage.value)
    } else {
      handleError('error')
      return false
    }
  })
}

function reset() {
  localVisible.value = false  // 隐藏视图
  if (formRef.value) {
    formRef.value.resetFields()  // 重置表单字段
  }
  const form = { ...initForm,platforms:props.platformsList.map(platform => platform.platform).join(','),base_tokens:baseTokensAllStr.value }
  tableFilter = { ...form }
  pumpStore.pumpV3[props.activeChain][activeTab.value].pumpFilter = { ...form }  // 更新过滤器数据
  // 触发更新事件
  emit('update:filterData', { ...form }, storage.value)
}

function handleInput(props: string[], val: string, index: number) {
  const key = props[index] || ''
  form.value[key] = val.replace(/-|[^\d.]/g, '')
}

function handleBlur(props: string[], val: string, index: number) {
  const key = props[index] || ''
  const defaultRange = props
    ? [limitData[props[0]], limitData[props[1]]]
    : []
  // form.value[a]=Number(b)
  // form.value[key]=val.replace(/\-|[^\d.]/g, '')
  if (form.value[key]) {
    if (defaultRange[0] && Number.parseFloat(form.value[key]) <= defaultRange[0])
      form.value[key] = defaultRange[0]


    if (defaultRange[1] && Number.parseFloat(form.value[key]) >= defaultRange[1])
      form.value[key] = defaultRange[1]
    if (index == 1) {
      if (!form.value[props[0]]) return
      if (
        Number.parseFloat(form.value[key]) <=
        Number.parseFloat(form.value[props[0]])
      ) {
        form.value[key] = form.value[props[0]]
      }
    } else {
      if (!form.value[props[1]]) return
      if (
        Number.parseFloat(form.value[key]) >=
        Number.parseFloat(form.value[props[1]])
      ) {
        // if (this.form[key] >= this.form[props[1]]) {
        form.value[key] = form.value[props[1]]
      }
    }



  }
}

function switchForm(f: any) {
  const form = { ...f }
  // const platforms = []
  // if (form.platforms_pump) platforms.push('pump')
  // if (form.platforms_moonshot) platforms.push('moonshot')
  // form.platforms = platforms.join(',')
  // delete form.platforms_pump
  // delete form.platforms_moonshot
  return form
}

const isArray = _isArray
const isString = _isString
const platformsAllStr = computed(() => props.platformsList.filter(Boolean).map((i: any) => i.platform).join(','))
const baseTokensAllStr = computed(() => props.baseTokens.map((i: any) => i.token).join(','))
const getItemFilterNumber = value => {
  if (value === activeTab.value) return getFilterNumber(form.value, platformsAllStr.value, baseTokensAllStr.value)
  return getFilterNumber(pumpStore.pumpV3[props.activeChain][value]?.pumpFilter || {}, platformsAllStr.value, baseTokensAllStr.value)
}
</script>

<style scoped lang="scss">
.w-pumpFilter {
  .formItem {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }

  .inputRange {
    display: flex;

    .gap {
      display: inline-block;
      position: relative;
      margin: 0 8px;
      color: var(--third-text);
    }

    /* .el-input:first-child::after{
                    display: inline-block;
                    position: relative;
                    content: '～';
                    margin: 0 8px;
                } */
    /* .el-input{
                    width: 48%;
                } */
  }
}

.columns-form-item{
  justify-content: space-between;
  :deep(.el-form-item__content){
    flex: 0 1 auto;
    width: 300px;
  }
}

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

  &.hight {
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

.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--border);
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  height: 36px;

  button {
    border: none;
    // font-size: 14px;
    color: var(--third-text);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    border: 1ox solid var(--border);
    background: transparent;
    min-width: 36px;
    padding: 6px 6px;
    text-align: center;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      color: var(--main-text);
      background: var(--dialog-tab-active-bg);
    }
  }
}

.border {
  border: none;
  border-bottom: 1px solid var(--dialog-divider);
}

:deep().el-form-item__label {
  color: var(--secondary-text);
  height: 36px;
  line-height: 36px;
}

:deep(.el-form-item--small){
  margin-bottom: 12px;
}

:deep().el-checkbox__inner {
  --el-checkbox-input-width: 16px;
  --el-checkbox-input-height: 16px;
  border-color: var(--main-divider);
  border-radius: 4px;

}

:deep().el-checkbox__label {
  padding-left: 20px;
  color: var(--third-text);
}

:deep().el-input.el-input {
  --el-input-bg-color: var(--pump-filter-bg);
  --el-input-border-color: var(--pump-filter-bg);
  --el-input-border-radius: 4px;
  color: var(--main-text);

  .el-checkbox__inner {
    border-color: var(--border);
  }

  .el-input__wrapper {
    border: 0 none;
    background: var(--pump-filter-bg);

    &:hover {
      box-shadow: 0 0 0 1px #3F80F7 inset;
    }

    &.is-focus {
      border-color: #3F80F7;
      /* 蓝色 */
      box-shadow: 0 0 0 1px #3F80F7 inset;
    }

    .el-input__suffix {
      color: var(--third-text)
    }

    .el-input__inner {
      color: var(--main-text);

      &::placeholder {
        color: var(--third-text);
      }
    }
  }
}
.inline-form{
  :deep(.el-form-item){
    margin-bottom: 0;
  }
  :deep(.el-form-item__label){
    margin-bottom: 10px;
    line-height: 16px;
    height: 16px;
  }
}
</style>
