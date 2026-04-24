<template>
  <table class="pairs-table">
    <thead>
      <tr>
        <th>{{ $t('liquidityPair') }}</th>
        <th>{{ $t('amount') }}/{{ $t('initial') }}</th>
        <th>24h Vol/TVL</th>
        <!-- <th>{{ $t('price') }}/{{ $t('poolCirculatingSupply') }}</th> -->
      </tr>
    </thead>
    <tbody>
      <!-- <tr
        v-if="tokenAllPair"
        :class="{ active: tokenStore.selectedToken }"
        @click.stop="tokenStore.switchPair(true)"
      >
        <td>
          <div class="main flex justify-start items-center">
            <span>{{ tokenAllPair?.symbol || '' }}</span>
            <Icon v-tooltip="{ content: $t('allPairsTips'), props: { placement: 'top-start',  'popper-class':'max-w-250px', 'arrow-offset': 12 }}" name="solar:dollar-bold" class="color-#FFA622 text-14px ml-4px" />
          </div>
          <div class="minor">[All Pools]</div>
        </td>
        <td>
          <div class="main">{{ formatNumber((tokenAllPair?.reserve) || 0, 2) }}</div>
          <div class="minor">/<template v-if="tokenAllPair.init_reserve">{{ formatNumber(tokenAllPair.init_reserve || 0, 2) }}</template><template v-else>--</template>
          </div>
        </td>
        <td>
          <div class="text-right">
            <div class="main" v-html="'$' + formatNumber(tokenAllPair.price || 0, 2)" />
            <div class="main" v-html="'$' + formatNumber(tokenAllPair.reserveU || 0, 2)" />
          </div>
        </td>
      </tr> -->
      <tr
        v-for="(item, index) in (show ? pairs : pairs?.slice?.(0, isInModal ? undefined : 1)) || []"
        :key="item.pair"
        :class="{
          active:
            tokenStore.pairAddress === item.pair && (!tokenStore.selectedToken || !tokenAllPair),
        }"
        @click.stop="switchPair(item)"
      >
        <td>
          <div class="main flex justify-start items-center">
            <span>{{
              item.target_token === item.token0_address ? item.token0_symbol : item.token1_symbol
            }}</span>
            <el-progress
              v-if="index === 0 && percent > 0"
              class="progress clickable"
              type="circle"
              :percentage="percent"
              color="#12B886"
              :width="16"
              :stroke-width="1.5"
              indeterminate
              @click.stop.prevent="visible = true"
            >
              <Icon class="text-10px color-[--third-text]" name="material-symbols:lock" />
            </el-progress>
            <span
              v-if="Number(item.buy_tax) > 0 || Number(item.sell_tax) > 0"
              v-tooltip="$t('pairTax')+':'+formatNumber(item?.buy_tax || item?.sell_tax || 0, 2)+'%'"
              class="bg-[--d-1E2025-l-E8F1FF] py-1px px-4px rounded-4px text-10px ml-3px cursor-pointer"
              :style="{
                color: Number(item?.buy_tax || item?.sell_tax) > 3 ? '#F6465D' : 'var(--secondary-text))',
              }"
            >
              {{ formatNumber(item?.buy_tax || item?.sell_tax || 0, 2) }}%
            </span>
          </div>
          <NuxtLink
            class="main"
            :to="
              '/token/' +
              (item.target_token === item.token0_address
                ? item.token1_address
                : item.token0_address) +
              '-' +
              item.chain
            "
          >
            {{
              item.target_token === item.token0_address ? item.token1_symbol : item.token0_symbol
            }}</NuxtLink
          >
          <Icon
            v-if="item.is_fake"
            v-tooltip="$t('phoneyPool')"
            name="ri:error-warning-line"
            class="ml-3px color-#ffbb19 relative top-2px"
          />
        </td>
        <td>
          <span class="main">{{
            formatNumber(
              (item.target_token === item.token0_address ? item.reserve0 : item.reserve1) || 0,
              2
            )
          }}</span>
          <span class="minor"
            >/<template v-if="item.init_reserve0 || item.init_reserve1">{{
              formatNumber(
                (item.target_token === item.token0_address
                  ? item.init_reserve0
                  : item.init_reserve1) || 0,
                2
              )
            }}</template
            ><template v-else>--</template>
          </span>
          <br />
          <!-- 冲土狗的时候，这个流动性sol是个最容易判断涨跌的指标，需要醒目一点 -->
          <span
            v-if="item.target_token === item.token0_address"
            :class="['main', item.isUp ? 'green' : 'red']"
            >{{ formatNumber(item.reserve1 || 0, 2) }}</span
          >
          <span v-else class="main" :class="['main', item.isUp ? 'green' : 'red']">{{
            formatNumber(item.reserve0 || 0, 2)
          }}</span>
          <span class="minor"
            >/<template v-if="item.init_reserve0 || item.init_reserve1">{{
              formatNumber(
                (item.target_token === item.token0_address
                  ? item.init_reserve1
                  : item.init_reserve0) || 0,
                2
              )
            }}</template
            ><template v-else>--</template>
          </span>
        </td>
        <td>
          <div class="text-right">
            <div class="flex items-center justify-end">
              <template v-if="isInModal">
                <Icon
                  v-if="item.amm === 'unknown'"
                  v-tooltip="item.amm"
                  name="tdesign:help-circle-filled"
                  class="mr-5px color-#848E9C text-20px"
                />
                <a
                  v-else
                  v-tooltip="item.ammName"
                  :href="item.swap_url + item.target_token"
                  target="_blank"
                  class="inline-flex"
                >
                  <img
                    class="rounded-50% mr-5px h-16px w-16px"
                    :src="formatIconSwap(item.amm)"
                    onerror="this.src='/icon-default.png'"
                    height="16"
                  />
                </a>
              </template>

              <el-popover
                v-else
                :persistent="false"
                popper-class="[--el-popover-bg-color:--border] [--el-popover-padding:4px_0!important]"
                popper-style="width: auto;min-width: 104px;"
                placement="bottom"
                trigger="hover"
              >
                <!-- v-tooltip="item.amm"  -->
                <!-- v-tooltip="item.ammName" -->
                <template #reference>
                  <Icon
                    v-if="item.amm === 'unknown'"
                    name="tdesign:help-circle-filled"
                    class="mr-5px color-#848E9C text-20px"
                  />
                  <div v-else class="inline-flex">
                    <img
                      class="rounded-50% mr-5px h-16px w-16px"
                      :src="formatIconSwap(item.amm)"
                      onerror="this.src='/icon-default.png'"
                      height="16"
                    />
                  </div>
                </template>
                <div class="font-400 text-12px lh-16px flex flex-col gap-4px text-center">
                  <div class="flex items-center justify-center px-10px py-4px">
                    <Icon
                      v-if="item.amm === 'unknown'"
                      name="tdesign:help-circle-filled"
                      class="mr-5px color-#848E9C text-20px"
                    />
                    <div v-else class="inline-flex">
                      <img
                        class="rounded-50% mr-5px h-16px w-16px"
                        :src="formatIconSwap(item.amm)"
                        onerror="this.src='/icon-default.png'"
                        height="16"
                      />
                    </div>
                    <span class="text-[--secondary-text]">{{
                      item.amm === 'unknown' ? 'unknown' : item.ammName
                    }}</span>
                  </div>
                  <a
                    v-if="item.amm !== 'unknown' && !!item.ammName"
                    :href="item.swap_url + item.target_token"
                    target="_blank"
                    class="hover:bg-[--dialog-tab-active-bg] px-10px py-4px"
                    >{{ $t('pairsLink') }}</a
                  >
                  <div
                    class="cursor-pointer hover:bg-[--dialog-tab-active-bg] px-10px py-4px"
                    @click.stop.prevent="
                      emit('openFilterModal', item.amm === 'unknown' ? 'unknown' : item.ammName)
                    "
                  >
                    {{ $t('searchSameAmm') }}
                  </div>
                  <!-- {{ item.amm ==='unknown'?'unknown':item.ammName }} -->
                </div>
              </el-popover>

              <span
                v-if="item.target_token === item.token0_address"
                class="main"
                v-html="'$' + formatNumber(item.token0_price_usd || 0, 2)"
              />
              <span
                v-else
                class="main"
                v-html="'$' + formatNumber(item.token1_price_usd || 0, 2)"
              />
            </div>
            <div class="flex items-center justify-end">
              <span v-if="item.target_token === item.token0_address" class="main"
                >${{ formatNumber(item.reserve1 * item.token1_price_usd * 2 || 0, 2) }}</span
              >
              <span v-else class="main"
                >${{ formatNumber(item.reserve0 * item.token0_price_usd * 2 || 0, 2) }}</span
              >
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <template v-if="!isInModal">
    <div v-if="(pairs?.length || 0) > 1" class="collapse-button">
      <button @click.stop.prevent="show = !show">
        <Icon
          name="solar:alt-arrow-down-line-duotone"
          :class="show ? 'collapse' : 'expand'"
          class="text-20px font-bold color-[--third-text]"
        />
      </button>
    </div>
  </template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    width="600px"
    :title="'LP ' + $t('holdersDetail')"
    append-to-body
    destroy-on-close
  >
    <LPHolders />
  </el-dialog>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber'
import { formatIconSwap, getSwapInfo } from '@/utils/index'
import BigNumber from 'bignumber.js'
import LPHolders from './lpHolders.vue'

const emit = defineEmits(['openFilterModal'])

const props = defineProps({
  isInModal: {
    type: Boolean,
    default: false,
  },
  search: {
    type: String,
    default: '',
  },
})

const tokenStore = useTokenStore()

const show = shallowRef(false)
const percent = computed(() => (tokenStore?.tokenInfoExtra?.pair_lock_percent || 0) * 100 || 0)
const visible = shallowRef(false)
const pairs = computed(() => {
  return tokenStore.pairs
    ?.map((i) => ({
      ...i,
      ammName: i.amm === 'unknown' ? i.amm : getSwapInfo(i.chain, i.amm)?.show_name || i.amm,
      isUp:
        i.target_token === i.token0_address
          ? new BigNumber(i.reserve1).gt(i.init_reserve1)
          : new BigNumber(i.reserve0).gt(i.init_reserve0),
    }))
    .filter((i) => {
      if (!props.isInModal) {
        return true
      } else {
        return props.search === 'unknown' ? i.amm === 'unknown' : i.ammName === props.search
      }
    })
})

const tokenAllPair = computed(() => {
  return tokenStore.tokenAllPair
})

function switchPair(item: any) {
  if (tokenStore.pairAddress === item.pair && !tokenStore.selectedToken && tokenAllPair.value) {
    tokenStore.switchPair(true)
  } else {
    if (tokenStore.pairAddress === item.pair && !tokenAllPair.value) {
      return
    }
    tokenStore.switchPair(item.pair)
  }
}
</script>

<style scoped lang="scss">
.pairs-table {
  width: calc(100% + 30px);
  font-size: 12px;
  line-height: 1.5;
  border-spacing: 0 2px;
  margin-left: -15px;
  color: var(--secondary-text);
  border-collapse: collapse;
  th {
    text-align: center;
    font-size: 12px;
    color: var(--third-text);
    letter-spacing: 0;
    font-weight: 400;
  }
  td {
    text-align: center;
    padding: 5px 3px;
    word-break: break-word;
    vertical-align: top;
    &:nth-child(1) {
      padding: 5px 0;
    }
  }
  tr {
    cursor: pointer;
    td:first-child,
    th:first-child {
      text-align: left;
      padding-left: 15px;
    }
    td:nth-child(2),
    th:nth-child(2) {
      text-align: right;
    }
    td:last-child,
    th:last-child {
      text-align: right;
      padding-right: 15px;
    }
    .main {
      text-decoration: none;
      color: var(--secondary-text);
    }
    &.active {
      td {
        background: var(--main-list-hover);
        // background: var(--tab-active-bg);
      }
      .main {
        color: var(--main-text1);
        &.red {
          color: #f6465d;
        }
        &.green {
          color: #12b886;
        }
      }
    }
  }
}

.progress {
  margin-left: 3px;
  :deep().el-progress__text {
    min-width: 12px;
  }
}
.collapse-button {
  font-size: 16px;
  color: var(--third-text);
  line-height: 1;
  padding: 0;
  text-align: center;
  cursor: pointer;
  button {
    border: none;
    background: transparent;
    padding: 0 5px;
    cursor: pointer;
  }
  .collapse {
    transition: all 0.5s;
    transform: rotateZ(180deg);
  }
  .expand {
    transition: all 0.5s;
    // transform: rotateZ(180deg);
  }
}
</style>
