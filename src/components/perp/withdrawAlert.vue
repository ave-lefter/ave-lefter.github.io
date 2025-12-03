<template>
  <el-alert
    v-if="isCanNormalWithdrawableAmount"
    type="warning"
    :closable="false"
    style="--el-alert-icon-large-size: 20px"
  >
    <div class="flex items-center justify-center w-[calc(100vw-100px)]">
      <span class="text-12px mr-10px">{{ $t('canPerpWithdraw', {}) }}</span>
      <el-button type="primary" size="small" :loading="loading"  @click="_ETHWithdrawContract">{{ $t('receive') }}</el-button>
    </div>
  </el-alert>
</template>

<script setup lang='ts'>
  import { getNormalWithdrawableAmount } from '~/api/perp'
  import { ETHWithdrawContract } from '~/api/perp/utils'
  import { usePerpStore } from '~/stores/perp'
  const perpStore = usePerpStore()

  const { t } = useI18n()

  const { isCanNormalWithdrawableAmount } = usePerp()

  function _getNormalWithdrawableAmount() {
    getNormalWithdrawableAmount().then(res => {
      perpStore.normalWithdrawableAmount = res?.amount || '0'
    }).catch(err => {
      console.log(err)
       perpStore.normalWithdrawableAmount = '0'
    })
  }

  const loading = ref(false)
  function _ETHWithdrawContract() {
    loading.value = true
    ETHWithdrawContract().then(res => {
      return res.wait()
    }).then(res => {
      console.log(res)
       _getNormalWithdrawableAmount()
      ElNotification({ type: 'success', message:  t('claimedSuccess') })
    }).catch(err => {
      handleError(err)
    }).finally(() => {
      loading.value = false
    })
  }

  onMounted(() => {
    _getNormalWithdrawableAmount()
  })
</script>

<style>

</style>
