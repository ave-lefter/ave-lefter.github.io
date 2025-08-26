<template>
  <el-button
    v-tooltip="t('backlist')"
    class="btn mr-8px ml-0 gray"
    :class="buttonClass"
    style="margin-left: 0"
    @click="visible = !visible"
  >
    <Icon name="custom:pump-black" :class="referenceClass"/>
  </el-button>
  <el-dialog
    v-model="visible"
    width="780"
    height="590"
    :show-close="true"
    class="search-dialog custom-dialog new-dialog"
    header-class="p-0!"
    append-to-body
    lock-scroll
    draggable
    :destroy-on-close="true"
    @opened="openDialog"
  >
    <template #header>
      <span class="px-20px text-20px"> {{ $t('black') }} </span>
    </template>
    <div class="content mb-20px">
      <div class="px-20px mt-20px">
        <el-input
          ref="inputSearch"
          v-model.trim="query"
          class="search-input px-20px"
          :placeholder="$t('enterAddress/token')"
          clearable
          autofocus
          size="large"
        >
          <template #prefix>
            <Icon
              class="text-12px text-[--third-text]"
              name="custom:search"
            />
          </template>
          <template #suffix>
            <Icon
              v-if="query"
              name="pajamas:clear"
              class="color-[--third-text] text-12px hover:opacity-70% cursor-pointer mr-10px"
              @click="query = ''"
            />

            <el-popover
              v-model:visible="visible_popper"
              placement="bottom-start"
              trigger="click"
              popper-class="[&&]:[--el-popover-padding:12px_0_12px_0] new-popover"
            >
              <template #reference>
                <el-button class="btn mr-8px"
                  >{{ $t('add') }}
                  <Icon
                    :name="
                      isRotate
                        ? 'radix-icons:triangle-up'
                        : 'radix-icons:triangle-down'
                    "
                    class="text-16px ml-4px"
                  />
                </el-button>
              </template>
              <template #default>
                <ul class="type-list">
                  <li
                    v-for="(item, $index) in typeList?.slice(1)"
                    :key="$index"
                    class="px-12px py-12px w-100% cursor-pointer hover:bg-[--border]"
                    @click="add(item)"
                  >
                    {{ item.name }}
                  </li>
                </ul>
              </template>
            </el-popover>
          </template>
        </el-input>
      </div>

      <div class="history">
        <div class="top h-39px">
          <div class="tabs">
            <el-button
              v-for="(item, index) in typeList"
              :key="index"
              class="btn"
              :class="active == item.value ? 'active' : ''"
              @click="switchItem(item)"
              >{{ item.name }}
              <template
                v-if="pumpBlackList?.filter((i) => i.type == item.value)?.length > 0"
              >
                {{ pumpBlackList?.filter((i) => i.type == item.value)?.length }}
              </template>
            </el-button>
          </div>

          <span>{{ $t('type') }}</span>
          <span>{{ $t('operate') }}</span>
        </div>

        <el-scrollbar v-if="list?.length > 0" height="400px" min-height="400px">
          <ul class="content1 mb-20px">
            <li v-for="(row, $index) in list" :key="$index">
              <a href="" class="flex no-underline h-50px" @click.stop.prevent>
                <div>{{ row.address }}</div>
                <div>
                  <template v-if="row.type == 'dev'">{{ $t('dev') }}</template>
                  <template v-else-if="row.type == 'ca'">{{ $t('ca') }}</template>
                  <template v-else-if="row.type == 'keyword'">{{ $t('keywords') }}</template>
                  <template v-else>{{ row.type }}</template>
                </div>
                <div class="flex-end">
                  <el-button class="btn restore" @click.stop.prevent="restore(row)"
                    >{{ $t('remove') }}
                  </el-button>
                </div>
              </a>
            </li>
          </ul>
        </el-scrollbar>
        <div v-else class="mt-150px flex items-center justify-center flex-col" >
          <img v-if="isDark" src="@/assets/images/balck_blackList_empty.svg" alt="" width="61px">
          <img v-else src="@/assets/images/light_blackList_empty.svg" alt=""  width="61px">
          <span class="block text-12px color-[--third-text] mt-6px">{{ $t('emptyNoData') }}</span>
        </div>
      </div>
    </div>
    <div class="text-14px count color-[--third-text]  w-full px-20px py-20px">
      {{ $t('total') }}<span
        class="ml-5px"
        :class="list?.length > 0 ? 'color-[--main-text]' : ''"
        >{{ list.length }}</span
      >/500
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { isValidAddress } from '@/utils'
const { t } = useI18n()
const globalStore = useGlobalStore()
const { pumpBlackList, isDark } = storeToRefs(globalStore)
const visible = shallowRef(false)
const visible_popper = shallowRef(false)


withDefaults(defineProps<{
  buttonClass?: string
  referenceClass?: string
}>(),{
  buttonClass: '',
  referenceClass: 'text-16px'
})
const query = shallowRef('')

const isRotate = shallowRef(false)
const active = shallowRef('all')
type TypeValue = 'all' | 'dev' | 'ca' | 'keyword'
type TypeItem = {
  name: string
  value: TypeValue
}
const typeList = computed<TypeItem[]>(() => {
  return [
    {
      name: t('all'),
      value: 'all',
    },
    {
      name: t('dev'),
      value: 'dev',
    },
    {
      name: t('ca'),
      value: 'ca',
    },
    {
      name: t('keywords'),
      value: 'keyword',
    },
  ]
})

const list = computed(() => {
  const list = pumpBlackList.value?.slice() || []
  if (active.value == 'dev') {
    return list.filter(i => i.type == 'dev') || []
  } else if (active.value == 'ca') {
    return list?.filter(i => i.type == 'ca') || []
  } else if (active.value == 'keyword') {
    return list?.filter(i => i.type == 'keyword') || []
  } else {
    return list || []
  }
})


function openDialog() {}
function switchItem(item: { value: 'all' | 'dev' | 'ca' | 'keyword' }) {
  active.value = item.value
}
function add(item: { value:  'dev' | 'ca' | 'keyword' }) {
  if (pumpBlackList.value?.length > 499) {
    ElMessage.error(t('blacklistLimit'))
    return
  }
  if (!query.value) {
    ElMessage.error(t('plsSearchTip'))
    return
  }
  if (item.value == 'ca' || item.value == 'dev') {
    if (
      !isValidAddress(query.value, 'solana') &&
      !isValidAddress(query.value, 'bsc')
    ) {
      ElMessage.error(t('plsCorrectCa'))
      return
    }
  }
  if (pumpBlackList.value) {
    const findIndex = pumpBlackList.value?.findIndex(
      (i) => query.value == i.address && i.type == item.value
    )
    if (findIndex !== -1) {
      ElMessage.error(t('blacklistExists'))
    } else {
      pumpBlackList.value.push({ address: query.value, type: item.value })
    }
  } else {
    pumpBlackList.value = [{ address: query.value, type: item.value }]
  }
}
function restore(item: { address: string, type: string }) {
  const findIndex = pumpBlackList.value?.findIndex(
    (i) => item.address == i.address && i.type == item.type
  )
  if (findIndex !== -1) {
    pumpBlackList.value.splice(findIndex, 1)
  }
  ElMessage.success(t('removedBacklist'))
}
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  button {
    border: none;
    // font-size: 14px;
    background: var(--dialog-bg);
    color: var(--third-text);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    padding: 4px 10px;
    height: 20px;
    text-align: center;
    & + button {
      margin-left: 8px;
    }
    &.active {
      color: #fff;
      background: #3f80f7;
    }
    .swap {
      background: #12b8861a;
      border-radius: 4px;
      padding: 5px;
      color: #12b886;
    }
  }
}
.btn {
  border: none;
  background: var(--dialog-bg);
  padding: 7px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 500;
  color: var(--main-text);
  height: 28px;
  &.gray {
    color: var(--secondary-text);
    &.active,&:hover {
      color: var(--main-text);
    }
  }
  &.restore {
    background: var(--border);
    &:hover {
      color: #fff;
      background: #3f80f7;
    }
  }
}
.content {
  border-top: 1px solid var(--border);
  margin-top: 20px;
}
.search-dialog.el-dialog {
  .search-input {
  background: var(--border);
  padding: 0;
  border-radius: 4px;
  :deep().el-input__wrapper {
    border-bottom: 1px solid var(--border);
    .el-input__inner::placeholder {
      color: var(--third-text);
    }
  }
}
}
.history {
  margin-top: 10px;
  min-height: 400px;
  .top {
    color: var(--third-text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    > :nth-child(1) {
      // width: 150px;
      font-size: 12px;
      flex: 3;
      text-align: left;
    }
    > :nth-child(2) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(3) {
      flex: 1;
      text-align: right;
    }
  }
  .content1 {
    li {
      padding: 0 20px;
      border-bottom: 1px solid var(--border);
      &:hover {
        background-color: var(--border);
        .btn.restore {
          color: #fff;
          background: #3f80f7;
        }
      }
    }

    li > a:hover {
      text-decoration: none;
      background-color: var(--border);
      opacity: 1;
    }
    li:nth-child(1) .flex {
      margin-top: 0;
    }
    .flex {
      // padding: 8px 0;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 12px;
      > :nth-child(1) {
        // width: 150px;
        flex: 3;
        font-size: 12px;
        text-align: left;
      }
      > :nth-child(2) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(3) {
        flex: 1;
        text-align: right;
      }
    }
    > span {
      &.green {
        color: #12b886;
      }
      &.red {
        color: #ff646d;
      }
    }
  }
}
.count {
  position: absolute;
  left: 0;
  bottom: 0;
}
/* 防止 el-dialog__body 撑开 dialog 本体 */
.custom-dialog .el-dialog__body {
  padding: 0;
  max-height: 70vh; /* 限制最大高度 */
  overflow: hidden; /* 避免双滚动 */
}

/* el-scrollbar 内部设置滚动区域 */
.dialog-scrollbar {
  height: 70vh;            /* 或你希望的最大高度 */
  overflow: hidden;        /* el-scrollbar 控制滚动 */
}

/* 可选内容样式 */
.dialog-content {
  padding: 20px;
}

</style>
