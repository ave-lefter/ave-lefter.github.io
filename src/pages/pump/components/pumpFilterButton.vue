<template>
  <div :class="['filter-btn', { active: visible }, filterNumber > 0 ? 'hight' : '']" @click="handleClick">
    <Icon id="custom-filter" name="custom:filter" class="text-10px cursor-pointer"
      :class="!hideReferenceText ? 'mr-3px' : ''" />
    <span v-if="!hideReferenceText">{{ $t('filter') }}</span>
    <span v-if="filterNumber > 0" class="filter-number">{{ filterNumber }}</span>
  </div>
</template>

<script setup lang="ts">
import { usePumpTableDataFetching } from '@/utils/index.js'
import { getFilterNumber } from '../utils'

const props = defineProps({
  storage: {
    type: String,
    default: 'pumpFilter_bsc_new'
  },
  hideReferenceText: {
    type: Boolean
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])

const tableFilter = usePumpTableDataFetching(props.storage)

const filterNumber = computed(() => {
  return getFilterNumber(tableFilter.value)
})

function handleClick() {
  emit('update:visible', true)
}
</script>

<style scoped lang="scss">
.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  cursor: pointer;
  color: var(--third-text);
  background: var(--main-input-button-bg);
  border-radius: 4px;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0;
  font-weight: 500;
  box-sizing: border-box;
  height: 26px;
  position: relative;

  &.hight {
    color: var(--main-text)
  }

  img {
    margin-right: 2px;
  }

  .filter-number {
    position: relative;
    display: inline-block;
    border-radius: 2px;
    width: 14px;
    height: 14px;
    text-align: center;
    background-color: var(--third-text);
    color: var(--main-text);
    margin-left: 4px;
    font-size: 10px;
  }

  &:hover {
    cursor: pointer;
    color: var(--main-text);

    .iconify {
      color: var(--main-text);
    }
  }

  &.active {
    color: var(--main-text);
    background: var(--dialog-tab-active-bg);
  }
}
</style>
