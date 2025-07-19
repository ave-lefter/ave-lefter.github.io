<template>
  <el-dialog
    v-model="visible"
    width="860"
    height="600"
    header-class="p-0!"
    :title="$t('transactionsDetails')"
  >
    <div v-if="userAddress" class="flex-start address mt-20px">
      <span>
        <a
          :href="formatExplorerUrl(chain, userAddress, 'address')"
          target="_blank"
        >
          {{ userAddress?.slice(0, 6) + '...' + userAddress?.slice(-6) }}
        </a>
        <Icon
          v-copy="userAddress"
          name="bxs:copy"
          class="text-12px ml-2px cursor-pointer ml-10px"
          @click.stop.prevent
        />
      </span>
    </div>
    <user-txs-list
      :tableList="myTxs"
      :userAddress="userAddress"
      :loadingMyTx="loadingMyTx"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { formatExplorerUrl } from '@/utils/index'
import userTxsList from './userTxsList.vue'
import { _getUserTxs, type UserTxs } from '@/api/holders'
const props = defineProps({
  modelValue: Boolean,
})
defineExpose({
  getUserTxs,
})
const { modelValue } = toRefs(props)
const route = useRoute()
const $emit = defineEmits(['update:modelValue'])
const loadingMyTx = shallowRef(false)
const myTxs = ref<UserTxs[]>([])
const userAddress = shallowRef('')


const visible = computed({
  get() {
    return modelValue.value
  },
  set(value) {
    $emit('update:modelValue', value)
  },
})
const id = computed(() => {
  return route.params.id as string
})

const chain = computed(
  () => getAddressAndChainFromId(route.params.id as string)?.chain
)
function getUserTxs(address: string) {
  userAddress.value = address
  myTxs.value = []
  loadingMyTx.value = true
  const data = {
    token_id: id.value,
    user_address: address,
  }
  _getUserTxs(data)
    .then((res) => {
      myTxs.value = res.map((val) => {
        return {
          ...val,
          timestamp: Number(val.time)* 1000 || 0,
          network: val.chain || 'bsc',
          transactionAddress: val.transaction,
          walletAddress: val.wallet_address,
        }
      })
    })
    .finally(() => {
      loadingMyTx.value = false
    })
}
</script>

<style lang="scss" scoped></style>
