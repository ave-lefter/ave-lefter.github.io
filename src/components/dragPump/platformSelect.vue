<script setup lang="ts">
const visible_platforms = ref(false)
const pumpStore = usePumpStore()
const { token_logo_url } = useConfigStore()

const platforms = computed(() => {
  if (pumpStore.activeChain == 'solana') {
    return pumpStore.pump_solana_platforms.join(',')
  } else {
    return 'fourmeme'
  }
})
const platformsList = computed(() => {
  const list = pumpStore.pumpConfig.filter((i) => i.chain === pumpStore.activeChain)
  if(list[0] && list[0].platforms){
    return list[0].platforms.filter((i) => platforms.value.includes(i.platform)) || []
  }
  return []
})
</script>

<template>
  <el-popover v-model:visible="visible_platforms" placement="bottom-start" trigger="click">
    <template #reference>
      <div
        class="bg-[--d-222-l-F2F2F2] rounded-4px px-8px py-2px flex items-center text-12px cursor-pointer"
      >
        <el-image
          class="mr-5px rounded w-14px"
          :src="`${token_logo_url}${platformsList[0].platform_icon?.replace('/signals/', 'signals/')}`"
        />
        <span>{{ platformsList[0].platform_show }}</span>
        <Icon
          :name="visible_platforms ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
          class="text-16px color-[--d-F5F5F5-l-333]"
        />
      </div>
    </template>
    <template #default>
      <template v-for="item in pumpStore.pumpConfig" :key="item.chain">
        <template v-if="item.chain === pumpStore.activeChain">
          <div v-if="item.platforms?.length <= 1" class="pump-platforms">
            <el-checkbox
              v-for="i in item.platforms"
              :key="i.platform"
              :label="i.platform_show"
              :model-value="true"
              disabled
            >
              <el-image
                class="mr-5px rounded w-14px"
                :src="`${token_logo_url}${i.platform_icon?.replace('/signals/', 'signals/')}`"
              />
              {{ i.platform_show }}
            </el-checkbox>
          </div>

          <el-checkbox-group
            v-else
            v-model="pumpStore.pump_solana_platforms"
            class="pump-platforms"
          >
            <el-checkbox
              v-for="i in item.platforms"
              :key="i.platform"
              :label="i.platform_show"
              :value="i.platform"
              :disabled="
                pumpStore.pump_solana_platforms?.includes(i.platform) &&
                pumpStore.pump_solana_platforms?.length === 1
              "
            >
              <el-image
                class="mr-5px rounded w-14px"
                :src="`${token_logo_url}${i.platform_icon?.replace('/signals/', 'signals/')}`"
              />
              {{ i.platform_show }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
      </template>
    </template>
  </el-popover>
</template>

<style scoped lang="scss"></style>
