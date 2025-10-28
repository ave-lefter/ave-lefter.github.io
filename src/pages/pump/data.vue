<template>
  <div @click.stop.prevent>
    <span class="text-12px color-[--main-text]">{{ $t('MC') }}($)</span>
    <div class="flex-between mt-8px gap-9px">
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.mc.minColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <el-input
            v-model.trim="pumpSetting.data.mc.minSize"
            class="number-input"
            size="small"
            @blur="(e) => onInput((e.target as HTMLInputElement).value, 'mc', 'min')"
          >
          </el-input>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-2px cursor-pointer"
            @click.stop.prevent="reset('mc', 'min')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >0 - {{ formatNumber(pumpSetting.data.mc.minSize || 0, 2) }}</span
        >
      </div>
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.mc.middleColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <el-input
            v-model.trim="pumpSetting.data.mc.middleSize"
            class="number-input"
            size="small"
            @blur="(e) => onInput((e.target as HTMLInputElement).value, 'mc', 'middle')"
          >
          </el-input>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-2px cursor-pointer"
            @click.stop.prevent="reset('mc', 'middle')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >{{ formatNumber(pumpSetting.data.mc.minSize || 0, 2) }} -
          {{ formatNumber(pumpSetting.data.mc.middleSize || 0, 2) }}</span
        >
      </div>
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.mc.maxColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <span class="text-12px color-[--main-text]">Above</span>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-10px cursor-pointer"
            @click.stop.prevent="reset('mc', 'max')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >{{ formatNumber(pumpSetting.data.mc.middleSize || 0, 2) }}+</span
        >
      </div>
    </div>
    <span class="text-12px color-[--main-text] mt-16px block">{{ $t('vol') }}($)</span>
    <div class="flex-between mt-8px gap-9px">
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.vol.minColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <el-input
            v-model.trim="pumpSetting.data.vol.minSize"
            class="number-input"
            size="small"
            @blur="(e) => onInput((e.target as HTMLInputElement).value, 'vol', 'min')"
          >
          </el-input>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-2px cursor-pointer"
            @click.stop.prevent="reset('vol', 'min')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >0 - {{ formatNumber(pumpSetting.data.vol.minSize || 0, 2) }}</span
        >
      </div>
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.vol.middleColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <el-input
            v-model.trim="pumpSetting.data.vol.middleSize"
            class="number-input"
            size="small"
            @blur="(e) => onInput((e.target as HTMLInputElement).value, 'vol', 'middle')"
          >
          </el-input>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-2px cursor-pointer"
            @click.stop.prevent="reset('vol', 'middle')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >{{ formatNumber(pumpSetting.data.vol.minSize || 0, 2) }} -
          {{ formatNumber(pumpSetting.data.vol.middleSize || 0, 2) }}</span
        >
      </div>
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.vol.maxColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <span class="text-12px color-[--main-text]">Above</span>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-10px cursor-pointer"
            @click.stop.prevent="reset('vol', 'max')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >{{ formatNumber(pumpSetting.data.vol.middleSize || 0, 2) }}+</span
        >
      </div>
    </div>
    <span class="text-12px color-[--main-text] mt-16px block">{{ $t('Holders') }}</span>
    <div class="flex-between mt-8px gap-9px">
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.holders.minColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <el-input
            v-model.trim="pumpSetting.data.holders.minSize"
            class="number-input"
            size="small"
            @blur="(e) => onInput((e.target as HTMLInputElement).value, 'holders', 'min')"
          >
          </el-input>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-2px cursor-pointer"
            @click.stop.prevent="reset('holders', 'min')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >0 - {{ formatNumber(pumpSetting.data.holders.minSize || 0, 2) }}</span
        >
      </div>
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.holders.middleColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <el-input
            v-model.trim="pumpSetting.data.holders.middleSize"
            class="number-input"
            size="small"
            @blur="(e) => onInput((e.target as HTMLInputElement).value, 'holders', 'middle')"
          >
          </el-input>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-2px cursor-pointer"
            @click.stop.prevent="reset('holders', 'middle')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >{{ formatNumber(pumpSetting.data.holders.minSize || 0, 2) }} -
          {{ formatNumber(pumpSetting.data.holders.middleSize || 0, 2) }}</span
        >
      </div>
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.holders.maxColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <span class="text-12px color-[--main-text]">Above</span>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-10px cursor-pointer"
            @click.stop.prevent="reset('holders', 'max')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >{{ formatNumber(pumpSetting.data.holders.middleSize || 0, 2) }}+</span
        >
      </div>
    </div>
    <!-- <span class="text-12px color-[--main-text] mt-16px block">{{ $t('twitterTime') }}</span> -->
<!--
    <div class="flex-between mt-8px gap-9px">
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start relative">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.twitter.minColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <el-input
            v-model.trim="pumpSetting.data.twitter.minSize"
            class="number-input"
            size="small"
            @blur="(e) => onInput((e.target as HTMLInputElement).value, 'twitter', 'min')"
          >
          </el-input>
          <SelectUnit v-model="pumpSetting.data.twitter.minUnit"/>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-2px cursor-pointer"
            @click.stop.prevent="reset('twitter', 'min')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >0 - {{ formatNumber(pumpSetting.data.twitter.minSize || 0, 2) }}</span
        >
      </div>
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start relative">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.twitter.middleColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <el-input
            v-model.trim="pumpSetting.data.twitter.middleSize"
            class="number-input"
            size="small"
            @blur="(e) => onInput((e.target as HTMLInputElement).value, 'twitter', 'middle')"
          >
          </el-input>
          <SelectUnit v-model="pumpSetting.data.twitter.middleUnit"/>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-2px cursor-pointer"
            @click.stop.prevent="reset('twitter', 'middle')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >{{ formatNumber(pumpSetting.data.twitter.minSize || 0, 2) }} -
          {{ formatNumber(pumpSetting.data.twitter.middleSize || 0, 2) }}</span
        >
      </div>
      <div class="item flex-1">
        <div class="border-1px border-solid border-[--border] px-4px py-1px flex-start">
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.data.twitter.maxColor"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <span class="text-12px color-[--main-text]">Above</span>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-10px cursor-pointer"
            @click.stop.prevent="reset('twitter', 'max')"
          />
        </div>
        <span class="text-8px color-[--third-text] mt-2px"
          >{{ formatNumber(pumpSetting.data.twitter.middleSize || 0, 2) }}+</span
        >
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { useCssVar, useLocalStorage } from '@vueuse/core'
import SelectUnit from './selectUnit.vue'
import { getTwitterSeconds } from '@/utils/index'
const emit = defineEmits(['blur', 'focus'])
const globalStore = useGlobalStore()
const { mode, pumpSetting } = storeToRefs(globalStore)
// if (!pumpSetting.value.data.mc.minColor) {
//   const el = useTemplateRef('el')
//   const cssMainText = useCssVar('--main-text', el)
//   const mcMinColor = useLocalStorage('mcMinColor', cssMainText.value)
//   pumpSetting.value.data.mc.minColor = mcMinColor.value || ''
// }

watch(mode, () => {
  pumpSetting.value.data.mc.minColor = getCssVariable('--main-text')
  pumpSetting.value.data.vol.minColor = getCssVariable('--main-text')
  pumpSetting.value.data.holders.minColor = getCssVariable('--main-text')
})
const onInput = (val: string, type: string, dir: string) => {
  // 只保留数字，value 是 string
  let value: string = val.replace(/\D/g, '')

  if (type === 'mc') {
    if (value !== '') {
      const middleSize = pumpSetting.value.data?.mc?.middleSize ?? 0
      const minSize = pumpSetting.value.data?.mc?.minSize ?? 0
      if (dir === 'min') {
        if (Number(value) >= middleSize) {
          pumpSetting.value.data.mc.minSize = middleSize
        } else {
          pumpSetting.value.data.mc.minSize = Number(value)
        }
      }
      if (dir === 'middle') {
        if (Number(value) <= minSize) {
          pumpSetting.value.data.mc.middleSize = minSize
        } else {
          pumpSetting.value.data.mc.middleSize = Number(value)
        }
      }
    }
  }
  if (type === 'vol') {
    if (value !== '') {
      const middleSize = pumpSetting.value.data?.vol?.middleSize ?? 0
      const minSize = pumpSetting.value.data?.vol?.minSize ?? 0
      if (dir === 'min') {
        if (Number(value) >= middleSize) {
          pumpSetting.value.data.vol.minSize = middleSize
        } else {
          pumpSetting.value.data.vol.minSize = Number(value)
        }
      }
      if (dir === 'middle') {
        if (Number(value) <= minSize) {
          pumpSetting.value.data.vol.middleSize = minSize
        } else {
          pumpSetting.value.data.vol.middleSize = Number(value)
        }
      }
    }
  }
  if (type === 'holders') {
    if (value !== '') {
      const middleSize = pumpSetting.value.data?.holders?.middleSize ?? 0
      const minSize = pumpSetting.value.data?.holders?.minSize ?? 0
      if (dir === 'min') {
        if (Number(value) >= middleSize) {
          pumpSetting.value.data.holders.minSize = middleSize
        } else {
          pumpSetting.value.data.holders.minSize = Number(value)
        }
      }
      if (dir === 'middle') {
        if (Number(value) <= minSize) {
          pumpSetting.value.data.holders.middleSize = minSize
        } else {
          pumpSetting.value.data.holders.middleSize = Number(value)
        }
      }
    }
  }
  if (type === 'twitter') {
    if (value !== '') {
      const middleSize = pumpSetting.value.data?.twitter?.middleSize ?? 0
      const middleUnit = pumpSetting.value.data?.twitter?.middleUnit ?? 'm'
      const minSize = pumpSetting.value.data?.twitter?.minSize ?? 0
      const minUnit = pumpSetting.value.data?.twitter?.minUnit ?? 's'
      if (dir === 'min') {
        if (getTwitterSeconds(Number(value),minUnit) >=  getTwitterSeconds(Number(middleSize),middleUnit)) {
          pumpSetting.value.data.twitter.minSize = middleSize
          pumpSetting.value.data.twitter.minUnit = middleUnit

        } else {
          pumpSetting.value.data.twitter.minSize = Number(value)
        }
      }
      if (dir === 'middle') {
        if (getTwitterSeconds(Number(value),minUnit) <=  getTwitterSeconds(Number(minSize),minUnit)) {
          pumpSetting.value.data.twitter.middleSize = minSize
          pumpSetting.value.data.twitter.middleUnit = minUnit
        } else {
          pumpSetting.value.data.twitter.middleSize = Number(value)
        }
      }
    }
  }
}
function reset(type: string, dir: string) {
  if (type === 'mc') {
    if (dir === 'min') {
      pumpSetting.value.data.mc.minSize = 30000
      pumpSetting.value.data.mc.minColor = getCssVariable('--main-text')
    }
    if (dir === 'middle') {
      pumpSetting.value.data.mc.middleSize = 100000
      pumpSetting.value.data.mc.middleColor = '#FFA622'
    }
    if (dir === 'max') {
      pumpSetting.value.data.mc.maxColor = '#12B886'
    }
  }
  if (type === 'vol') {
    if (dir === 'min') {
      pumpSetting.value.data.vol.minSize = 1000
      pumpSetting.value.data.vol.minColor = getCssVariable('--main-text')
    }
    if (dir === 'middle') {
      pumpSetting.value.data.vol.middleSize = 50000
      pumpSetting.value.data.vol.middleColor = '#FFA622'
    }
    if (dir === 'max') {
      pumpSetting.value.data.vol.maxColor = '#12B886'
    }
  }
  if (type === 'holders') {
    if (dir === 'min') {
      pumpSetting.value.data.holders.minSize = 100
      pumpSetting.value.data.holders.minColor = getCssVariable('--main-text')
    }
    if (dir === 'middle') {
      pumpSetting.value.data.holders.middleSize = 500
      pumpSetting.value.data.holders.middleColor = '#FFA622'
    }
    if (dir === 'max') {
      pumpSetting.value.data.holders.maxColor = '#12B886'
    }
  }
  if (type === 'twitter') {
    if (dir === 'min') {
      pumpSetting.value.data.twitter.minSize = 10
      pumpSetting.value.data.twitter.minColor = '#009EF7'
      pumpSetting.value.data.twitter.minUnit = 's'
    }
    if (dir === 'middle') {
      pumpSetting.value.data.twitter.middleSize = 30
      pumpSetting.value.data.twitter.middleColor = '#12B886'
      pumpSetting.value.data.twitter.middleUnit = 'm'
    }
    if (dir === 'max') {
      pumpSetting.value.data.twitter.maxColor = '#F6465D'
    }
  }
}
</script>

<style lang="scss" scoped>
.number-input {
  .el-input__wrapper {
    background: transparent;
  }
}
:deep().number-input {
  background: transparent;
  padding: 1px;
  width: 42px;
  height: 18px;
  border-radius: 4px;
  border: none;
  .el-input__wrapper {
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    &:hover {
      box-shadow: none;
    }
    &.is-focus {
      border-color: none;
      box-shadow: none;
    }
    .el-input__inner {
      color: var(--main-text);
      &::placeholder {
        color: var(--third-text);
      }
    }
  }
}
</style>
