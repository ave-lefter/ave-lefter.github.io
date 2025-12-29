<template>
  <el-popover
    :visible="showExWallet"
    placement="bottom-end"
    :width="350"
    trigger="click"
    @update:visible="updateVisible"
  >
    <template #reference>
      <button class="text-12px bg-[--d-141721-l-E8F1FF] rounded-4px p-8px ml-8px h-32px flex items-center clickable color-[--main-text] border-none">
        <img height="24" class="mr-5px rd-50%" :src="`${configStore.token_logo_url}chain/${walletStore.chain}.png`" :alt="walletStore.chain" onerror="this.src='/icon-default.png'">
        <span>{{ currentAccountSplit }}</span>
      </button>
    </template>
    <!-- <div class="text-14px p-5px">
      <div class="color-[--d-666-l-999] flex">{{ $t('address') }}</div>
      <div class="border-solid border-1px border-[--d-333-l-F5F5F5] rounded-4px p-8px mt-15px flex items-center justify-between h-40px">
        <span>{{ currentAccountSplit }}</span>
        <Icon
          v-copy="walletStore.address"
          name="bxs:copy"
          class="text-12px ml-3px clickable color-[--d-666-l-999] ml-4px"
          @click.stop.prevent
        />
      </div>
      <el-button
        class="w-100% mt-15px border-transparent! bg-[rgb(63,128,247,0.16)]! color-#3F80F7! h-38px!"
        size="large"
        type="primary"
        @click.stop="walletStore.disconnect()"
      >
        {{ $t('disconnect') }}
      </el-button>
    </div> -->
    <div class="color-[--main-text">
      <div class="flex items-center p-8px mb-5px color-[--main-text] clickable" @click.stop="$router.push(`/address/${walletStore.address}/${walletStore.chain}`);showExWallet=false">
        <img class="rd-50% mr-5px" height="32" :src="generateAvatarIcon(walletStore?.address || '')" alt="">
        <span class="text-16px mr-3px">{{ currentAccountSplit || '' }}</span>
        <Icon
          v-copy="walletStore.address"
          name="bxs:copy"
          class="text-12px clickable color-[--secondary-text]"
          @click.stop.prevent
        />
        <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px color-[--secondary-text]" />
      </div>
      <div class="tabs">
        <button class="tab-item clickable" :class="{'active': activeTab === 0}" @click.stop="activeTab = 0">
          <span>{{ $t('chainWallet1') }}</span>
        </button>
        <button class="tab-item clickable" :class="{'active': activeTab === 1}" @click.stop="activeTab = 1">
          <span>{{ $t('perpetualContract') }}</span>
        </button>
      </div>
      <div v-show="activeTab === 0" class="pb-8px pt-20px px-8px">
        <div class="text-14px font-400">{{ $t('chainWalletBalance') }}</div>
        <div class="flex items-center text-24px font-700 mt-8px">
          <span>{{ formatNumber(balance, 3) }} {{ getChainInfo(walletStore.chain).main_name }}</span>
          <span class="text-18px color-[--secondary-text] ml-3px">(${{ formatNumber(balanceUsd, 2) }})</span>
        </div>
        <ul class="tg-wallet-list_footer flex flex-col gap-10px mt-20px">
          <li class="flex justify-between h-40px clickable" @click.stop="$router.push(`/address/${walletStore.address}/${walletStore.chain}?active=wallet`);showExWallet=false">
            <div class="color-[--main-text] flex items-center gap-8px" >
              <Icon name="custom:wallet2" class="text-16px" />
              <span class="text-14px">{{ $t('myWallet1') }}</span>
            </div>
            <div class="color-[--secondary-text] flex items-center gap-4px">
              <span class="text-12px">
                {{ currentAccountSplit || '' }}
              </span>
              <Icon
                v-copy="walletStore.address"
                name="bxs:copy"
                class="text-12px clickable color-[--secondary-text]"
                @click.stop.prevent
              />
              <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
            </div>
          </li>
          <li v-if="walletStore.chain === 'solana'" class="flex justify-between h-40px clickable" @click.stop="$router.push('/solana-rent-recovery');showExWallet=false">
            <div class="color-[--main-text] flex items-center gap-8px">
              <Icon name="custom:sack-dollar" class="text-16px" />
              <span class="text-14px">{{ $t('rentRecovery') }}</span>
            </div>
            <div class="color-[--secondary-text] flex items-center gap-4px">
              <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
            </div>
          </li>
          <!-- <li class="flex justify-between h-40px clickable" @click.stop="perpStore.login">
            <div class="color-[--main-text] flex items-center gap-8px">
              <Icon name="custom:log-out" class="text-16px" />
              <span class="text-14px">永续合约</span>
            </div>
            <div class="color-[--secondary-text] flex items-center gap-4px">
              <span class="text-12px" :class="{'color-[--up-color]': perpStore.isLogin}">
                {{ perpStore.isLogin ? '已登录' : '未登录' }}
              </span>
              <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
            </div>
          </li> -->
          <li class="flex justify-between h-40px clickable" @click.stop="walletStore.disconnect();perpStore.logout()">
            <div class="color-[--main-text] flex items-center gap-8px">
              <Icon name="custom:log-out" class="text-16px" />
              <span class="text-14px">{{ $t('disconnect') }}</span>
            </div>
            <div class="color-[--secondary-text] flex items-center gap-4px">
              <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
            </div>
          </li>
        </ul>
      </div>
      <div v-show="activeTab === 1" class="pb-8px pt-20px px-8px min-h-200px relative">
        <template v-if="perpStore.isLogin">
          <div class="text-14px font-400">{{ $t('perpBalance') }}</div>
          <div class="flex items-center text-24px font-700 mt-8px">
            <span>${{ formatNumber(prepBalance, 2) }}</span>
          </div>
          <ul class="tg-wallet-list_footer flex flex-col gap-10px mt-20px">
            <li class="flex justify-between h-40px clickable" @click.stop="deposit">
              <div class="color-[--main-text] flex items-center gap-8px">
                <Icon name="solar:download-outline" class="text-18px" />
                <span class="text-14px">{{ $t('deposit2') }}</span>
              </div>
              <div class="color-[--secondary-text] flex items-center gap-4px">
                <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
              </div>
            </li>
            <li class="flex justify-between h-40px clickable" @click.stop="withdraw">
              <div class="color-[--main-text] flex items-center gap-8px">
                <Icon name="solar:upload-outline" class="text-18px" />
                <span class="text-14px">{{ $t('withdraw') }}</span>
              </div>
              <div class="color-[--secondary-text] flex items-center gap-4px">
                <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
              </div>
            </li>
            <li class="flex justify-between h-40px clickable" @click.stop="perpStore.logout">
              <div class="color-[--main-text] flex items-center gap-8px">
                <Icon name="custom:log-out" class="text-16px" />
                <span class="text-14px">{{ $t('logout') }}</span>
              </div>
              <div class="color-[--secondary-text] flex items-center gap-4px">
                <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
              </div>
            </li>
          </ul>
        </template>

        <el-button v-else type="primary" class="min-h-42px absolute top-50% left-50% translate--50%" @click.stop="login">{{ $t('loginPerpAccount') }}</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang='ts'>
import { getBalance, getNativeTokenPrice } from '~/api/swap'
import { usePerpStore } from '~/stores/perp'
import BigNumber from 'bignumber.js'
const walletStore = useWalletStore()
const configStore = useConfigStore()
const showExWallet = ref(false)
const perpStore = usePerpStore()
const currentAccountSplit = computed(() => {
  return walletStore.address?.replace?.(new RegExp('(.{4})(.+)(.{4})'), '$1...$3') || ''
})

const activeTab = ref(0)
const balance = ref('0')
const nativePrice = ref<number | string>(0)

const { prepBalance } = usePerp()

// const prepBalance = computed(() => {
//   const amount = perpStore.collateral?.[0]?.amount || 0
//   const positions = perpStore.position || []
//   const contractList = perpStore.contractList
//   const positionsAmount = positions.reduce((prev, cur) => {
//     const contract = contractList.find(item => item.contractId === cur.contractId)
//     const price = contract?.lastPrice || 0
//     let value = new BigNumber(price || 0).times(new BigNumber(cur?.openSize || 0))
//     if (new BigNumber(price).isZero()) {
//       value = new BigNumber(cur?.openValue || 0)
//     }
//     return prev.plus(value)
//   }, new BigNumber(0))
//   return new BigNumber(amount).plus(positionsAmount).toFixed(2)
// })

const balanceUsd = computed(() => {
  return new BigNumber(balance.value || 0).times(nativePrice.value || 0).toFixed(2)
})

const getMainTokenBalance = createCacheRequest(() => {
  getBalance(NATIVE_TOKEN).then(res => {
    console.log('getMainTokenBalance', res)
    const decimals = getChainInfo(walletStore.chain).decimals
    balance.value = formatUnits(res, decimals)
  })
  getNativeTokenPrice().then(res => {
    nativePrice.value = res
  })
  return Promise.resolve(undefined)
}, 10000)

watch(showExWallet, (val) => {
  if (val) {
    getMainTokenBalance()
  }
})

// const loginDialogVisible = ref(false)
const { dialogVisible, login, deposit, withdraw } = usePerp()

function updateVisible(value: boolean) {
  if (!value && dialogVisible.value) {
    return
  } else {
    showExWallet.value = value
  }
}





</script>

<style scoped lang='scss'>
  .tabs {
    display: flex;
    align-items: center;
    color: var(--third-text);
    border-bottom: 1px solid var(--border);
    // margin-bottom: 10px;
    .tab-item {
      flex: 1;
      display: flex;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: var(--third-text);
      margin-bottom: -1px;
      > span {
        border-bottom: 2px solid transparent;
        padding: 10px 0;
      }
      &.active {
        color: var(--main-text);
        > span {
          border-color: var(--main-text);
        }
      }

    }
  }
</style>
