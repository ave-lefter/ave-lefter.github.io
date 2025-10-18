<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'balancesInfo', hasChildren: 'hasChildren' }"
      default-expand-all
      class="table-list hidden-scrollbar bot-manage-table"
      v-loading="loading"
      header-row-class-name="text-12px sticky top-0 z-10 font-500"
      :row-class-name="getRowClass"
      @row-click="tableRowClick"
    >
      <template #empty>
        <div v-if="!loading && tableData?.length == 0" class="table-empty">
          <AveEmpty />
        </div>
        <span v-else />
      </template>
      <el-table-column prop="name" label="钱包" :min-width="300">
        <template #default="{ row }">
          <template v-if="row.isChildren">
            {{ row.name?.replace?.(new RegExp('(.{6})(.+)(.{4})'), '$1...$3') }}
            <Icon
              v-copy="row.address"
              name="bxs:copy"
              class="ml-5px mb--1px clickable color-[--third-text]"
              @click.stop
            />
          </template>
          <div class="flex-start" v-else>
            <img
              class="mr-8px"
              style="border-radius: 50%"
              height="24"
              :src="generateAvatarIcon(row?.name || '')"
              alt=""
            />
            {{ row.name }}
            <Remark
              :remark="row.remark"
              :address="row.evmAddress"
              chain="bsc"
              :showAddress="true"
              @refresh="emit('refresh')"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="chain" :label="$t('chain')" />
      <el-table-column prop="balance" :label="$t('balance1')" >
          <template #default="{ row }">
          {{  formatNumber(row?.balance || 0, 2) }}
        </template>
      </el-table-column>
      <el-table-column prop="source" :label="$t('origin')">
        <template #default="{ row }">
          {{ row.source || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="operate" :label="$t('operate')" align="right">
        <template #default="{ row }">
          <Icon
            class="text-14px text-[--third-text] cursor-pointer hover:color-[--main-text]"
            name="ic:baseline-delete"
            v-if="row.operate == 'delete'"
            @click.stop.prevent="removeWallet(row)"
          />

          <div
            v-else
            class="mr-40px bg-[--main-input-button-bg] rounded-4px inline-flex items-center gap-4px py-2px px-4px cursor-pointer"
          >
            <Icon name="custom:download" class="text-10px" />
            <span class="font-500 text-12px" @click.stop.prevent="deposit(row)">{{
              t('deposit2')
            }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      width="500"
      height="630"
      :class="['dialog-connect', theme]"
      append-to-body
      :close-on-click-modal="false"
    >
      <span class="text-24px">{{ t('deposit2') }}</span>
      <div class="w-420px h-426px flex flex-col items-center justify-center">
        <canvas id="qr-chain-canvas-code" />
        <div class="text-14px color-[--secondary-text] mt-26px">
          <span class="color-[--primary-color] mr-4px text-17px">{{
            capitalize(currentObj.chain)
          }}</span
          >{{ $t('walletAddress') }}
        </div>
        <span class="mt-26px color-[--main-text] text-14px block">{{ currentObj.address }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { _getMultiWalletsAllChain, _removeWallet, type Wallet, type Address } from '@/api/botManage'
import { ElMessage } from 'element-plus'
import QrCodeWithLogo from 'qr-code-with-logo'
import Remark from './remark.vue'
defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['refresh'])
const { token_logo_url, mode } = storeToRefs(useGlobalStore())
const { theme } = storeToRefs(useThemeStore())
const { t } = useI18n()
const router = useRouter()
const dialogVisible = shallowRef(false)
const currentObj = ref<{ chain: string; address: string }>({
  chain: '',
  address: '',
})

function removeWallet(item: Wallet) {
  if (Number(item?.balance) > 0) {
    ElMessageBox.confirm(
      t('walletRemoveTip1'),
      t('walletRemove'),
      {
        type: 'warning',
        confirmButtonText: t('confirm'),
        cancelButtonText: t('cancel'),
        customClass: mode.value,
      }
    ).then(() => {
      confirmRemoveWallet(item)
    })
  } else {
    confirmRemoveWallet(item)
  }
}
function confirmRemoveWallet(item: Wallet) {
  ElMessageBox.confirm(t('walletRemoveTip2'), t('walletRemove'), {
    type: 'warning',
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    customClass: mode.value,
  })
    .then(() => {
      const evmAddress = item.balancesInfo?.filter((i) => i.chain == 'bsc')?.[0]?.address || ''
      _removeWallet(evmAddress).then(() => {
        ElMessage.success(t('success'))
        emit('refresh')
      })
    })
    .catch((err) => {
      console.log('--------err-------', err)
    })
}
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
function deposit(item: Wallet) {
  currentObj.value = item
  dialogVisible.value = true
  setTimeout(() => {
    setChainQr()
  }, 200)
}
async function setChainQr() {
  const canvas = document.getElementById('qr-chain-canvas-code')
  if (!canvas) {
    return
  }
  QrCodeWithLogo.toCanvas({
    canvas: canvas,
    content: currentObj.value.address,
    width: 200,
    nodeQrCodeOptions: {
      margin: 2,
    },
    logo: {
      src: `${token_logo_url.value}chain/${currentObj.value.chain}.png`,
      logoRadius: 8,
    },
  }).catch((err: any) => {
    console.log('QrCodeWithLogo error', err)
  })
}
function tableRowClick(item: Wallet) {
  if (item.isChildren) {
    const routeData = router.resolve({
      path: `/address/${item.address}/${item.chain}`,
    })
    window.open(routeData.href, '_blank')
  }
}
const getRowClass = ({ row }: { row: any }) => {
  return row.isChildren ? 'cursor-pointer' : ''
}
</script>
<style lang="scss" scoped>
.table-list {
  color: var(--main-text);
  font-size: 14px;
  height: calc(100vh - 240px);
}
.table-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
  min-height: calc(100vh - 200px);
}
</style>
