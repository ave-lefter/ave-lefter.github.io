<script setup lang="ts">
import DialogFavoriteManage from './dialogFavoriteManage2.vue'
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
    v-model="show"
    append-to-body
    :show-close="true"
    align-center
    width="720px"
    :class="`${theme} [--el-message-close-size:24px] favDialog2`"
  >
    <!-- <div
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
    </div> -->
    <DialogFavoriteManage :visible="show" :list="list" :get-data="getData" :loading="loading"></DialogFavoriteManage>
    <!-- <component :is="Component" :visible="show" :list="list" :get-data="getData" :loading="loading"/> -->
  </el-dialog>
</template>

<style lang="scss">
.favDialog2.el-dialog{
  /* border:1px solid; */
  padding: 0;
 .el-dialog__header{
    padding: 0;
    .el-message-box__title{
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
    .el-message-box__headerbtn{
      height: 56px;
    }
  }
  .el-message-box__input{
    padding-top: 8px;
  }
  .el-message-box__btns{
    padding-top: 20px;
  }
}
</style>
