<script setup lang="ts">
import Holding from './holding.vue'
const route = useRoute()
const { t } = useI18n()
const activeName = ref(route.query.t == 'orders' ? 'orders' : 'holding')
const tabs = computed(() => {
  return [
    { label: t('holding'), value: 'holding' },
    { label: t('orders'), value: 'orders' },
    { label: t('fundingRate'), value: 'fundingRate' },
    { label: t('fundingRecord'), value: 'fundingRecord' },
  ]
})
const activeComponent = computed(() => {
  return {
    holding: Holding,
    orders: defineAsyncComponent(() => import('./orders.vue')),
    fundingRate: defineAsyncComponent(() => import('./fundingRate.vue')),
    fundingRecord: defineAsyncComponent(() => import('./fundingRecord.vue')),
  }[activeName.value]
})
</script>

<template>
  <el-tabs
    v-model="activeName"
    class="flex-1 bg-[--main-bg] [--el-text-color-primary:--third-text] [--el-color-primary:--main-text] [--el-border-color-light:--main-divider]"
  >
    <el-tab-pane v-for="el in tabs" :key="el.value" :label="el.label" :name="el.value" />
  </el-tabs>
  <component :is="activeComponent" />
</template>
