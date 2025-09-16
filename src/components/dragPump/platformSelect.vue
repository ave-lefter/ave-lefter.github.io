<script setup lang="ts">
const visible_platforms = ref(false)
const pumpStore = usePumpStore()
const { token_logo_url } = useConfigStore()

const platforms = computed(() => {
  return pumpStore.pumpV3?.[pumpStore.activeChain]?.platforms?.join(',')
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
        class="bg-[--d-151A22-l-E8F1FF] rounded-4px px-8px py-2px flex items-center text-12px cursor-pointer drag-cancel"
      >
          <template v-for="(i, $index) in platformsList" :key="$index">
            <el-image
              class="mr-5px rounded w-14px"
              :src="`${token_logo_url}${i.platform_icon?.replace(
                '/signals/',
                'signals/'
              )}`"
            />
            <span v-if="platformsList?.length == 1">{{
              i.platform_show
            }}</span>
          </template>
        <Icon
          :name="visible_platforms ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
          class="text-16px color-[--d-F5F5F5-l-333]"
        />
      </div>
    </template>
    <template #default>
      <template v-for="item in pumpStore.pumpConfig" :key="item.chain">
        <template v-if="item.chain === pumpStore.activeChain">
          <el-checkbox-group
            v-model="pumpStore.pumpV3[pumpStore.activeChain].platforms as string[]"
            class="pump-platforms"
          >
            <el-checkbox
              v-for="i in item.platforms"
              :key="i.platform"
              :label="i.platform_show"
              :value="i.platform"
              :disabled="
                pumpStore.pumpV3[pumpStore.activeChain].platforms?.includes(i.platform) &&
                pumpStore.pumpV3[pumpStore.activeChain].platforms?.length === 1
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
