<template>
  <div v-show="step === 1" class="text-14px color-[--main-text] lh-20px">
    <div>继续操作即表示您同意条款和条件，并承认您已阅读并理解协议免责声明，以及以下内容: </div>
    <ul class="bg-[--border] p-16px mt-16px">
      <li class="flex items-center">
        <Icon name="bi:check-circle-fill" class="text-16px mr-8px" />
        <span class="flex-1">我知道如果使用杠杆，进入仓位后杠杆大小可能会变化。</span>
      </li>
      <li class="flex items-center mt-16px">
        <Icon name="bi:check-circle-fill" class="text-16px mr-8px" />
        <span class="flex-1">我理解使用全仓模式下使用保证金的规则和风险。</span>
      </li>
      <li class="flex items-center mt-16px">
        <Icon name="bi:check-circle-fill" class="text-16px mr-8px" />
        <span class="flex-1">我理解与盈亏结算、破产、保险及分摊亏损相关的规则和风险。</span>
      </li>
      <li class="flex items-center mt-16px">
        <Icon name="bi:check-circle-fill" class="text-16px mr-8px" />
        <span class="flex-1">我明白如果我的持仓违反任何保证金维持要求，我的账户可能会被部分或完全强平</span>
      </li>
    </ul>
    <el-button type="primary" size="large" class="w-100% min-h-48px mt-20px" @click.stop="step = 2">同意并继续</el-button>
  </div>
  <div v-show="step === 2" class="text-14px color-[--main-text] lh-20px">
    <div>您将收到2个签名请求。签名是免费的，不会触发任何交易。</div>
    <ul class="bg-[--border] p-16px mt-16px">
      <li class="flex">
        <div v-if="!perpStore.apiKeys" class="relative flex items-center justify-center mr-8px w-20px h-20px text-14px">
          <span class="relative z-2 w-20px h-20px rd-50% bg-[--icon-color] text-center lh-19px">1</span>
          <Icon v-if="perpStore.apiSignatureLoading" name="line-md:loading-loop" class="text-26px absolute left-50% top-50% -translate-50% z-1 color-[--up-color]" />
        </div>
        <Icon v-else name="bi:check-circle-fill" class="text-22px mr-8px color-[--up-color]" />
        <div class="flex-1">
          <div class="text-16px font-500 mb-5px">验证所有权</div>
          <div class="text-14px font-400 color-[--secondary-text]">确认您是此钱包的所有者</div>
        </div>
      </li>
      <li class="flex mt-24px">
        <div v-if="!perpStore.l2KeyPair" class="relative flex items-center justify-center mr-8px w-20px h-20px text-14px">
          <span class="relative z-2 w-20px h-20px rd-50% bg-[--icon-color] text-center lh-19px">2</span>
          <Icon v-if="perpStore.starkSignatureLoading" name="line-md:loading-loop" class="text-26px absolute left-50% top-50% -translate-50% z-1 color-[--up-color]" />
        </div>
        <Icon v-else name="bi:check-circle-fill" class="text-22px mr-8px color-[--up-color]" />
        <div class="flex-1">
          <div class="text-16px font-500 mb-5px">启用交易</div>
          <div class="text-14px font-400 color-[--secondary-text]">启用对我们API的安全访问，以进行快速交易</div>
        </div>
      </li>
    </ul>
    <el-button type="primary" size="large" class="w-100% min-h-48px mt-20px" :loading="perpStore.starkSignatureLoading || perpStore.apiSignatureLoading" @click.stop="signLogin">继续</el-button>
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
