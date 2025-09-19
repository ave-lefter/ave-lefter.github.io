
<template>
<ul class="min-h-400px">
  <li class="card-list-item">
    <span>{{ $t('holders2') }}{{ holders ? `(${holders})` : '' }}</span>
    <span>{{ $t('details') }}</span>
  </li>
  <template v-for="(item, index) in pairHoldersRank || []" :key="index">
    <li
      class="card-list-item"
      :class="{ 'bg-warning': Number(item?.analysis_show_warning) === 1 }"
    >
      <a
        :href="formatExplorerUrl(chain || '', item.address || '', 'address')"
        target="_blank"
        class="flex items-center"
      >
        <span>{{ index + 1 }}.</span>
        <el-tag
          v-if="Number(item?.analysis_show_creator) === 1"
          type="primary"
          round
          size="small"
          class="mr-3px"
        >
          {{ $t('contractCreator') }}
        </el-tag>
        <template v-if="formatLock(item)">
          <img v-if="item?.lock && item?.lock?.length > 0 && item?.lock?.every?.(i => i.unlockDate * 1000 <= Date.now())" style="height: 15px;" src="@/assets/images/unlock.png" alt="" srcset="">
          <Icon
            v-else
            class="text-14px"
            color="#B3920E"
            name="material-symbols-light:lock"
          />
        </template>
        <Icon v-if="item?.is_contract === 1" name="custom:contract" class="mr-2px text-12px" />
        <template v-if="!item.mark">
          {{ (item.address || '').slice(0, 2) + '...' + (item.address || '').slice(-4) }}
        </template>
        <template v-else>{{ item.mark }}</template>
        <template
          v-if="
            item.lock &&
            item.lock.length > 0 &&
            item.lock.every(i => i.unlockDate * 1000 <= Date.now())
          "
        >
          <br >
          {{ $t('unlocked') }}
        </template>
      </a>
      <div>
        {{ formatNumber(item.quantity || 0, 2) }}
        <span class="color-[--third-text]">({{ formatNumber(item.percent || 0, 2) }}%)</span>
      </div>
    </li>
    <table v-if="item.lock && item.lock.length > 0" class="table-lock">
      <thead>
        <tr>
          <th>{{ $t('amount') }}</th>
          <th>{{ $t('lockDate') }}</th>
          <th>{{ $t('unlockDateStart') }}</th>
          <th>{{ $t('unlockDateEnd') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item1, k) in item.lock" :key="k" :style="{color: item1.unlockDate * 1000 <= Date.now() ? '#FF9F00' : ''}">
          <td>{{ formatNumber(item1.amount || 0, 2) }}</td>
          <td>{{ formatDate(item1.lockDate, 'YYYY-MM-DD') }}</td>
          <td>{{ formatDate(item1.unlockDate, 'YYYY-MM-DD') }}</td>
          <td>{{ formatDate(item1.vesting_end || item1.unlockDate, 'YYYY-MM-DD') }}</td>
        </tr>
      </tbody>
    </table>
  </template>
</ul>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber'
import { getLPHolders } from '@/api/check'
defineProps({
  type: {
    type: String,
    default: 'token'
  },
  onlyList: {
    type: Boolean,
    default: true
  }
})

type PairHoldersRank = Awaited<ReturnType<typeof getLPHolders>>

const tokenStore = useTokenStore()
const route = useRoute()
const pairHoldersRank = shallowRef<null | PairHoldersRank>(null)

const chain = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  const chain = routeParams?.chain || tokenStore.token?.chain || ''
  return chain
})

const holders = computed(() => {
  return tokenStore.tokenInfoExtra?.pair_holders || 0
})

function formatLock(item: PairHoldersRank[number] | null) {
  return item?.lock || /lock|null|(black hole)/gi.test(item?.mark || '')
}

watch(
  () => route.params.id,
  () => {
    init()
  }
)


function init() {
  const tokenId = route.params.id as string
  getLPHolders(tokenId).then(res => {
    console.log('getLPHolders', res)
    pairHoldersRank.value = res
  })
}
onMounted(() => {
  init()
})

</script>

<style lang="scss" scoped>
.card-list-item {
  font-size: 14px;
  color: var(--third-text);
  letter-spacing: 0;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  > :nth-child(1) {
    color: var(--third-text);
  }
  > :nth-child(2) {
    text-align: right;
    color: var(--secondary-text);
  }
  > .danger {
    color: #f81111;
  }
  > .warning {
    color: #f8be46;
  }
  &.danger {
    color: #f81111;
  }
  &.warning {
    color: #f8be46;
  }
}
.table-lock {
  color: rgba(119, 126, 144, 0.8);
  width: 100%;
  font-size: 12px;
  td,
  th {
    text-align: left;
    &:nth-child(2),&:nth-child(3),&:nth-child(4){
      text-align: right;
    }
  }
}
.icon-contract {
  font-size: 14px;
  margin: 0 2px;
}
.more {
  text-align: center;
  margin-top: 15px;
  a {
    font-size: 14px;
  }
}
.bg-warning {
  background: #f8be46;
  padding: 2px 2px;
}
</style>
