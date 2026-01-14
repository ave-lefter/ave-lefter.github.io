<script setup lang="ts">
import SignalContainer from './components/signal/signalContainer.vue'
import Filter from './components/signal/filter.vue'
import { useStorage } from '@vueuse/core'
import type { ChainKey } from '~/api/types/pump'
const Version = 1
const { t } = useI18n()

const configStore = useConfigStore()
const localeStore = useLocaleStore()
const globalStore = useGlobalStore()

const signalContainerRef =
  useTemplateRef<InstanceType<typeof SignalContainer>>('signalContainerRef')
const smartChains = computed(() => {
  return ['solana', 'bsc'].map((value) => {
    return {
      label: getChainInfo(value)?.name,
      value,
    }
  })
})
const activeChain = useStorage<ChainKey>('signal_active_chain', 'bsc')

const audioVisible = ref(false)
const showResetBtn = shallowRef(false)
// token: 筛选 token
// history_count：筛选信号数，对应值2, 5, 15
// 市值：mc_curr，市值过滤，
// 市值方向：mc_curr_sign， 默认 > 大于号，可选 <
const defaultSignalFilter = {
  token: '',
  history_count: undefined as undefined | number,
  mc_curr: undefined as undefined | number,
  mc_curr_sign: '<',
}
const signalFilter = useStorage('signalParams', {
  ...defaultSignalFilter,
})

function onReset() {
  signalFilter.value = { ...defaultSignalFilter }
}
function onConfirm(_filterParams: typeof defaultSignalFilter) {
  signalFilter.value = { ..._filterParams }
}
const quickBuyValue = useStorage('quickBuyValue', '0.01')
function setActiveChain(value: string) {
  if (value !== activeChain.value) {
    signalContainerRef.value?.setFilterToken?.('')
    signalFilter.value.token=''
  }
  activeChain.value = value
}
</script>

<template>
  <div class="w-full bg-[--main-bg]">
    <div class="p-12px flex-start">
      <div class="flex h-28px">
        <div
          class="px-8px py-2px rounded-4px gap-4px bg-[--main-input-button-bg] flex color-[--third-text]"
        >
          <div
            v-for="{ value } in smartChains"
            :key="value"
            class="flex items-center justify-center p-2px rounded-4px cursor-pointer"
            :class="`${activeChain === value ? 'bg-[--tab-active-bg] color-[--main-text]' : ''}`"
            @click="setActiveChain(value)"
          >
            <img
              class="w-20px h-20px rounded-full opacity-60 block"
              :src="`${configStore.token_logo_url}chain/${value}.png`"
              alt=""
            >
          </div>
        </div>
        <div class="flex items-center mr-24px">
          <QuickSwapSet
            v-model:quickBuyValue="quickBuyValue"
            :chain="activeChain"
            style="margin-left: 20px"
            :showQuickAmount="false"
          />
          <AutoSellSetting class="ml-8px" :chain="activeChain" />

          <Filter :filter-params="signalFilter" @onReset="onReset" @onConfirm="onConfirm" />
          <el-popover
            v-model:visible="audioVisible"
            trigger="click"
            popper-class="el-select__popper"
          >
            <template #reference>
              <div class="flex items-center text-12px ml-20px color-[--main-text] cursor-pointer">
                <Icon
                  :name="globalStore.audioSettings.audio.signal ? 'custom:ad' : 'custom:admute'"
                  class="text-16px mr-4px color-[--secondary-text]"
                />
                {{ $t('NewSignalAlert') }}
              </div>
            </template>
            <template #default>
              <ul class="el-scrollbar__view el-select-dropdown__list [&&]:m--12px">
                <li
                  v-for="item in audioList"
                  :key="item"
                  class="el-select-dropdown__item hover:bg-[--border]"
                  :class="{ 'bg-[--border]': globalStore.audioSettings.audio.signal === item }"
                  @click="
                    () => {
                      globalStore.audioSettings.audio.signal = item
                      audioVisible = false
                    }
                  "
                >
                  <span class="text-12px">{{ item || $t('close') }}</span>
                </li>
              </ul>
            </template>
          </el-popover>
          <div class="flex items-center text-12px ml-20px color-[--main-text]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="7" cy="7" r="7" fill="#349EFF" />
              <path
                d="M6.0594 9.56109L6.165 7.96635L9.06051 5.3572C9.18895 5.24065 9.03435 5.18405 8.86453 5.28584L5.29021 7.54394L3.74422 7.05398C3.41267 6.95979 3.40886 6.72979 3.81986 6.56402L9.84088 4.24123C10.1161 4.11684 10.3801 4.30902 10.2745 4.73119L9.24913 9.56085C9.1773 9.90406 8.97013 9.98683 8.68353 9.82867L7.12256 8.67512L6.3724 9.40245C6.28559 9.48926 6.214 9.56085 6.0594 9.56085V9.56109Z"
                fill="white"
              />
            </svg>
            <a
              v-if="!['zh-cn', 'zh-tw'].includes(localeStore.locale)"
              href="https://t.me/AveSignalMonitor"
              target="_blank"
              class="ml-1 underline"
            >
              TG {{ $t('Subscription') }}
            </a>
            <a v-else href="https://t.me/AveSignalMonitorCN" target="_blank" class="underline ml-1">
              TG{{ $t('Subscription') }}
            </a>
          </div>
          <div
            v-show="showResetBtn"
            class="flex items-center text-12px gap-2px cursor-pointer mr-20px color-[--main-text]"
            @click="signalContainerRef?.setFilterToken?.('')"
          >
            <Icon name="custom:reset" class="text-14px" />
            {{ $t('reset') }}
          </div>
        </div>
      </div>
    </div>

    <SignalContainer
      ref="signalContainerRef"
      v-model:showResetBtn="showResetBtn"
      :activeChain="activeChain"
      :quickBuyValue="quickBuyValue"
      :filterParams="signalFilter"
    />
  </div>
</template>

<style scoped lang="scss">
.active {
  background: #3f80f7;
  color: #f5f5f5;
}
.interval-btns {
  display: flex;
  align-items: center;
  margin-left: 12px;
  background: var(--d-222-l-F2F2F2);
  padding: 4px;
  .interval-btn {
    font-size: 12px;
    color: var(--d-666-l-999);
    text-align: center;
    font-weight: 500;
    line-height: 16px;
    text-decoration: none;
    padding: 5px 10px;
    border-color: transparent !important;
    border-radius: 4px;
    &.active-interval {
      color: #fff;
      background: var(--d-111-l-FFF);
    }
  }
}
</style>
