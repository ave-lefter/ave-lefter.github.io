<template>
  <div v-show="step === 1" class="text-14px color-[--main-text] lh-20px">
    <div v-html="$t('perpAgreementTitle')"/>
    <ul class="bg-[--border] p-16px mt-16px">
      <li class="flex items-center">
        <Icon name="bi:check-circle-fill" class="text-16px mr-8px" />
        <span class="flex-1">{{ $t('perpAgreement1') }}</span>
      </li>
      <li class="flex items-center mt-16px">
        <Icon name="bi:check-circle-fill" class="text-16px mr-8px" />
        <span class="flex-1">{{ $t('perpAgreement2') }}</span>
      </li>
      <li class="flex items-center mt-16px">
        <Icon name="bi:check-circle-fill" class="text-16px mr-8px" />
        <span class="flex-1">{{ $t('perpAgreement3') }}</span>
      </li>
      <li class="flex items-center mt-16px">
        <Icon name="bi:check-circle-fill" class="text-16px mr-8px" />
        <span class="flex-1">{{ $t('perpAgreement4') }}</span>
      </li>
    </ul>
    <el-button type="primary" size="large" class="w-100% min-h-48px mt-20px" @click.stop="step = 2">{{ $t('agreeAndContinue') }}</el-button>
  </div>
  <div v-show="step === 2" class="text-14px color-[--main-text] lh-20px">
    <div>{{ $t('perpSignTips') }}</div>
    <ul class="bg-[--border] p-16px mt-16px">
      <li class="flex">
        <div v-if="!perpStore.apiKeys" class="relative flex items-center justify-center mr-8px w-20px h-20px text-14px">
          <span class="relative z-2 w-20px h-20px rd-50% bg-[--icon-color] text-center lh-19px">1</span>
          <Icon v-if="perpStore.apiSignatureLoading" name="line-md:loading-loop" class="text-26px absolute left-50% top-50% -translate-50% z-1 color-[--up-color]" />
        </div>
        <Icon v-else name="bi:check-circle-fill" class="text-22px mr-8px color-[--up-color]" />
        <div class="flex-1">
          <div class="text-16px font-500 mb-5px">{{ $t('verifyOwnership') }}</div>
          <div class="text-14px font-400 color-[--secondary-text]"> {{ $t('verifyOwnershipDesc') }}</div>
        </div>
      </li>
      <li class="flex mt-24px">
        <div v-if="!perpStore.l2KeyPair" class="relative flex items-center justify-center mr-8px w-20px h-20px text-14px">
          <span class="relative z-2 w-20px h-20px rd-50% bg-[--icon-color] text-center lh-19px">2</span>
          <Icon v-if="perpStore.starkSignatureLoading" name="line-md:loading-loop" class="text-26px absolute left-50% top-50% -translate-50% z-1 color-[--up-color]" />
        </div>
        <Icon v-else name="bi:check-circle-fill" class="text-22px mr-8px color-[--up-color]" />
        <div class="flex-1">
          <div class="text-16px font-500 mb-5px">{{ $t('enableTrading') }}</div>
          <div class="text-14px font-400 color-[--secondary-text]"> {{ $t('enableTradingDesc') }}</div>
        </div>
      </li>
    </ul>
    <el-button type="primary" size="large" class="w-100% min-h-48px mt-20px" :loading="perpStore.starkSignatureLoading || perpStore.apiSignatureLoading" @click.stop="signLogin">{{ $t('continue') }}</el-button>
  </div>
</template>

<script setup lang='ts'>
import { usePerpStore } from '~/stores/perp'

const props = defineProps({
  getVisible: {
    type: Function as PropType<() => Ref<boolean>>,
    default: () => {
      return ref(false)
    }
  }
})

const emit = defineEmits(['success'])
const step = ref(1)

const perpStore = usePerpStore()


function signLogin() {
  return perpStore.login().then(() => {
    emit('success')
  }).catch(err => {
    console.log(err)
    // handleError(err)
  })
}

watch(() => props.getVisible().value, (val) => {
  if (val) {
    init()
  }
})

function init() {
  if (perpStore.apiKeys && !perpStore.l2KeyPair) {
    step.value = 2
  } else {
    step.value = 1
  }
}


onMounted(() => {
  init()
})



</script>

<style>

</style>
