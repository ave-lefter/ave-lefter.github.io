<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'balancesInfo', hasChildren: 'hasChildren' }"
      default-expand-all
      class="table-list hidden-scrollbar bot-manage-table"
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
      <el-table-column prop="name" label="钱包" :min-width="200">
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
          <div v-else class="flex-start">
            <img
              class="mr-8px"
              style="border-radius: 50%"
              height="24"
              :src="generateAvatarIcon(row?.name || '')"
              alt=""
            >
            {{ row.name }}
            <Remark
              :remark="row.remark"
              :address="row.evmAddress"
              chain="bsc"
              :showAddress="true"
              @refresh="emit('refresh')"
            />
            <span
              v-if="evmAddress == row.evmAddress"
              class="border-solid border-0.5px border-#286dff color-#286dff rounded-4px text-10px px-4px py-1px overflow-hidden text-ellipsis whitespace-nowrap max-w-100px ml-10px line-height-15px"
              >{{ $t('currentWallet') }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="chain" :label="$t('chain')" align="right">
        <template #default="{ row }">
          {{ getChainInfo(row?.chain)?.name }}
        </template>
      </el-table-column>
      <el-table-column prop="balance" :label="$t('balance1')" align="right">
        <template #default="{ row, $index }">
          <div
            :ref="(el: any) => ($refs.currentBtnRef[$index] = el)"
            @mouseenter="showPopover(row, $index)"
            @mouseleave="showPop = false"
          >
            ${{ formatNumber(row?.balance || 0, 2) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="source" :label="$t('origin')" align="right">
        <template #default="{ row }">
          <template v-if="!row?.isChildren">
            <span v-if="row.source" class="mr-5px">
              {{ row.source }}
            </span>
            <span
              v-if="row.genSource == 1"
              class="bg-[--primary-color] rounded-4px text-10px px-4px py-1px overflow-hidden text-ellipsis whitespace-nowrap max-w-100px line-height-20px"
              >{{ $t('import') }}</span
            >
            <span
              v-else
              class="bg-[--signal-green] rounded-4px text-10px px-4px py-1px overflow-hidden text-ellipsis whitespace-nowrap max-w-100px line-height-20px"
              >{{ $t('create') }}</span
            >

            <!-- <template v-else> - </template> -->
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operate')" align="right">
        <template #default="{ row }">
          <Icon
            v-if="row.operate == 'delete' && evmAddress !== row.evmAddress"
            class="text-14px text-[--third-text] cursor-pointer hover:color-[--main-text]"
            name="ic:baseline-delete"
            @click.stop.prevent="removeWallet(row)"
          />

          <div
            v-else-if="row?.isChildren"
            class="mr-40px bg-[--main-input-button-bg] rounded-4px inline-flex items-center gap-4px py-2px px-4px cursor-pointer"
            @click.stop.prevent="deposit(row)"
          >
            <Icon name="custom:download" class="text-10px" />
            <span class="font-500 text-12px">{{ t('deposit2') }}</span>
          </div>
          <span v-else/>
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
          <span class="color-[--primary-color] mr-4px text-17px"
            >{{ getChainInfo(currentObj?.chain || '')?.name }} </span
          >{{ $t('walletAddress') }}
        </div>
        <span class="mt-26px color-[--main-text] text-14px block">{{ currentObj?.address }}</span>
      </div>
    </el-dialog>
    <el-popover
      v-model:visible="showPop"
      :virtual-ref="$refs.currentBtnRef[currentIndex]"
      virtual-triggering
      trigger="contextmenu"
      placement="right"
      popper-class="text-center"
      :popper-style="{ padding: 0, 'border-radius': '8px' }"
    >
      <table class="px-10px py-10px text-14px">
        <tr>
          <td class="color-[var(--third-text)] text-left text-12px">{{ getChainInfo(currentRow?.chain || '')?.main_name || $t('mainToken') }}</td>
          <td class="color-[var(--main-text)] text-left pl-5px">
            {{ formatNumber(currentRow?.mainTokenBalance || 0, 2) }}
          </td>
        </tr>
        <tr>
          <td class="color-[var(--third-text)] text-left text-12px">USDT</td>
          <td class="color-[var(--main-text)] text-left pl-5px">
            {{ formatNumber(currentRow?.usdtTokenBalance || 0, 2) }}
          </td>
        </tr>
        <tr>
          <td class="color-[var(--third-text)] text-left text-12px">USDC</td>
          <td class="color-[var(--main-text)] text-left pl-5px">
            {{ formatNumber(currentRow?.usdcTokenBalance || 0, 2) }}
          </td>
        </tr>
      </table>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { _removeWallet, type Wallet, type Address } from '@/api/botManage'
import { ElMessage } from 'element-plus'
import QrCodeWithLogo from 'qr-code-with-logo'
import Remark from './remark.vue'
import { getCurrentInstance } from 'vue'

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

const parent = getCurrentInstance()?.parent
const parentFn = parent?.exposed?.getMultiWalletsAllChain

const emit = defineEmits(['refresh', 'getMultiWalletsAllChain'])
const { token_logo_url, mode } = storeToRefs(useGlobalStore())
const { theme } = storeToRefs(useThemeStore())
const { t } = useI18n()
const router = useRouter()
const { evmAddress } = storeToRefs(useBotStore())
const dialogVisible = shallowRef(false)
const currentObj = ref<Address | null>(null)
const showPop = shallowRef(false)
const currentIndex = shallowRef(0)
const currentRow = ref<Address | null>(null)
const $refs = ref({
  buttonRefs: {} as Record<number, any>,
  currentBtnRef: {} as Record<number, any>,
})

async function removeWallet(item: Wallet) {
  if (parentFn) {
    await parentFn()
    if (Number(item?.balance) > 0) {
      ElMessageBox.confirm(t('walletRemoveTip1'), t('walletRemove'), {
        type: 'warning',
        confirmButtonText: t('confirm'),
        cancelButtonText: t('cancel'),
        customClass: mode.value,
      }).then(() => {
        confirmRemoveWallet(item)
      })
    } else {
      confirmRemoveWallet(item)
    }
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

function deposit(item: Address) {
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
    content: currentObj.value?.address || '',
    width: 200,
    nodeQrCodeOptions: {
      margin: 2,
    },
    logo: {
      src: `${token_logo_url.value}chain/${currentObj.value?.chain || 'bsc'}.png`,
      logoRadius: 8,
    },
  }).catch((err: any) => {
    console.log('QrCodeWithLogo error', err)
  })
}
function tableRowClick(item: Address) {
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
function showPopover(row: Address, $index: number) {
  showPop.value = true
  currentIndex.value = $index
  currentRow.value = row
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
