<template>
  <div class="w-full h-full">
    <!-- <loading
      v-model:active="loading"
      :can-cancel="false"
      loader="dots"
      :opacity="0.2"
      :backgroundColor="$store.state.mode==='light'? '#F5F5F5':'#131722'"
      color="#3F80F7"
      :is-full-page="false"
    /> -->
    <el-table :data="currentUserTokenList" class="w-full !text-[12px]" @row-click="tableRowClick">
      <template #empty>
        <AveEmpty class="pt-40px" />
      </template>
      <TokenColumn
        :column-props="{
          label: $t('token'),
          width: '250',
          fixed: 'left',
          prop: 'address',
        }"
      />
      <el-table-column :label="$t('price')" align="right">
        <template #default="{ row }">
          <span
            v-if="row.price > 0" v-html="'$' + formatNumber(row.price || 0, {
            decimals:4,
            limit: 20,
          })" />
          <span v-else>'-.-'</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('amount')" align="right">
        <template #default="{ row }">{{ formatNumber(row.amount) }}</template>
      </el-table-column>
      <el-table-column prop :label="$t('value')" align="right">
        <template #default="{ row }">
          <span v-if="row.price">${{ formatNumber(row.amount * row.price) }}</span>
          <span v-else>-.-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import TokenColumn from '@/components/tokenColumn.vue'
import AveEmpty from '@/components/aveEmpty.vue'
import { getUserTokenList } from '@/api/wallet'
// import { getUserSwapTokenList, getBalanceList } from '@/api/swap'
const route = useRoute()
const botStore = useBotStore()
const walletStore = useWalletStore()
const chain = computed(() => {
  if (route.params.chain) {
    return route.params.chain
  }
  if (botStore?.userInfo?.evmAddress) {
    return 'solana'
  }
  return walletStore.chain || ''
})
const userAddress = computed(() => {
  if (route.params.userAddress) {
    return route.params.userAddress
  }
  if (botStore?.userInfo?.evmAddress) {
    return botStore.getWalletAddress('solana')
  }
  return walletStore.address || ''
})

const props = defineProps({
  isHide: {
    type: Boolean,
    default: true,
  },
})

const userTokenList = ref([])
const receiveValue = inject('receiveValue')

const userTotalBalance = computed(() => {
  const data = balanceTokens.value?.reduce((a, c) => a + Number(c.quote), 0)
  return data
})

const balanceTokens = computed(() => {
  const data = userTokenList.value?.filter(
    (i) =>
      i.symbol &&
      i.flag !== 'blacklist' &&
      i.flag !== 'lp' &&
      i.risk_score < 60 &&
      i.risk_level >= 0 &&
      i.is_hidden == false
  )
  return data
})

watch(
  () => userTotalBalance.value,
  (newVal) => {
    receiveValue(newVal)
  }
)

const currentUserTokenList = computed(() => {
  if (props.isHide) {
    return balanceTokens.value?.filter((row) => row.amount * row.price >= 1)
  } else {
    return balanceTokens.value
  }
})

// function _getUserTokenList(address, chain) {
//   if (!address || !chain) {
//     return
//   }
//   getUserSwapTokenList(address, chain).then(res1 => {
//     const res = res1.map((i) => ({
//       ...i,
//       id: i.token,
//       quote: i.current_price_usd * i.value || 0,
//       price: i.current_price_usd,
//       amount: i.value,
//       address: i.token,
//     }))
//     if (chain === 'solana') {
//       userTokenList.value = res?.map?.(i => ({...i}))
//     } else {
//       userTokenList.value = (res?.map(i => ({...i, id: i.token + '-' + i.chain, address: i.token}))?.filter?.(i => (i.risk_score || 0) < 60 && (i.risk_level || 0) >= 0 && i.flag !== 'blacklist' && i.symbol !== '' && i.flag !== 'lp') || [])?.filter(j => !!Number(j.value))
//     }
//     if (userTokenList.value.length > 0 && chain !== 'solana' && chain !== 'sui' && (/^0x[0-9a-zA-Z]{40}$/.test(address) || isValidAddress(address, 'tron'))) {
//       getBalanceList(userTokenList.value.map(i => i.token || ''), chain).then(res1 => {
//         userTokenList.value = userTokenList.value?.map?.((i, k) => ({...i, value: formatUnits(res1[k], i?.decimals || 0)}))?.filter(j => !!Number(j.value))
//       })
//     }
//   })
// }

async function _getUserTokenList(address, chain) {
  const result = await getUserTokenList(address, chain)
  const tokenList = result.map((i) => ({
    ...i,
    id: i.token,
    quote: i.current_price_usd * i.value || 0,
    price: i.current_price_usd,
    amount: i.value,
    address: i.token,
  }))
  userTokenList.value = tokenList
}

function init() {
  _getUserTokenList(userAddress.value, chain.value)
}
onMounted(() => {
  init()
})

const tableRowClick = (row) => {
  router.push({
    name: 'Token',
    params: { id: row.id + '-' + row.chain },
    query: { from: route.name },
  })
}
</script>

<style></style>
