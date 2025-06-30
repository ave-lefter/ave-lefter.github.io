<template>
  <el-popover
      trigger="hover"
      placement="top"
      content="黑名单列表(CA、DEV 、关键词)"
      :width="230"
      popper-class="text-center"
    >
    <template #reference>
      <el-button
        class="btn mr-8px ml-0 gray"
        :class="{active: pumpBlackList?.length >0}"
        style="margin-left: 0"
        @click="visible = !visible"
      >
        <Icon name="custom:black" class="text-16px"/>
      </el-button>
    </template>
  </el-popover>
  <el-dialog
    v-model="visible"
    width="780"
    height="590"
    :show-close="true"
    class="search-dialog"
    header-class="p-0!"
    @opened="openDialog"
  >
    <template #header>
      <span class="px-20px text-20px"> 黑名单 </span>
    </template>
    <div class="content">
      <div class="px-20px">
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
              class="text-12px text-[var(--d-F5F5F5-l-999999)]"
              name="ep:search"
            />
          </template>
          <template #suffix>
            <Icon
              v-if="query"
              name="pajamas:clear"
              class="color-[--d-666-l-999] text-12px hover:opacity-70% cursor-pointer mr-10px"
              @click="query = ''"
            />

            <el-popover
              v-model:visible="visible_popper"
              placement="bottom-start"
              trigger="hover"
            >
              <template #reference>
                <el-button class="btn mr-8px"
                  >添加
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
                    class="px-12px py-12px w-100% cursor-pointer hover:bg-[--d-333333-l-DDDDDD]"
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
                v-if="list?.filter((i) => i.type == item.value)?.length > 0"
              >
                {{ list?.filter((i) => i.type == item.value)?.length }}
              </template>
            </el-button>
          </div>

          <span>类型</span>
          <span>操作</span>
        </div>

        <el-scrollbar v-if="list?.length > 0" height="500px" min-height="400px">
          <ul class="content1">
            <li v-for="(row, $index) in list" :key="$index">
              <a href="" class="flex no-underline h-50px" @click.stop.prevent>
                <div>{{ row.address }}</div>
                <div>
                  <template v-if="row.type == 'dev'">开发者地址</template>
                  <template v-else-if="row.type == 'ca'">合约地址</template>
                  <template v-else-if="row.type == 'keyword'">关键词</template>
                  <template v-else>{{ row.type }}</template>
                </div>
                <div class="flex-end">
                  <el-button class="btn restore" @click.stop.prevent="restore(row)"
                    >恢复
                  </el-button>
                </div>
              </a>
            </li>
          </ul>
        </el-scrollbar>
        <AveEmpty v-else class="mt-150px" />
        <div class="text-14px count color-[--d-666-l-999]">
          总计<span
            class="ml-5px"
            :class="list?.length > 0 ? 'color-[--d-F5F5F5-l-333]' : ''"
            >{{ list.length }}</span
          >/500
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { isValidAddress } from '@/utils'
const { t } = useI18n()
const globalStore = useGlobalStore()
const { pumpBlackList } = storeToRefs(globalStore)
const visible = shallowRef(false)
const visible_popper = shallowRef(false)

// const query = useStorage('pump', {})

const query = shallowRef('')

const isRotate = shallowRef(false)
const active = shallowRef('all')
const typeList = computed(() => {
  return [
    {
      name: '全部',
      value: 'all',
    },
    {
      name: '开发者地址',
      value: 'dev',
    },
    {
      name: '合约地址',
      value: 'ca',
    },
    {
      name: '关键词',
      value: 'keyword',
    },
  ]
})
const list = computed(() => {
  return pumpBlackList.value || []
})

function openDialog() {}
function switchItem(item: { value: string }) {
  active.value = item.value
}
function add(item: { value: 'ca' | 'dev' | 'keyword' }) {
  if (!query.value) {
    ElMessage.error('请输入查询参数')
  }
  if (item.value == 'ca' || item.value == 'dev') {
    if (
      !isValidAddress(query.value, 'solana') &&
      !isValidAddress(query.value, 'bsc')
    ) {
      ElMessage.error('请输入正确的地址')
      return
    }
  }

  if (pumpBlackList.value) {
    const findIndex = pumpBlackList.value?.findIndex(
      (i) => query.value == i.address
    )
    if (findIndex !== -1) {
      ElMessage.success(t('黑名单已存在'))
    } else {
      pumpBlackList.value.push({ address: query.value, type: item.value })
    }
  } else {
    pumpBlackList.value = [{ address: query.value, type: item.value }]
  }
}
function restore(item: { address: string }) {
  const findIndex = pumpBlackList.value?.findIndex(
    (i) => item.address == i.address
  )
  if (findIndex !== -1) {
    pumpBlackList.value.splice(findIndex, 1)
  }
  ElMessage.success(t('已从黑名单删除'))
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
    background: var(--d-333333-l-DDDDDD);
    color: var(--d-999-l-666);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    padding: 14px;
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
  background: var(--d-222-l-F2F2F2);
  padding: 7px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 500;
  color: var(--d-F5F5F5-l-333);
  height: 28px;
  &.gray {
    color: var(--d-999-l-666);
    &.active,&:hover {
      color: var(--d-F5F5F5-l-333);
    }
  }
  &.restore {
    background: var(--d-333333-l-DDDDDD);
    &:hover {
      color: #fff;
      background: #3f80f7;
    }
  }
}
.content {
  border-top: 1px solid var(--d-333333-l-F2F2F2);
  margin-top: 20px;
}
.search-input {
  background: var(--d-333333-l-F2F2F2);
  padding: 0;

  border-radius: 4px;
}

.history {
  margin-top: 10px;
  min-height: 400px;
  .top {
    color: var(--d-666-l-999);
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
      &:hover {
        background-color: var(--d-2A2A2A-l-F2F2F2);
        .btn.restore {
          color: #fff;
          background: #3f80f7;
        }
      }
    }

    li > a:hover {
      text-decoration: none;
      background-color: var(--d-2A2A2A-l-F2F2F2);
      color: var(--a-text-1-color);
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
      color: var(--custom-font-1-color);
      &.green {
        color: #12b886;
      }
      &.red {
        color: #ff646d;
      }
    }
  }
  li > a {
    color: var(--a-text-1-color);
  }
}
.count {
  position: absolute;
  left: 20px;
  bottom: 20px;
}
</style>
