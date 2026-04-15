<script setup lang="ts">
import {getTxsUserBrief} from '~/api/token'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { addAttention2, deleteAttention } from '~/api/attention'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  virtualRef: {
    type: HTMLElement,
    default: null
  },
  currentRow: {
    type: Object,
    default: () => ({})
  },
  addressAndChain: {
    type: Object,
    default: () => ({})
  },
  modelValue: Boolean
})
const themeStore = useThemeStore()
// const visible = shallowRef(false)
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emit('update:modelValue', val)
  }
})
const isLoading = shallowRef(false)
const userBriefData = ref()
const attentionKey = ref(0)

// 缓存请求结果，最多 50 个
interface CacheItem {
  data: any
  timestamp: number
}
const requestCache = new Map<string, CacheItem>()
const CACHE_MAX_SIZE = 50
const CACHE_EXPIRE_TIME = 60 * 60 * 1000 // 1 小时（毫秒）

// 生成缓存 key
function getCacheKey(user_address: string, chain: string, token: string): string {
  return `${user_address}_${chain}_${token}`
}

// 检查缓存是否过期
function isCacheExpired(cacheItem: CacheItem): boolean {
  return Date.now() - cacheItem.timestamp > CACHE_EXPIRE_TIME
}

// 管理缓存大小，超过 50 个时删除最早的
function manageCacheSize() {
  // 使用 while 循环确保删除到不超过 50 个
  while (requestCache.size > CACHE_MAX_SIZE) {
    const firstKey = requestCache.keys().next().value
    if (firstKey) {
      requestCache.delete(firstKey)
    } else {
      break
    }
  }
}

// 清理过期的缓存
function cleanExpiredCache() {
  const now = Date.now()
  const expiredKeys: string[] = []
  
  // 先收集所有过期的 key
  for (const [key, cacheItem] of requestCache.entries()) {
    if (now - cacheItem.timestamp > CACHE_EXPIRE_TIME) {
      expiredKeys.push(key)
    }
  }
  
  // 再统一删除，避免遍历时修改 Map
  expiredKeys.forEach(key => {
    requestCache.delete(key)
  })
}

watch(() => props.currentRow?.wallet_address||'', () => {
  if (props.currentRow) {
    _getTxsUserBrief()
  }
})

const botStore = useBotStore()
const walletStore = useWalletStore()

// 组件卸载时清理缓存
onUnmounted(() => {
  requestCache.clear()
})

async function _getTxsUserBrief() {
  const data = {
    user_address: props.currentRow.wallet_address,
    self_address: (botStore?.userInfo?.evmAddress || walletStore.address) as string,
    chain: props.addressAndChain.chain,
    token: props.addressAndChain.address
  }
  
  // 生成缓存 key
  const cacheKey = getCacheKey(data.user_address, data.chain, data.token)
  
  // 检查缓存是否存在且未过期
  if (requestCache.has(cacheKey)) {
    const cachedItem = requestCache.get(cacheKey)!
    if (!isCacheExpired(cachedItem)) {
      userBriefData.value = cachedItem.data
      return
    } else {
      // 缓存已过期，删除
      requestCache.delete(cacheKey)
    }
  }
  
  isLoading.value = true
  try {
    const res = await getTxsUserBrief(data)
    if (res) {
      const result = {
        ...res,
        ratio: Number(res.history_max_balance_amount) > 0
          ? Math.min(new BigNumber(res.balance_amount)
              .dividedBy(new BigNumber(res.history_max_balance_amount))
              .multipliedBy(100).toNumber()
            , 100)
          : 0,
        // isLoad
        isLoading: (res.total_sold_usd === '') && (res.total_purchase_usd === ''),
      }
      
      // 存入缓存，记录时间戳
      requestCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })
      
      // 先清理过期缓存，再管理缓存大小
      cleanExpiredCache()
      manageCacheSize()
      
      userBriefData.value = result
    }
  } catch (e) {
    console.log('=>(markerTooltip.vue:38) e', e)
  } finally {
    isLoading.value = false
  }
}

const attentionTriggerRef = ref()
const globalStore = useGlobalStore()
// const tokenDetailStore = useTokenDetailsStore()
const { t } = useI18n()

const collect = async () => {
  if(!useFollowStore().currentAddress){
    useBotStore().changeConnectVisible(true)
  }
  if (useWalletStore().address && !useWalletStore().walletSignature[useWalletStore().address]) {
    await useWalletStore().signMessageForFavorite()
  }
  const currentRow = props.currentRow
  if(currentRow.is_wallet_address_fav !== 1){
    useFollowStore().confirmAttention(attentionTriggerRef.value,currentRow.chain, (form) => {
      console.log('confirmAttention', form)
      return addAttention2({
        address: useFollowStore().currentAddress,
        user_address: currentRow.wallet_address,
        user_chain: currentRow.chain,
        group: form.group,
        is_monitored: form.is_monitored,
      }).then((res) => {
        currentRow.is_wallet_address_fav = 1
        attentionKey.value++
        globalStore.getFollowsNum()
        // getList()
        return Promise.resolve(res)
      }).catch((err) => {
        return Promise.reject(err)
      })
    })
    return
  }
  // loading.value = true
  deleteAttention({
    address: useFollowStore().currentAddress,
    user_address: currentRow.wallet_address,
    user_chain: currentRow.chain
  }).then(() => {
    globalStore.getFollowsNum()
    currentRow.is_wallet_address_fav = 0
    attentionKey.value++
    ElMessage.success( t('attention1Canceled'))
    // getList()
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
    // loading.value = false
  })
}

</script>

<template>
  <el-tooltip
    ref="tooltipRef"
    v-model:visible="visible"
    placement="left"
    :virtual-ref="virtualRef"
    virtual-triggering
    trigger="hover"
    raw-content
    :persistent="false"
    popper-class="[&&]:p-12px [&&]:[--el-text-color-primary:--dialog-bg]!"
    style="--el-text-color-primary:var(--d-222-l-FFF)"
  >
    <template #content>
      <el-skeleton
        v-if="!userBriefData || userBriefData.isLoading || isLoading"
        animated
        class="relative inline-block [&&]:w-210px text-12px font-400 box-border px-4px py-6px"
      >
        <template #template>
          <el-skeleton-item v-for="i in 10" :key="i" variant="p" style="width: 100%"/>
        </template>
      </el-skeleton>
      <div v-else :key="attentionKey" class="flex flex-col gap-6px w-210px color-[--main-text]">
        <div class="flex gap-6px items-center">
          <UserAvatar
            class="relative"
            :chain="props.currentRow.chain"
            :address="props.currentRow.address"
            icon-size="20px"
          />
          <UserRemark
            :canEdit="true"
            :remark="props.currentRow.remark"
            :address="props.currentRow.wallet_address"
            :chain="props.currentRow.chain"
            :wallet_logo="props.currentRow.wallet_logo"
            :popoverProps="{placement: 'bottom'}"
            class="color-[--d-CCC-l-333]"
            :appendTo="1"
            :formatAddress="(address: string) => address.slice(0, 4) + '...' + address.slice(-4)"
          />
          <Icon ref="attentionTriggerRef" name="custom:attention"
              :class="props.currentRow.is_wallet_address_fav === 1 ? 'color-[#F45469]' : 'color-[--third-text]'" class="h-16px w-16px clickable shrink-0" @click.stop.prevent="collect()" />
          <Icon v-copy="props.currentRow.wallet_address" name="bxs:copy" class="cursor-pointer color-[--third-text] text-14px"/>
          <slot/>
        </div>
        <div class="flex justify-between">
          <span class="color-[--secondary-text]">{{ $t('position1') }}:</span>
          <div>
            <span class="color-[--third-text]">({{
              formatNumber(userBriefData.balance_amount || 0, 3)
              }}/{{
                formatNumber(userBriefData.history_max_balance_amount || 0, 3)
              }})</span > <span class="color-[--main-text]">${{ formatNumber(userBriefData.balance_usd || 0, 2) }}</span>
            <el-progress
              color="var(--main-text)"
              :show-text="false"
              :percentage="userBriefData.ratio || 0"
              :stroke-width="4"
            />
          </div>
        </div>
        <div class="flex justify-between">
          <span class="color-[--secondary-text]">{{ $t('profit2') }}:</span>
          <span :class="`${getColorClass(userBriefData.total_profit)}`">
            <template v-if="userBriefData.total_profit==='0'">--</template>
            <template v-else>
              {{ addSign(userBriefData.total_profit) }}${{
                formatNumber(Math.abs(userBriefData.total_profit), 1)
              }}
            </template>
          </span>
        </div>
        <div class="flex justify-between">
          <span class="color-[--secondary-text]">{{ $t('unrealized_profit') }}:</span>
          <span :class="`${getColorClass(userBriefData.unrealized_profit)}`">
            <template v-if="userBriefData.unrealized_profit==='0'">--</template>
            <template v-else>
              {{ addSign(userBriefData.unrealized_profit) }}${{
                formatNumber(Math.abs(userBriefData.unrealized_profit), 1)
              }}
            </template>
          </span>
        </div>
        <div class="flex justify-between whitespace-nowrap">
          <span class="color-[--secondary-text]">{{ $t('totalBuy2') }}
          <template
            v-if="userBriefData.total_purchase!=='--'&&Number.parseFloat(userBriefData.total_purchase)!==0">
            ({{ userBriefData.total_purchase }})
          </template>:</span>
          <span>
             <span class="color-[--third-text] mr-10px">{{
                 userBriefData.total_purchase_amount
                   ? formatNumber(userBriefData.total_purchase_amount, 2)
                   : '--'
               }}</span>
            <span class="color-#12B886">{{
                userBriefData.total_purchase_usd ? `$${formatNumber(userBriefData.total_purchase_usd, 2)}` : '--'
              }}</span>
         </span>
        </div>
        <div class="flex justify-between whitespace-nowrap">
          <span class="color-[--secondary-text]">{{ $t('totalSell2') }}
          <template
            v-if="userBriefData.total_sold!=='--'&&Number.parseFloat(userBriefData.total_sold)!==0">
            ({{ userBriefData.total_sold }})
          </template>:</span>
          <span>
             <span class="color-[--third-text] mr-10px">{{
                 userBriefData.total_sold_amount
                   ? formatNumber(userBriefData.total_sold_amount, 2)
                   : '--'
               }}</span>
            <span class="color-#F6465D">{{
                userBriefData.total_sold_usd ? `$${formatNumber(userBriefData.total_sold_usd, 2)}` : '--'
              }}</span>
         </span>
        </div>
        <el-divider
          class="[--el-border-color:--dialog-divider]"
          style="margin:0"
        />
        <div class="flex justify-between">
          <span class="color-[--secondary-text]">7D {{ $t('winRate2') }}:</span>
          <span class="color-#12B886">{{ formatNumber(userBriefData.win_ratio, 1) }}%</span>
        </div>
        <div class="flex justify-between">
          <span class="color-[--secondary-text]">7D {{ $t('profit2') }}:</span>
          <span :class="`${getColorClass(userBriefData.profit)}`">
            <template v-if="userBriefData.profit==='0'">--</template>
            <template v-else-if="userBriefData.profit<0">-</template>${{
              formatNumber(Math.abs(userBriefData.profit,), 2)
            }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="color-[--secondary-text]">7D {{ $t('token') }}:</span>
          <span class="color-[--third-text]">{{ formatNumber(userBriefData.token_txns) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="color-[--secondary-text]">{{ $t('walletAge') }}:</span>
          <TimerCount
            v-if="userBriefData.wallet_age && Number(formatTimeFromNow(userBriefData.wallet_age,true)) < 60"
            :key="userBriefData.wallet_age"
            :timestamp="Number(userBriefData.wallet_age)"
            :end-time="60"
          >
            <template #default="{seconds}">
              <span class="color-[--third-text]">
                <template v-if="seconds<60">
                  {{ seconds }}{{ $t('ss') }}
                </template>
                <template v-else>
                  {{ dayjs(userBriefData.wallet_age * 1000).fromNow() }}
                </template>
              </span>
            </template>
          </TimerCount>
          <span v-else class="color-[--third-text]">
            {{
              !!Number(userBriefData.wallet_age || 0)
                ? dayjs(userBriefData.wallet_age * 1000).fromNow()
                : '--'
            }}
          </span>
        </div>
        <el-divider
          class="[--el-border-color:--dialog-divider]"
          style="margin:0"
        />
        <div v-if="userBriefData.top3_blue_chip?.length > 0">
          <div class="color-[--secondary-text] lh-16px mb-8px">TOP3 {{ $t('blueChips') }}:</div>
          <div class="flex-wrap flex items-center gap-x-20px gap-y-6px">
            <NuxtLink
              v-for="(item) in userBriefData.top3_blue_chip"
              :key="item.token"
              class="flex items-center [&&]:color-[--secondary-text]"
              :to="`/token/${item.token}-${item.chain}`"
              @click.self="visible=false"
            >
              <TokenImg
                :row="{
                  logo_url: item.logoUrl,
                }"
                token-class="w-16px h-16px [&&]:mr-0 color-[--secondary-text]"
              />
              <span class="ml-4px">{{ item.symbol }}</span>
            </NuxtLink>
          </div>
        </div>
        <div class="flex justify-center my-12px">
          <img v-if="themeStore.isDark" src="@/assets/images/aveai.svg" alt="" class="h-14px">
          <img v-else src="@/assets/images/aveai-b.svg" alt="" class="h-14px">
        </div>
      </div>
    </template>
  </el-tooltip>
</template>

<style scoped>

</style>
