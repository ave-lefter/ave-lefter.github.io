<script setup lang="ts">
import DialogFavoriteManage from './dialogFavoriteManage.vue'
import type {GetUserFavoriteGroupsResponse} from '~/api/fav'

const props = defineProps({
  visible: Boolean,
  isScroll: Boolean,
  loading: Boolean,
  list: {
    type: Array<GetUserFavoriteGroupsResponse>,
    default: () => []
  },
  getData: {
    type: Function,
    default: () => {
    }
  }
})
const {t} = useI18n()
const emit = defineEmits(['update:visible'])
const {theme} = useThemeStore()
const activeTab = shallowRef('dialogFavoriteManage')

const show = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})
const tabs = computed(() => [
  {name: t('favoriteManage'), id: 'dialogFavoriteManage'},
  {name: t('groupManage'), id: 'dialogGroupManage'}
])
const components = {
  dialogFavoriteManage: DialogFavoriteManage,
  dialogGroupManage: defineAsyncComponent(() => import('./dialogGroupManage.vue')),
}

watch(show, (val) => {
  if (val) {
    props.getData()
  }

})

const Component = computed(() => {
  const id = tabs.value.find(el => el.id === activeTab.value)?.id as keyof typeof components
  return components[id] || components.dialogFavoriteManage
})
</script>

<template>
  <el-dialog
    v-if="show"
    v-model="show"
    :title="t('editFav')"
    append-to-body
    width="800px"
    destroy-on-close
    :class="`${theme} [--el-message-close-size:24px]`"
  >
    <div
      class="flex items-center justify-between"
    >
      <div
        class="w-full text-left text-16px mt-5px mb-12px"
      >
        <a
          v-for="(item, $index) in tabs"
          :key="$index" href="javascript:;"
          :class="`decoration-none inline-block text-16px pb-12px border-b-solid border-b-2px mr-24px text-center
          ${item.id === activeTab?'color-[--main-text] border-b-[--main-text]':'color-[--third-text] border-b-transparent'}`"
          @click.stop.prevent="activeTab=item.id"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
    <component :is="Component" :visible="show" :list="list" :get-data="getData" :loading="loading"/>
  </el-dialog>
</template>

<style scoped>

</style>
