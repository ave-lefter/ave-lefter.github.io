<template>
  <el-drawer
    v-model="visible"
    class="[&&]:bg-[--dialog-bg]"
    :size="720"
    header-class="!mb-5 [&&]:color-[--main-text]"
  >
    <template #header>
      <span class="color-[--main-text]">钱包跟单</span>
    </template>
    <el-divider class="!m-0 !mb-5 !border-t-[--dialog-divider]" />
    <div class="px-20px">
      <div class="text-14px flex-start">
        <Icon name="custom:new-trade" class="text-12px mr-4px" />
        <span>新手跟单模版</span>
      </div>
      <div class="flex-between gap-16px mt-8px">
        <div
          class="item bg-[--border] px-12px py-12px rounded-8px"
          v-for="(item, $index) in strategyList"
          :key="$index"
        >
          <div class="flex-between text-14px">
            <span class="color-[--main-text]">{{ item.label }}</span>
            <a href="" class="!color-[--yellow]">一键应用</a>
          </div>
          <div class="color-[--secondary-text] text-12px mt-12px leading-[1.5]">
            {{ item.description }}
          </div>
        </div>
      </div>
      <el-form
        ref="formRef"
        class="hide-scrollbar"
        :model="form"
        label-width="auto"
        autocomplete="off"
        label-position="left"
        @submit.prevent
      >
        <el-scrollbar view-class="filter-height">
          <el-form-item label="钱包地址" label-position="top" prop="followAddress">
            <el-input v-model.trim="form.followAddress" clearable placeholder="请输入钱包地址" />
          </el-form-item>
          <el-form-item label="所属公链" label-position="top">
            <el-select style="width: 100%" :suffix-icon="SuffixIcon" v-model="form.chain" >
              <template #prefix>
                <ChainToken :chain="form.chain" :width="16" />
              </template>
              <el-option
                v-for="{ chain: _chain } in smartChains"
                :key="_chain"
                :label="getChainInfo(_chain)?.name"
                :value="_chain"
              >
                <div class="flex-start" style="gap: 4px">
                  <ChainToken :chain="_chain" :width="16" />
                  {{ getChainInfo(_chain)?.name }}
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟单方式" label-position="top" prop="buyType">
            <div class="tabs">
              <button
                v-for="item in tabs"
                :key="item.id"
                :class="{ active: item.id === form.buyType }"
                class="flex-start"
                type="button"
                @click.stop="form.buyType = item.id"
              >
                <span>{{ item.name || '' }}</span>
                <Icon
                  name="majesticons:question-mark-circle-line"
                  class="ml-4px text-10px color-[--third-text]"
                  v-tooltip="item.tip"
                />
              </button>
            </div>
          </el-form-item>
          <el-form-item label="" label-position="top" :prop="form.address">
            <template v-if="form.buyType === 2">
            <el-input v-model.trim="form.buyAmount" clearable placeholder="0.00">
              <template #suffix>
                <span>{{ getChainInfo(form.chain || '')?.main_name }}</span>
              </template>
            </el-input>
            </template>
            <template v-else-if="form.buyType === 3">
              <el-input v-model.trim="form.maxBuyRatio" clearable placeholder="固定比例">
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
              <el-input class="mt-10px" v-model.trim="form.buyAmount" clearable placeholder="最大买入金额">
                <template #suffix>
                  <span>{{ getChainInfo(form.chain || '')?.main_name }}</span>
                </template>
              </el-input>
            </template>
            <div class="flex-between w-full">
              <span class="text-12px color-[--main-text]"
                >≈$
                {{
                  formatNumber(
                    (currentUser?.price || 0) * Number(currentUser?.balance || 0),
                    1
                  )
                }}</span
              >
              <span class="text-12px color-[--third-text]"
                >可用余额: {{ formatNumber(currentUser?.balance || 0, 5) }}
                {{ getChainInfo(currentUser?.chain || '')?.main_name }}</span
              >
            </div>
          </el-form-item>
          <el-form-item label="卖出方式" label-position="top" :prop="chain">
            <el-select style="width: 100%" v-model="form.sellType">
              <el-option
                v-for="(item, $index) in sellTypeList"
                :key="$index"
                :label="item.name"
                :value="item.id"
              >
                {{ item.name }}
              </el-option>
            </el-select>
            <template v-if="form.sellType === 2">
              <el-input class="mt-10px" v-model.trim="form.takeProfitRatio" clearable placeholder="止盈比例">
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
              <el-input class="mt-10px" v-model.trim="form.stopLossRatio" clearable placeholder="止损比例">
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
            </template>
          </el-form-item>
          <el-form-item label="跳过已买入Token" label-position="left">
            <el-switch
              v-model="form.buyOnce"
              class="ml-auto"
              style="--el-switch-on-color: #3c6cf6; zoom: 0.9; height: 14px"
            />
          </el-form-item>
          <el-form-item>
            <div class="w-full">
              <div class="flex-between">
                <span class="text-16px">高级设置</span>
                <div
                  @click="isExpanded = !isExpanded"
                  class="flex-center cursor-pointer text-12px color-[--primary-color] ml-8px"
                >
                  <span>{{ isExpanded ? '收起' : '展开' }}</span>
                  <Icon
                    :name="isExpanded ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
                    class="text-16px"
                  />
                </div>
                <div class="flex-1"></div>
                <el-button class="reset" type="primary" @click.stop="reset">
                  <Icon
                    name="custom:refresh-left"
                    :class="resetLoading ? 'animate-spin' : ''"
                  />重置
                </el-button>
              </div>
              <transition name="fade" v-if="isExpanded">
                <div>
                  <div class="flex-start item">
                    <span class="flex-1">买入金额</span>
                    <el-input
                      v-model.trim.number="form.buy_min"
                      class="flex-1"
                      :placeholder="$t('minor')"
                      clearable
                      @blur="
                        (e) =>
                          handleBlur(
                            ['buy_min', 'buy_max'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            0
                          )
                      "
                      @input="
                        (val) => handleInput(['buy_min', 'buy_max'] as (keyof FormType)[], val, 0)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                    <span class="gap px-4px">~</span>
                    <el-input
                      v-model.trim.number="form.buy_max"
                      class="flex-1"
                      :placeholder="$t('max1')"
                      clearable
                      @blur="
                        (e) =>
                          handleBlur(
                            ['buy_min', 'buy_max'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            1
                          )
                      "
                      @input="
                        (val) => handleInput(['buy_min', 'buy_max'] as (keyof FormType)[], val, 1)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                  </div>
                  <div class="flex-start item mt-16px">
                    <span class="flex-1">代币市值</span>
                    <el-input
                      v-model.trim.number="form.buy_min"
                      class="flex-1"
                      :placeholder="$t('minor')"
                      clearable
                      @blur="
                        (e) =>
                          handleBlur(
                            ['buy_min', 'buy_max'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            0
                          )
                      "
                      @input="
                        (val) => handleInput(['buy_min', 'buy_max'] as (keyof FormType)[], val, 0)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                    <span class="gap px-4px">~</span>
                    <el-input
                      v-model.trim.number="form.buy_max"
                      class="flex-1"
                      :placeholder="$t('max1')"
                      clearable
                      @blur="
                        (e) =>
                          handleBlur(
                            ['buy_min', 'buy_max'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            1
                          )
                      "
                      @input="
                        (val) => handleInput(['buy_min', 'buy_max'] as (keyof FormType)[], val, 1)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                  </div>
                  <div class="flex-start item mt-16px">
                    <span class="flex-1">代币创建时间</span>
                    <el-input
                      v-model.trim.number="form.buy_min"
                      class="flex-1"
                      :placeholder="$t('minor')"
                      clearable
                      @blur="
                        (e) =>
                          handleBlur(
                            ['buy_min', 'buy_max'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            0
                          )
                      "
                      @input="
                        (val) => handleInput(['buy_min', 'buy_max'] as (keyof FormType)[], val, 0)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                    <span class="gap px-4px">~</span>
                    <el-input
                      v-model.trim.number="form.buy_max"
                      class="flex-1"
                      :placeholder="$t('max1')"
                      clearable
                      @blur="
                        (e) =>
                          handleBlur(
                            ['buy_min', 'buy_max'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            1
                          )
                      "
                      @input="
                        (val) => handleInput(['buy_min', 'buy_max'] as (keyof FormType)[], val, 1)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                  </div>
                  <div class="flex-start item mt-16px">
                    <span class="flex-1">跟单生效时间</span>
                    <el-input
                      v-model.trim.number="form.buy_min"
                      class="flex-1"
                      :placeholder="$t('minor')"
                      clearable
                      @blur="
                        (e) =>
                          handleBlur(
                            ['buy_min', 'buy_max'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            0
                          )
                      "
                      @input="
                        (val) => handleInput(['buy_min', 'buy_max'] as (keyof FormType)[], val, 0)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                    <span class="gap px-4px">~</span>
                    <el-input
                      v-model.trim.number="form.buy_max"
                      class="flex-1"
                      :placeholder="$t('max1')"
                      clearable
                      @blur="
                        (e) =>
                          handleBlur(
                            ['buy_min', 'buy_max'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            1
                          )
                      "
                      @input="
                        (val) => handleInput(['buy_min', 'buy_max'] as (keyof FormType)[], val, 1)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                  </div>
                </div>
              </transition>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="w-full">
              <div class="flex-between">
                <span class="text-14px">黑名单代币</span>
                <div class="flex-1"></div>
                <el-button class="reset !color-[--yellow]" type="primary">
                  查看全部
                  <Icon name="majesticons:arrow-right" />
                </el-button>
              </div>
              <div
                class="bg-#3F80F71A flex items-center justify-center gap-8px rounded-8px mt-8px color-[--primary-color] px-12px py-12px cursor-pointer"
              >
                <Icon name="majesticons:plus-circle-line" />添加代币
              </div>
              <span class="text-14px">自动取消与暂停</span>
              <div class="color-[--third-text] text-12px leading-16px">
                长时间资金不足且未交易，系统会默认该账户处于非活跃状态，会自动暂停策略执行
              </div>
              <span class="text-14px color-[--yellow] flex-start gap-4px mt-16px"
                ><Icon name="majesticons:info-circle" />提醒事项</span
              >
              <div class="color-[--yellow] text-12px leading-16px">
                长时间资金不足且未交易，系统会默认该账户处于非活跃状态，会自动暂停策略执行
              </div>
              <QuickSwapSet
                :chain="form.chain"
                :settingsButtonVisible="true"
              />
            </div>
          </el-form-item>
          <el-button type="primary" class="w-full mt-30px" size="large">确认</el-button>
        </el-scrollbar>
      </el-form>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import SuffixIcon from '~/components/suffixIcon.vue'
import { getChainInfo } from '@/utils'
import QuickSwapSet from './quickSwapSet.vue'
const route = useRoute()
const { t } = useI18n()
const botStore = useBotStore()
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])
interface FormType {
  buy_min: string
  buy_max: string
}
const form = ref({
  followAddress: '',
  buyType: 2, // 1:等比例买, 2:固定金额, 3:最大跟买
  buyAmount: null,
  maxBuyRatio: null,
  sellType: 1,//0:手动卖(不跟单卖), 1:自动跟卖, 2:止盈止损
  takeProfitRatio: null,
  stopLossRatio: null,
  buyOnce: false,
  source: "web",
  chain: 'bsc',
  buy_min: '',
  buy_max: '',
})
const isExpanded = shallowRef(false)
const resetLoading = shallowRef(false)
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const strategyList = ref([
  {
    label: '高频高倍数策略',
    value: 'high',
    description:
      '以更高交易频次获取短期价差。适用于能承受波动、追求效率与杠杆收益的用户。信号多、变化快，收益与风险同步放大。',
  },
  {
    label: '低频稳健策略',
    value: 'low',
    description:
      '以低频交易锁定中长期趋势。节奏慢、容错高，更强调稳定回报与风控。适合偏好稳健、抗波动能力较低的用户。',
  },
])
const chain = shallowRef('solana')
const active = ref('tag')
const smartChains = computed(() => {
  // 如果是自己的钱包地址且为 bot 钱包那么展示所有的链，链钱包后面再改
  if (botStore.evmAddress) {
    const botChains = botStore.userInfo?.addresses?.filter?.((el) =>
      SupportFullDataChain.includes(el.chain)
    )
    console.log('botChains', botChains)
    if (botChains && botChains.length > 0) {
      return botChains
    }
  }
  return [
    {
      chain: chain.value,
    },
  ]
})
const currentUser = computed(() => {
  return botStore?.userInfo?.addresses?.find?.((el) => form.value?.chain == el.chain)
})
const tabs = computed(() => {
  return [
    {
      name: '固定金额',
      id: 2,
      tip: '单次投资金额无论跟单目标地址买入多少金额，每次跟单时将按设定的固定数量进行买入',
    },
    {
      name: '最大跟买',
      id: 3,
      tip: ' 单次最大投资额若目标地址买入金额 ≥ 最大买入金额，以最大买入金额买入；若目标地址买入金额 < 最大买入金额，将按目标地址的买入金额进行跟单买入。',
    },
    {
      name: '等比例买入',
      id: 1,
      tip: '按比例跟买按设定比例进行买入。120% 表示按跟单买入金额的 1.2 倍进行买入。若您设置了最大买入金额，则跟单买入的最大值不会超过最大买入金额',
    },
  ]
})
const sellTypeList = computed(()=>{
  return[
    {
      name: '手动卖出',
      id: 0
    },
    {
      name: '自动跟卖',
      id: 1
    },
    {
      name: '止盈止损',
      id: 2,
    }
  ]
})
function reset() {
  resetLoading.value = true
  setTimeout(() => {
    resetLoading.value = false
  }, 500)
}
function handleInput(props: (keyof FormType)[], val: string, index: number) {
  const key = props[index]
  if (!key) return
  form.value[key] = val.replace(/-|[^\d.]/g, '')
}
function handleBlur(props: (keyof FormType)[], val: string, index: number) {
  const key = props[index] || ''
  if (form.value[key]) {
    if (index == 1) {
      if (!form.value[props[0]]) return
      if (Number.parseFloat(form.value[key]) <= Number.parseFloat(form.value[props[0]])) {
        form.value[key] = form.value[props[0]]
      }
    } else {
      if (!form.value[props[1]]) return
      if (Number.parseFloat(form.value[key]) >= Number.parseFloat(form.value[props[1]])) {
        // if (this.form[key] >= this.form[props[1]]) {
        form.value[key] = form.value[props[1]]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
:deep().el-input__wrapper {
  background: var(--border);
  padding: 0 12px;
  -el-input-inner-height: 48px;
  --el-input-inner-height: 48px;
}
:deep().el-select__wrapper {
  background: var(--border);
  min-height: 48px;
}
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--border);
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  height: 40px;
  width: 100%;

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
.reset {
  font-size: 12px;
  background: transparent;
  border: none;
  box-shadow: none;
  color: var(--secondary-text);
  padding: 0;
}
</style>
