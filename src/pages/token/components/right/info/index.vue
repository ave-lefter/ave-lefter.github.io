<template>
  <div class="px-15px pr-0 bg-[--secondary-bg] ">
    <div
      class="flex-start border-b border-b-solid border-[--d-151A22-l-E8F1FF] pb-12px mr-15px pt-12px cursor-pointer"
      @click="isExpand = !isExpand"
    >
      <span class="text-14px">{{ $t('baseInfo') }}</span>
      <Icon class="ml-4px" :name= " isExpand? 'material-symbols:keyboard-arrow-up': 'material-symbols:keyboard-arrow-down'" />
      <div class="flex-1"></div>
      <span v-if="countdown > 0" class="text-12px color-[--third-text1]" >{{ countdown }}s</span>
      <Icon v-else name="material-symbols:sync-outline" class="text-12px color-[--third-text1]" @click.stop.prevent="handleClick"/>
    </div>
    <div class="grid-container mt-12px mb-10px mr-15px" v-if="isExpand">
      <div class="item" @click="openHoler" :class="isNew ? 'cursor-pointer' : ''">
        <div class="text-12px color-[--secondary-text1] flex items-center justify-center">
          <Icon
            class="iconfont icon-rug mr-4px text-12px vertical-middle color-[--third-text1]"
            name="custom:holders"
          />
          <span class="color-[--third-text1]">{{
            formatNumber(token?.holders || 0, { limit: 10 })
          }}</span>
        </div>
        <span class="block color-[--third-text] mt-6px">{{ $t('holders') }}</span>
      </div>

      <div class="item cursor-pointer" @mouseover.stop="(e) => showBubbleTooltip(e)">
        <div
          class="text-12px color-[--secondary-text1] flex items-center justify-center"
          :style="{
            color:
              Number(formatNumber(tagsRatio?.top10_ratio || 0, 1)) == 0
                ? 'var(--third-text1)'
                : Number(tagsRatio?.top10_ratio) > 30
                  ? '#F6465D'
                  : '#12B886',
          }"
        >
          <Icon class="iconfont icon-rug mr-4px text-12px vertical-middle" name="custom:top3" />
          <span
            >{{
              Number(tagsRatio?.top10_ratio || 0) < 0.01 && Number(tagsRatio?.top10_ratio || 0) > 0
                ? '<0.01'
                : formatNumber(tagsRatio?.top10_ratio || 0, 1)
            }}%</span
          >
        </div>
        <span class="block color-[--third-text] mt-6px">TOP10</span>
      </div>

      <DevPop
        :style="{
          color:
            Number(formatNumber(tagsRatio?.dev_ratio || 0, 1)) == 0
              ? 'var(--third-text1)'
              : Number(tagsRatio?.dev_ratio) > 5
                ? '#F6465D'
                : '#12B886',
        }"
        :tokenId="address + '-' + chain"
      >
        <div class="item cursor-pointer">
          <div class="text-12px flex items-center justify-center">
            <template
              v-if="
                tagsRatio?.max_dev_ratio !== null &&
                tagsRatio?.max_dev_ratio !== undefined &&
                Number(tagsRatio?.max_dev_ratio) !== 0 &&
                Number(tagsRatio?.dev_ratio) == 0
              "
            >
              <Icon
                class="iconfont icon-TOP text-12px mr-4px color-[--x-blue]"
                name="custom:dev-ds"
              />
              <span class="color-[--x-blue]">DS</span>
            </template>
            <template v-else>
              <Icon class="iconfont icon-TOP text-12px mr-4px" name="custom:dev-ds" />
              <span
                >{{
                  formatNumber(
                    Number(tagsRatio?.dev_ratio) >= 0.1
                      ? tagsRatio?.dev_ratio || 0
                      : Number(tagsRatio?.dev_ratio) == 0
                        ? '0'
                        : '<0.1',
                    1
                  )
                }}%
              </span>
            </template>
            <img
              v-if="tagsRatio?.dev_first_transfer_in_from_label"
              class="w-12px h-12px cursor-pointer rounded-full ml-4px"
              :src="formatIconPumpDev(tagsRatio?.dev_first_transfer_in_from_label)"
              alt=""
            />
            <span v-if="tagsRatio?.dev_age_seconds" class="ml-4px color-[--secondary-text]">{{
              formatSeconds(Number(tagsRatio?.dev_age_seconds || 0))
            }}</span>
          </div>
          <span class="block color-[--third-text] mt-6px">DEV</span>
        </div>
      </DevPop>

      <HolderRank
        :tokenId="address + '-' + chain"
        :type="19"
        :ratio="Number(tagsRatio?.sniper_balance_ratio_cur || 0)"
      >
        <div class="item cursor-pointer">
          <div
            class="text-12px color-[--secondary-text1] flex items-center justify-center"
            :style="{
              color:
                Number(formatNumber(tagsRatio?.sniper_balance_ratio_cur || 0, 1)) == 0
                  ? 'var(--third-text1)'
                  : Number(tagsRatio?.sniper_balance_ratio_cur) > 5
                    ? '#F6465D'
                    : '#12B886',
            }"
          >
            <Icon class="iconfont icon-rug mr-4px text-12px vertical-middle" name="custom:gun1" />
            <span
              >{{
                formatNumber(
                  Number(tagsRatio?.sniper_balance_ratio_cur) > 0.001
                    ? tagsRatio?.sniper_balance_ratio_cur || 0
                    : 0,
                  1
                )
              }}%</span
            >
          </div>
          <span class="block color-[--third-text] mt-6px">{{ $t('sniper2') }}</span>
        </div>
      </HolderRank>
      <HolderRank
        :tokenId="address + '-' + chain"
        :type="16"
        :ratio="Number(tagsRatio?.rat_ratio || 0)"
      >
        <div class="item cursor-pointer">
          <div
            class="text-12px color-[--secondary-text1] flex items-center justify-center"
            :style="{
              color:
                Number(formatNumber(tagsRatio?.rat_ratio || 0, 1)) == 0
                  ? 'var(--third-text1)'
                  : Number(tagsRatio?.rat_ratio) > 5
                    ? '#F6465D'
                    : '#12B886',
            }"
          >
            <Icon class="iconfont icon-rug mr-4px text-12px vertical-middle" name="custom:insider1" />
            <span
              >{{
                formatNumber(Number(tagsRatio?.rat_ratio) > 0.001 ? tagsRatio?.rat_ratio || 0 : 0, 1)
              }}%</span
            >
          </div>
          <span class="block color-[--third-text] mt-6px">{{ $t('insiders') }}</span>
        </div>
      </HolderRank>
      <HolderRank
        :tokenId="address + '-' + chain"
        :type="36"
        :ratio="Number(tagsRatio?.address_binding_ratio || 0)"
      >
        <div class="item cursor-pointer">
          <div
            class="text-12px color-[--secondary-text1] flex items-center justify-center"
            :style="{
              color:
                Number(formatNumber(tagsRatio?.address_binding_ratio || 0, 1)) == 0
                  ? 'var(--third-text1)'
                  : Number(tagsRatio?.address_binding_ratio) > 5
                    ? '#F6465D'
                    : '#12B886',
            }"
          >
            <Icon class="iconfont icon-rug mr-4px text-12px vertical-middle" name="custom:binding" />
            <span
              >{{
                formatNumber(
                  Number(tagsRatio?.address_binding_ratio) > 0.001
                    ? tagsRatio?.address_binding_ratio || 0
                    : 0,
                  1
                )
              }}%</span
            >
          </div>
          <span class="block color-[--third-text] mt-6px">{{ $t('Bundle') }}</span>
        </div>
      </HolderRank>
      <HolderRank
        :tokenId="address + '-' + chain"
        :type="31"
        :ratio="Number(tagsRatio?.kol_ratio || 0)"
      >
        <div class="item cursor-pointer">
          <div
            class="text-12px color-[--secondary-text1] flex items-center justify-center"
            :style="{ color: tagsRatio?.kol_count > 0 ? 'var(--yellow)' : 'var(--third-text1)' }"
          >
            <Icon class="iconfont icon-rug mr-4px text-12px vertical-middle" name="custom:kol2" />
            <span>{{ formatNumber(tagsRatio?.kol_count || 0, 2) }}</span>
          </div>
          <span class="block color-[--third-text] mt-6px">KOL</span>
        </div>
      </HolderRank>

      <HolderRank
        :tokenId="address + '-' + chain"
        :type="30"
        :ratio="Number(tagsRatio?.smart_wallet_ratio || 0)"
      >
        <div class="item cursor-pointer">
          <div
            class="text-12px color-[--secondary-text1] flex items-center justify-center"
            :style="{ color: tagsRatio?.smart_wallet_count > 0 ? 'var(--yellow)' : 'var(--third-text1)' }"
          >
            <Icon class="iconfont icon-rug mr-4px text-12px vertical-middle" name="custom:smart-plain" />
            <span>{{ formatNumber(tagsRatio?.smart_wallet_count || 0, 2) }}</span>
          </div>
          <span class="block color-[--third-text] mt-6px">{{ $t('smarter') }}</span>
        </div>
      </HolderRank>
    </div>
  </div>
</template>
<script lang="ts" setup>
import DevPop from '@/pages/pump/components/devPop/index.vue'
import HolderRank from './holderRank/index.vue'
import { SupportFullDataChain } from '@/utils/constants'
const props = defineProps({
  tagsRatio: {
    type: Object,
  },
})
const route = useRoute()
const router = useRouter()
const { clickHolderCount, popVisible } = storeToRefs(useGlobalStore())
const { token } = storeToRefs(useTokenStore())
const { $createTooltip } = useNuxtApp()
const $tooltip = $createTooltip('bubble--tooltip')
const isExpand = shallowRef(true)
const countdown = ref(0)
const isDisabled = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const id = computed(() => route.params.id as string)
const chain = computed(() => {
  const { chain } = getAddressAndChainFromId(id.value, 0)
  return chain
})
const address = computed(() => {
  const { address } = getAddressAndChainFromId(id.value, 0)
  return address
})

const isNew = computed(() => {
  const { chain } = getAddressAndChainFromId(id.value, 0)
  return SupportFullDataChain.includes(chain)
})
function showBubbleTooltip(e: MouseEvent) {
  $tooltip.show({
    content: `<iframe
                  style='width:400px; height:400px;  border:none; overflow: hidden;'
                  src='https://app.insightx.network/bubblemaps/${chain.value === 'bsc' ? 56 : chain.value}/${address.value}?embed_id=9Pt12qHMl1KDeK'
                  allow='clipboard-write'
                ></iframe>`,
    target: e.target as HTMLElement,
    props: {
      showArrow: false,
      rawContent: true,
      placement: 'top',
      trigger: 'hover',
      'popper-class': 'x--tooltip',
      'onUpdate:visible': (v: boolean) => {
        if (v) return
        $tooltip.hide()
      },
    },
  })
}
function openHoler() {
  if (isNew.value) {
    clickHolderCount.value++
    popVisible.value = true
  }
}
const emits = defineEmits<{
   (e: 'getTagsRatio', isTrue: boolean): void
}>()
function handleClick() {
  if (isDisabled.value) return
   emits('getTagsRatio',true)
  // 启动倒计时
  startCountdown(10)
}
const startCountdown = (seconds: number) => {
  countdown.value = seconds
  isDisabled.value = true

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
      isDisabled.value = false
    }
  }, 1000)
}
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  .item {
    background-color: var(--main-input-button-bg);
    padding: 10px;
    font-size: 12px;
    text-align: center;
    border-radius: 4px;
  }
}
</style>
