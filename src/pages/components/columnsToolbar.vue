<script setup>
import {VueDraggable} from 'vue-draggable-plus'
import {useStorage} from '@vueuse/core'
import {cloneDeep} from 'lodash-es'
import {getDefaultColumns, getHotOptions} from './hotRank/columnRender/hotColumusService'

const {t} = useI18n()
const dialogVisible = ref(false)
const storeColumns =  useStorage('hotUserTableColumns',getDefaultColumns(t))

const props = defineProps({
  activeCategory: {
    type: String,
    default: ''
  }
})

const themeStore = useThemeStore()
const hotOptions = computed(() => getHotOptions(t))

console.log('props.activeCategory', props.activeCategory)
const initColumns = ref([])
const modelColumns = ref(cloneDeep(storeColumns.value.filter((item) => item.isHide)))
console.log(modelColumns.value, 'modelColumns.value')

// 当对话框打开时，更新本地列配置
const openDialog = () => {
  dialogVisible.value = true
  initColumns.value = getDefaultColumns(t)
  modelColumns.value = cloneDeep(storeColumns.value.filter((item) => item.isHide))
}

const handleSelect = (item) => {
  const index = modelColumns.value.findIndex((arr) => arr.render === item)
  if (index !== -1) {
    modelColumns.value.splice(index, 1)
  } else {
    const data = initColumns.value.find((arr) => arr.render === item)
    if (data) {
      modelColumns.value.push(cloneDeep({...data, isHide: true}))
    }
  }
}

// 保存列配置
const handleConfirm = () => {
  dialogVisible.value = false
  storeColumns.value = cloneDeep(modelColumns.value)
}

const handleReset = () => {
  dialogVisible.value = false
  storeColumns.value = getDefaultColumns(t)
  modelColumns.value = getDefaultColumns(t)
}
</script>

<template>
  <div>
    <div @click="openDialog">
      <div
        v-if="props.activeCategory === 'hot'"
        class="flex items-center color-[--d-999-l-666] cursor-pointer min-w-63px">
        <Icon
          name="custom:order"
          class="text-16px"
        />
        <span class="text-12px ml-2px">{{ t("custom") }}</span>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" append-to-body :title="$t('customizeScreener')" width="820">
      <div class="content-bg">
        <div class="draggable-box-bg">
          <VueDraggable v-model="modelColumns" :animation="300" ghostClass="ghost" class="draggable-list-bg">
            <template v-for="item in modelColumns" :key="item.field || item.render">
              <div v-if="item.isHide" class="draggable-columns-bg" :class="item.fixed ? 'columns-bg-disabled' : ''">
                {{ item.label }}
                <Icon name="custom:handle" class="ml-2 color-[--d-666-l-999]"/>
              </div>
            </template>
          </VueDraggable>
        </div>
        <div v-for="(option, index) in hotOptions" :key="index" class="option-bg">
          <div>{{ option.label }}</div>
          <div class="options-list-bg">
            <div
              v-for="(item, i) in option.list"
              :key="i"
              class="options-list-item"
              :class="[modelColumns.find((arr) => arr.render === item) && 'options-list-item-select']"
              @click="handleSelect(item)">
              {{ initColumns.find((arr) => arr.render === item)?.label }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-20px mt-40px">
          <el-button
            :color="themeStore.isDark ? '#333':'#F2F2F2'"
            class="flex-1"
            size="large"
            @click="handleReset"
          >
            {{ $t('reset') }}
          </el-button>
          <el-button
            type="primary"
            class="flex-1"
            size="large"
            @click="handleConfirm"
          >
            {{ $t('confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
:root {
  --columns-toolbar-button-bg: #222;
  --columns-toolbar-button-color: #fff;
  --columns-toolbar-text-color: #000;
  --columns-toolbar-checkbox-color: #000;
  --columns-draggable-box-bg: #f2f2f2;
  --columns-options-list-item-bg: #f2f2f2;
  --columns-options-list-item-bg-select: rgba(40, 109, 255, 0.10);
  --columns-options-list-item-color: #333;
  --columns-options-list-item-color-select: #286DFF;
  --columns-toolbar-vector-title-color: #286DFF;
  --columns-draggable-columns-bg: #333;
}

.dark {
  --columns-toolbar-button-bg: #fff;
  --columns-toolbar-button-color: #222;
  --columns-toolbar-text-color: #fff;
  --columns-toolbar-checkbox-color: #fff;
  --columns-draggable-box-bg: #333;
  --columns-options-list-item-bg: #333;
  --columns-options-list-item-bg-select: #999;
  --columns-options-list-item-color: #999;
  --columns-options-list-item-color-select: #fff;
  --columns-toolbar-vector-title-color: #fff;
  --columns-draggable-columns-bg: #999;
}
</style>

<style lang="scss" scoped>
.toolbar-vector-title {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  color: var(--columns-toolbar-vector-title-color);
  cursor: pointer;
}

.toolbar-vector {
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: var(--custom-text-5-color);
}

.content-bg {
  // padding: 1.25rem;
  // background: var(--columns-toolbar-button-color);
  // background: var(--a-popup-bg-color);
}

.toolbar-vector-container {
  cursor: pointer;
  min-width: 63px;
}

.draggable-box-bg {
  padding: 1.25rem;
  min-height: 8.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--columns-draggable-box-bg);


  .draggable-list-bg {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;

    .draggable-columns-bg {
      padding: 0 1rem;
      font-size: 0.75rem;
      height: 1.5rem;
      line-height: 1.5rem;
      border-radius: 1.875rem;
      background: var(--columns-toolbar-button-color);
      color: var(--columns-toolbar-text-color);
      border: 1px solid var(--columns-draggable-columns-bg);
      cursor: move;
      display: flex;
      align-items: center;
    }
  }
}

.option-bg {
  margin-top: 1.25rem;
  color: var(--columns-toolbar-text-color);

  .options-list-bg {
    margin-top: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;

    .options-list-item {
      padding: 0 1rem;
      font-size: 0.75rem;
      height: 1.5rem;
      border-radius: 1.875rem;
      // background: var(--columns-options-list-item-bg);
      color: #999999;
      border: 1px solid #999999;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .options-list-item-select {
      color: #286DFF;
      // background: var(--columns-options-list-item-bg-select);
      border: 1px solid #286DFF;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.button-container {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 30px;
}

.reset-button {
  display: flex;
  width: 13.3125rem;
  height: 2.5rem;
  padding: 0.5rem 2.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
  background: var(--custom-bg-9-color);
  color: var(--custom-font-1-color);
  cursor: pointer;
  margin-right: 20px;
}

.confirm-button {
  display: flex;
  width: 13.3125rem;
  height: 2.5rem;
  padding: 0.5rem 2.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
  background: var(--columns-toolbar-button-bg);
  color: var(--columns-toolbar-button-color);
  cursor: pointer;
}

.columns-bg {
  padding: 15px;
  height: 40px;
  border: 1px solid #666;
  border-radius: 8px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: move;
}

.columns-bg:first-child {
  margin-top: 0;
}

.columns-bg-disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
  pointer-events: none;
  display: none !important;
}

.handle {
  cursor: move;
  margin-left: 8px;
  color: #999;
}

.ghost {
  opacity: 0.5;
  background: #e6e6e6;
}
</style>
