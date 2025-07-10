<template>
  <div ref="target" class="remark-com" >
    <UserAvatar
      v-if="showIcon"
      class="mr-10px"
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
        @mouseover.stop="mouseoverAddress"
      >
        {{ remark1 }}
      </span>
      <span
        v-else
        class="remark-com-address"
        :class="addressClass"
        :style="addressStyle"
        :title="showAddressTitle ? remark2 : undefined"
      >
        {{ remark1 }}
      </span>
    </template>

    <slot />

    <template v-if="canEdit && targetIsVisible">
      <EditRemarkPopover
        v-if="botStore?.userInfo?.evmAddress"
        :address="address"
        :chain="chain"
        :remark="remark"
        @confirm="_updateWhaleRemark"
      />
      <Icon v-else name="custom:remark" class="text-12px ml-5px clickable icon-remark shrink-0"
            @click.stop.prevent="verifyLogin"/>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
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
  iconEditColor: { type: String, default: 'var(--d-666-l-999)' },
  showAddressTitle: { type: Boolean, default: false },
  iconEditSize: { type: String, default: '12px' },
  iconSize: { type: String, default: '16px' },
  showAddress: { type: Boolean, default: true },
  maxRemarkLength: { type: Number, default: 14 },
  // eslint-disable-next-line vue/prop-name-casing
  wallet_logo: {
    type: Object as PropType<{ logo: string; name: string; url: string }>,
    default: () => ({ logo: '', name: '', url: '' })
  },
  canEdit: { type: Boolean, default: true }
})

// Emits
const emit = defineEmits<{
  (e: 'updateRemark', payload: { address: string; remark: string; chain: string }): void
}>()

const { t } = useI18n()

const botStore = useBotStore()

const remarksStore = useRemarksStore()

// Refs
const target = useTemplateRef<HTMLElement | null>('target')
const targetIsVisible = shallowRef(false)
const loadingEdit = ref(false)

// Intersection Observer
let stop: () => void

onMounted(() => {
  if (target.value) {
    const observer = useIntersectionObserver(
      target,
      ([entry]) => {
        targetIsVisible.value = entry.isIntersecting
      }
    )
    stop = observer.stop
  }
})

onBeforeUnmount(() => {
  if (stop) stop()
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
    self_address: botStore?.userInfo?.evmAddress as string,
    remark,
    user_chain: props.chain
  }
  loadingEdit.value = true
  updateWhaleRemark(form)
    .then(() => {
      ElMessage.success(t('success'))
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
