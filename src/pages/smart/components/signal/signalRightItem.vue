<script setup lang="ts">
import type {GetSignalV2ListResponse, IActionItem, IActionV3Item} from '~/api/signal'
import QuickSwapButton from '~/components/quickSwap/quickSwapButton.vue'
import UserAvatar from '~/components/userAvatar.vue'

const props = withDefaults(defineProps<{
  footer?: boolean,
  item: GetSignalV2ListResponse<IActionItem | IActionV3Item>,
  isWalletAll?: boolean
  filterToken?: string
  filter?: (token: string) => void
  activeChain: string
  quickBuyValue?: string
}>(), {
  footer: true,
  filterToken: '',
  filter: () => {
  },
  quickBuyValue: '0.01'
})
const emit = defineEmits(['openDrawer'])
const localeStore = useLocaleStore()
const themeStore = useThemeStore()

function getGradientBackground(history_count: number) {
  if (history_count >= 5) {
    if (themeStore.isDark) {
      return 'bg-[linear-gradient(273.55deg,#12B88633_1.62%,#12B88699_99.73%)]'
    }
    return 'bg-[linear-gradient(273.55deg,#12B886_1.62%,#12B88699_99.73%)] color-#FFF'
  }
  return 'bg-[--d-12B8861A-l-12B8862A]'
}

const increasedOrDecreased = computed(() => {
  return {
    increase: Number(props.item.mc_cur) > Number(props.item.mc),
    decrease: Number(props.item.mc_cur) < Number(props.item.mc)
  }
})

const tokenDetailSStore = useTokenDetailsStore()

function openTokenDetail(el: IActionItem | IActionV3Item) {
  tokenDetailSStore.$patch({
    drawerVisible: true,
    tokenInfo: {
      id: props.item.token + '-' + props.activeChain,
      symbol: props.item.symbol,
      logo_url: props.item.logo,
      chain: props.activeChain,
      address: props.item.token,
      remark: ''
    },
    pairInfo: {
      target_token: props.item.token,
      token0_address: el.quote_token_address,
      token0_symbol: el.quote_token_symbol,
      token1_symbol: props.item.symbol,
      pairAddress: ''
    },
    user_address: el.wallet_address
  })
}
</script>

<template>
  <div class="w-454px bg-[--d-111-l-FFF] p-12px rounded-8px flex flex-col">
    <div class="flex justify-between">
      <div class="flex flex-1 flex-col gap-12px">
        <div class="flex items-center gap-8px">
          <div
            class="cursor-pointer"
            @click="navigateTo(`/token/${item.token}-${item.chain}`)"
          >
            <TokenImg
              token-class="w-36px h-36px"
              chain-class="w-14px h-14px"
              :row="{
                  symbol:item.symbol,
                   chain:item.chain,
                   logo_url:item.logo
                }"
            />
          </div>
          <div>
            <div class="flex mb-2px items-center">
              <span
                class="text-16px font-500 color-[--d-F5F5F5-l-333] mr-8px cursor-pointer"
                @click="navigateTo(`/token/${item.token}-${item.chain}`)"
              >{{ item.symbol }}</span>
              <div
                class="mr-4px w-12px h-12px rounded-2px bg-[--d-1A1A1A-l-F2F2F2] flex items-center justify-center">
                <img
                  v-if="item.issue_platform"
                  v-tooltip="item.issue_platform"
                  :src="formatIconTag(item.issue_platform)"
                  width="10"
                  height="10"
                  class="rounded-full"
                  alt=""
                >
              </div>
              <a
                class="mr-4px w-12px h-12px rounded-2px bg-[--d-1A1A1A-l-F2F2F2] flex items-center justify-center text-10px [&&]:color-[--d-666-l-999]"
                :href="`https://x.com/search?q=($${item.symbol} OR ${item.token})&src=typed_query&f=live`"
                target="_blank"
              >
                <Icon
                  name="hugeicons:search-01"
                />
              </a>
            </div>
            <div class="flex items-center color-[--d-666-l-999] gap-4px">
              <div v-tooltip="formatDate(item.token_create_time,'MM/DD HH:mm:ss')">
                <TimerCount
                  v-if="item.token_create_time && Number(formatTimeFromNow(item.token_create_time, true)) < 60"
                  :key="item.token_create_time" :timestamp="item.token_create_time" :end-time="60">
                  <template #default="{ seconds }">
                  <span v-if="seconds < 60" class="color-#FFA622 text-12px">
                    {{ seconds }}s
                  </span>
                    <span v-else class="color-[--d-999-l-666] text-12px">
                    {{ formatTimeFromNow(item.token_create_time) }}
                  </span>
                  </template>
                </TimerCount>
                <div v-else class="color-[--d-999-l-666] text-12px">
                  {{ formatTimeFromNow(item.token_create_time) }}
                </div>
              </div>
              <span
                v-copy="item.token"
                class="text-12px cursor-pointer">{{
                  item.token.slice(0, 4)
                }}...{{ item.token.slice(-4) }}</span>
              <Icon v-copy="item.token" name="bxs:copy" class="cursor-pointer text-12px"/>
              <a
                :href="item.twitter_url"
                target="_blank"
                class="mr-4px w-12px h-12px rounded-2px bg-[--d-1A1A1A-l-F2F2F2] flex items-center justify-center"
              >
                <Icon name="custom:twitter" class="text-10px"/>
              </a>
            </div>
          </div>
        </div>
        <el-row class="text-12px">
          <el-col :span="9">
            <div class="color-[--d-666-l-999] mb-4px">{{ $t('24Volume') }}</div>
            <div class="color-[--d-F5F5F5-l-333]">
              ${{ formatNumber(item.tx_volume_u_24h || 0, 1) }}
            </div>
          </el-col>
          <el-col
            :span="15"
            class="[&&]:flex items-center"
          >
            <div>
              <div class="color-[--d-666-l-999] mb-4px">
                {{ $t('AlertMC') }}
              </div>
              <div class="flex items-center color-[--d-F5F5F5-l-333]">
                ${{ formatNumber(item.mc, 1) }}
                <Icon
                  name="material-symbols:arrow-right-alt"
                  class="mx-12px color-#999"
                />
              </div>
            </div>
            <div>
              <div class="color-[--d-666-l-999] mb-4px">
                {{ $t('CurrentMC') }}
              </div>
              <div class="flex items-center gap-4px color-[--d-F5F5F5-l-333]">
              <span
                :class="{
                'color-#12B886':increasedOrDecreased.increase,
                'color-#F6465D':increasedOrDecreased.decrease,
              }">${{ formatNumber(item.mc_cur, 1) }}</span>
                <img
                  v-if="increasedOrDecreased.increase"
                  src="@/assets/images/increase.svg"
                  alt=""
                >
                <img
                  v-else-if="increasedOrDecreased.decrease"
                  src="@/assets/images/decrease.svg"
                  alt=""
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="flex flex-col justify-between items-end">
        <div
          class="flex items-center color-[--d-666-l-999] text-12px"
        >
          <div
            v-tooltip="$t('FilterCurrentToken')"
            class="mr-8px w-12px h-12px rounded-2px bg-[--d-1A1A1A-l-F2F2F2] flex items-center justify-center hover:color-[--d-F5F5F5-l-333] cursor-pointer"
            :class="filterToken===item.token ? 'color-[--d-F5F5F5-l-333]':''"
            @click="filter(filterToken?'':item.token)"
          >
            <Icon name="custom:filter"/>
          </div>
          <Icon name="custom:clock" class="text-10px mr-2px"/>
          {{ formatDate(item.signal_time) }}
        </div>
        <div
          class="flex items-center lh-24px py-4px px-8px rounded-4px"
          :class="getGradientBackground(item.history_count)"
        >
          <Icon name="custom:alert" class="mr-3px"/>
          {{ item.history_count }}
          <span class="text-16px ml-4px">{{ $t(item.tag) }}</span>
        </div>
        <div class="flex items-center gap-4px">
          <div
            class="px-4px py-2px text-12px rounded-2px bg-[--d-1A1A1A-l-F2F2F2] flex items-center justify-center color-[--d-F5F5F5-l-333]">
            <Icon name="ic:baseline-people-alt" class="mr-4px color-#12B886"/>
            {{ item.holders_cur }}
          </div>
          <div
            class="px-4px py-2px text-12px rounded-2px bg-[--d-1A1A1A-l-F2F2F2] flex items-center justify-center color-[--d-F5F5F5-l-333]">
            <img :src="formatIconTag(item.tag)" class="mr-4px w-12px h-12px" alt="">
            {{ item.actions.length }}
          </div>
          <!--<div-->
          <!--  class="px-4px py-2px text-12px rounded-2px bg-[&#45;&#45;d-1A1A1A-l-F2F2F2] flex items-center justify-center color-[&#45;&#45;d-F5F5F5-l-333]">-->
          <!--  <img :src="formatIconTag('kol_buy')" class="mr-4px w-12px h-12px" alt="">-->
          <!--  {{ item.holders_cur }}-->
          <!--</div>-->
          <!--<div-->
          <!--  class="px-4px py-2px text-12px rounded-2px bg-[&#45;&#45;d-1A1A1A-l-F2F2F2] flex items-center justify-center color-[&#45;&#45;d-F5F5F5-l-333]">-->
          <!--  <img :src="formatIconTag('smarter_buy')" class="mr-4px w-12px h-12px" alt="">-->
          <!--  {{ item.holders_cur }}-->
          <!--</div>-->
        </div>
      </div>
    </div>
    <div class="m-12px bg-[--d-1A1A1A-l-F2F2F2] h-1px"/>
    <div class="flex color-[--d-666-l-999] text-12px mb-8px">
      <div class="flex-[2]">
        {{ $t('wallet') }}
      </div>
      <div class="flex-[2] text-right">
        {{ $t('operate') }}
      </div>
      <div class="flex-1 text-right" v-if="!filterToken">
        {{ $t('positions') }}
      </div>
      <div class="flex-1 text-right">
        {{ $t('time') }}
      </div>
    </div>
    <div class="flex-1">
      <div
        v-for="({
              wallet_alias,
              wallet_address,
              quote_token_amount,
              quote_token_symbol,
              quote_token_volume,
              action_time,
              token_balance_usd,
              wallet_logo
            },$index) in (isWalletAll? item.actions : item.actions.slice(0,3))"
        :key="$index"
        class="flex color-[--d-999-l-666] text-12px h-40px items-center cursor-pointer"
        @click="openTokenDetail(item.actions[$index])"
      >
        <div class="flex-[2] flex items-center">
          <UserAvatar
            icon-size="24px"
            :wallet_logo="{logo:wallet_logo}"
            :address="wallet_address"
            :chain="activeChain"
          />
          <span class="ml-4px color-[--d-F5F5F5-l-333] whitespace-nowrap overflow-hidden text-ellipsis max-w-60px">{{
              wallet_alias || $t('wallet')
            }}</span><span class="color-[--d-999-l-666]">(*{{ wallet_address.slice(-4) }})</span>
        </div>
        <div class="flex-[2] text-right color-#12B886">
          {{ $t('buy') }}{{ localeStore.locale === 'en' ? ' ' : '' }}{{ formatNumber(quote_token_amount, 2) }} {{
            quote_token_symbol
          }}<span class="color-[--d-999-l-666]">(${{ formatNumber(quote_token_volume, 0) }})</span>
        </div>
        <div class="flex-1 text-right" v-if="!filterToken">
            <span
              v-if="Number(token_balance_usd)===0"
              class="color-#F6465D"
            >
              {{ $t('soldAll') }}
            </span>
          <template v-else>
            ${{ formatNumber(token_balance_usd, 2) }}
          </template>
        </div>
        <div
          class="flex-1 text-right"
        >
            <span v-tooltip="formatDate(action_time * 1000, 'MM/DD HH:mm:ss')">{{
                formatTimeFromNow(action_time)
              }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="item.actions.length>3 && !isWalletAll"
      class="flex justify-center"
      @click="emit('openDrawer',item)"
    >
      <Icon
        name="material-symbols:keyboard-double-arrow-down-rounded"
        class="color-[--d-666-l-999] hover:color-[--d-F5F5F5-l-333] cursor-pointer"
      />
    </div>
    <div class="m-12px bg-[--d-1A1A1A-l-F2F2F2] h-1px"/>
    <div
      v-if="footer"
      class="flex justify-between"
    >
      <div class="flex-1 flex items-center color-[--d-666-l-999] gap-16px">
        <template v-if="item.self_wallet_info?.total_purchase_usd">
          {{ $t('mySwap') }}
          <el-row class="text-12px flex-1 text-center">
            <el-col :span="8">
              <div class="color-[--d-666-l-999] mb-4px">{{ $t('bought') }}</div>
              <div class="color-#12B886">
                ${{ formatNumber(item.self_wallet_info?.total_purchase_usd || 0, 1) }}
              </div>
            </el-col>
            <el-col
              :span="8"
            >
              <div class="color-[--d-666-l-999] mb-4px">
                {{ $t('sold') }}
              </div>
              <div class="color-#F6465D">
                ${{ formatNumber(item.self_wallet_info?.total_sold_usd || 0, 1) }}
              </div>
            </el-col>
            <el-col
              :span="8"
            >
              <div class="color-[--d-666-l-999] mb-4px">
                {{ $t('holding') }}
              </div>
              <div class="color-[--d-F5F5F5-l-333]">
                ${{ formatNumber(item.self_wallet_info?.balance || 0, 1) }}
              </div>
            </el-col>
          </el-row>
        </template>
      </div>
      <QuickSwapButton
        :quick-buy-value="quickBuyValue"
        :row="item"
        classNames="min-w-70px ml-70px"
        mainNameVisible
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
