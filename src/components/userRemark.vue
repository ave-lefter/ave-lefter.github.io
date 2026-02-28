<template>
  <div class="remark-com" >
    <UserAvatar
      v-if="showIcon"
      :class="avatarClass"
      :wallet_logo="wallet_logo"
      :address="address"
      :chain="chain"
      :iconSize="iconSize"
    />
    <template v-if="showAddress">
      <span
        v-if="!!mouseoverAddress"
        class="remark-com-address"
        :class="addressClass"
        :style="addressStyle"
        :title="showAddressTitle ? remark2 : undefined"
        @contextmenu.stop ="handleContextMenu"
        @click.stop="handleClick"
        @mouseover.stop="mouseoverAddress"
      >
        22{{ remark1 }}
      </span>
      <span
        v-else
        class="remark-com-address"
        :class="addressClass"
        :style="addressStyle"
        :title="showAddressTitle ? remark2 : undefined"
        @contextmenu.stop ="handleContextMenu"
        @click.stop="handleClick"
      >
       11{{ remark1 }}
      </span>
    </template>

    <slot v-bind="{remark: walletRemark, address, chain}" />

    <template v-if="canEdit">
      <EditRemarkPopover
        v-if="botStore?.userInfo?.evmAddress || walletStore?.address"
        :address="address"
        :chain="chain"
        :remark="remark"
        :popoverProps="{width: 320,title:t('editRemark'),popperClass:'[&&]:[--el-popover-title-text-color:--main-text] [&&]:[--el-popover-title-font-size:14px]'}"
        @confirm="_updateWhaleRemark"
      />
      <Icon v-else name="custom:remark" class="text-12px ml-5px clickable icon-remark shrink-0" @click.stop.prevent="verifyLogin"/>
    </template>
  </div>
</template>

<script lang="ts" setup>
// import { useIntersectionObserver } from '@vueuse/core'
import { updateWhaleRemark } from '~/api/remark'
import EditRemarkPopover from './remark/editRemarkPopover.vue'
import UserAvatar from './userAvatar.vue'
import type { PropType } from 'vue'
import { useI18n } from '#imports'
import { verifyLogin, formatRemark } from '@/utils'
import { ElMessage } from 'element-plus'
import { useBotStore } from '@/stores/bot'

// Props
const props = defineProps({
  remark: { type: String, default: '' },
  address: { type: String, default: '' },
  chain: { type: String, default: '' },
  priority: { type: Number, default: 0 },
  teleported: { type: Boolean, default: true },
  showIcon: { type: Boolean, default: false },
  formatAddress: {
    type: Function as PropType<(address: string) => string>,
    default: (address: string) => '*' + address?.slice(-6)
  },
  mouseoverAddress: {
    type: Function as PropType<(e: MouseEvent) => void> | null,
    default: null
  },
  addressClass: { type: String, default: '' },
  addressStyle: { type: String, default: '' },
  iconEditColor: { type: String, default: 'var(--third-text)' },
  showAddressTitle: { type: Boolean, default: false },
  iconEditSize: { type: String, default: '12px' },
  iconSize: { type: String, default: '16px' },
  showAddress: { type: Boolean, default: true },
  maxRemarkLength: { type: Number, default: 14 },
  // eslint-disable-next-line vue/prop-name-casing
  wallet_logo: {
    type: Object as PropType<{ logo?: string; name?: string; url?: string , vip_logo?: string}>,
    default: () => ({ logo: '', name: '', url: '', vip_logo: '' })
  },
  canEdit: { type: Boolean, default: true },
  avatarClass: { type: String, default: 'mr-10px' }
})

// Emits
const emit = defineEmits<{
  (e: 'updateRemark', payload: { address: string; remark: string; chain: string }): void
}>()
const {updateNum3}=storeToRefs(useFollowStore())
const { t } = useI18n()

const botStore = useBotStore()
const globalStore = useGlobalStore()

const remarksStore = useRemarksStore()
const walletStore = useWalletStore()

// Refs
// const target = useTemplateRef<HTMLElement | null>('target')
// const targetIsVisible = shallowRef(true)
const loadingEdit = ref(false)

// Intersection Observer
// let stop: () => void

onMounted(() => {
  // if (target.value) {
  //   const observer = useIntersectionObserver(
  //     target,
  //     ([entry]) => {
  //       targetIsVisible.value = entry.isIntersecting
  //     }
  //   )
  //   stop = observer.stop
  // }
})

onBeforeUnmount(() => {
  // if (stop) stop()
})

const walletRemark = computed(() => {
  const r1 = remarksStore.getRemarkByAddress({ address: props.address, chain: props.chain })
  const r2 = props.remark
  const r = (r1 || r2)
  return r
})

// Computed
const remark1 = computed(() => {
  const r1 = remarksStore.getRemarkByAddress({ address: props.address, chain: props.chain })
  const r2 = props.remark
  const r = props.priority === 1 ? (r2 || r1) : (r1 || r2)
  return formatRemark(r, props.maxRemarkLength) || props.formatAddress(props.address!)
})

const remark2 = computed(() => {
  const r1 = remarksStore.getRemarkByAddress({ address: props.address, chain: props.chain })
  const r2 = props.remark
  const r = props.priority === 1 ? (r2 || r1) : (r1 || r2)
  return r || props.address
})

// Methods
function _updateWhaleRemark(data: { remark: string }) {
  const remark = data.remark
  if (remark.length <= 20) {
    sendRemarkToServer(remark)
  } else {
    ElMessage.error(t('maximum10characters'))
  }
}

function sendRemarkToServer(remark: string) {
  const form = {
    user_address: props.address as string,
    self_address: (botStore?.userInfo?.evmAddress || walletStore.address) as string,
    remark,
    user_chain: props.chain
  }
  loadingEdit.value = true
  updateWhaleRemark(form)
    .then(() => {
      ElMessage.success(t('success'))
      updateNum3.value++
      emit('updateRemark', {
        address: props.address!,
        remark,
        chain: props.chain!
      })
    })
    .catch((err: any) => {
      ElMessage.error(t('fail'))
      console.error(err)
    })
    .finally(() => {
      loadingEdit.value = false
    })
}
// 右键点击事件处理
function handleContextMenu(e: MouseEvent) {
  e.preventDefault()
  const rightClickAction = globalStore.audioSettings?.wallet?.rightClickAction
  // rightClickAction: 0 不打开, 1 新tab打开
  const url = `/address/${props.address}/${props.chain}`
  if (rightClickAction === 1) {
    window.open(url, '_blank')
  }
}

// 右键点击事件处理
function handleClick(e: MouseEvent) {
  e.preventDefault()
  const clickAction = globalStore.audioSettings?.wallet?.clickAction
  // rightClickAction: 0 不打开, 1 新tab打开
  const url = `/address/${props.address}/${props.chain}`
  if (clickAction === 1) {
    window.open(url, '_blank')
  } else {
    window.open(url, '_self')
  }
}
</script>

<style scoped lang="scss">
.remark-com {
  display: inline-flex;
  align-items: center;
  line-height: 1;

  .icon-wallet-avatar {
    border-radius: 50%;
    height: 16px;
    width: 16px;
  }

  .icon-remark {
    color: v-bind('iconEditColor');
    font-size: v-bind('iconEditSize');
  }

  .remark-com-address {
    padding: 3px 0;
    line-height: 1;
  }
}
</style>
