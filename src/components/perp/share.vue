<template>
  <Icon
    class="color-[--third-text] cursor-pointer shrink-0"
    name="ic:outline-share"
    @click="dialogVisible = true"
  />
  <el-dialog v-model="dialogVisible" header-class="share-header" :title="t('sharePosition')" width="810" append-to-body class="[&.el-dialog]:[--el-dialog-padding-primary:40px]">
    <div
      ref="shareDom"
      class="relative py-30px px-42px bg-cover mt--15px"
      :style="`background-image: url(${bgImg})`"
    >
      <div class="flex justify-between items-center mb-40px">
        <img height="32" src="@/assets/images/perpAve.png" alt="" />
        <template v-if="getValue('time')">
          {{ dateStr }}
        </template>
      </div>
      <div class="flex items-center gap-12px mb-30px">
        <img class="w-60px h-60px rounded-full" :src="props.statistics.logo_url" alt="" />
        <div class="flex flex-col gap-4px">
          <strong class="text-20px">{{ props.statistics.name }}</strong>
          <div class="flex items-center gap-4px">
            <span
              :class="[
                props.statistics.openValue > 0 ? 'bg-[--up-color]' : 'bg-[--down-color]',
                'px-4px py-1px rounded-4px text-10px',
              ]"
              >{{ props.statistics.openValue > 0 ? t('long') : t('short') }}</span
            >
            <span class="px-4px py-1px rounded-4px text-10px bg-[--primary-color]"
              >{{ t('all2')
              }}<template v-if="getValue('leverage')">
                {{ props.statistics.leverage }}x</template
              ></span
            >
          </div>
        </div>
      </div>
      <div class="mb-66px">
        <div
          v-if="getValue('unrealizedPnl')"
          :class="getColorClass(props.statistics.unrealizedPnl)"
          class="text-24px font-bold text-60px font-800 lh-72px"
        >
          {{ addSign(props.statistics.unrealizedPnl) }}${{
            formatNumber(Math.abs(props.statistics.unrealizedPnl), {
              decimals: 2,
              limit:20
            })
          }}
        </div>
        <div
          v-if="getValue('unrealizedPnlRate')"
          :class="[
            getColorClass(props.statistics.unrealizedPnl),
            getValue('unrealizedPnl') ? 'text-24px' : 'text-60px font-800',
          ]"
        >
          {{ addSign(props.statistics.unrealizedPnlRate)
          }}{{ formatNumber(Math.abs(props.statistics.unrealizedPnlRate), 2) }}%
        </div>
      </div>
      <div>
        <div v-if="props.statistics.entryPrice" class="flex items-center lh-22px mb-3px">
          <span
            ><span class="text-[--third-text]">{{ t('openPrice2') }}: </span
            >${{ props.statistics.entryPrice }}</span
          >
        </div>
        <div v-if="props.statistics.closePrice" class="flex items-center lh-22px">
          <span
            ><span class="text-[--third-text]">{{ t('closePrice2') }}: </span
            >${{ props.statistics.closePrice }}</span
          >
        </div>
      </div>
    </div>
    <div class="flex items-center gap-30px mt-16px">
      <span
        v-for="option in checkedOptions"
        :key="option.value"
        :class="[
          'flex-1 h-32px cursor-pointer items-center rounded-8px text-center lh-30px border-1px border-solid',
          option.checked
            ? 'color-[--main-text] border-[--main-text]'
            : 'color-[--secondary-text] bg-[--border] border-transparent',
            option.disabled
              ? 'cursor-not-allowed'
              : 'cursor-pointer',
        ]"
        @click="clickOption(option)"
      >
        <Icon v-if="option.icon" class="text-12px color-[--main-text]" :name="`custom:${option.icon}`"/>
        {{ option.label }}
      </span>
    </div>
    <!-- <div class="flex justify-between mx-auto mt-24px text-12px color-[--third-text]">
      <div class="flex-col flex items-center cursor-pointer" @click.stop="downloadSharePoster">
        <img src="@/assets/images/share/download.svg" height="48" alt="" srcset="" />
        <span class="mt-8px">{{ t('save') }}</span>
      </div>
      <div class="flex-col flex items-center cursor-pointer" @click.stop="jumpX">
        <img src="@/assets/images/share/twitter.svg" height="48" alt="" srcset="" />
        <span class="mt-8px">Twitter</span>
      </div>
      <div class="flex-col flex items-center cursor-pointer" @click.stop="jumpTg">
        <img src="@/assets/images/share/tg.svg" height="48" alt="" srcset="" />
        <span class="mt-8px">Telegram</span>
      </div>
      <div class="flex-col flex items-center cursor-pointer" @click.stop="copySharePoster">
        <img src="@/assets/images/share/copy.svg" height="48" alt="" srcset="" />
        <span class="mt-8px">{{ t('copy') }}</span>
      </div>
    </div> -->
  </el-dialog>
</template>
<script setup>
import upImg from '@/assets/images/perp-up.png'
import downImg from '@/assets/images/perp-down.png'
import dayjs from 'dayjs'

const { t } = useI18n()
const props = defineProps({
  statistics: {
    type: Object,
    default: () => ({}),
  },
})
const shareDom = useTemplateRef('shareDom')
const dialogVisible = ref(false)
const dateStr = ref(dayjs().format('YYYY/MM/DD HH:mm:ss'))
const checkedOptions = ref([
  {
    get label() {
      return t('profit6')
    },
    value: 'unrealizedPnl',
    checked: true,
    icon:'perp-share1',
    get disabled(){
      return !checkedOptions.value.find(item=>item.value==='unrealizedPnlRate')?.checked
    }
  },
  {
    get label() {
      return '% '+ t('RIO')
    },
    value: 'unrealizedPnlRate',
    checked: true,
    get disabled(){
      return !checkedOptions.value.find(item=>item.value==='unrealizedPnl')?.checked
    }
  },
  {
    get label() {
      return t('leverage')
    },
    value: 'leverage',
    checked: true,
    icon:'perp-share3'
  },
  {
    get label() {
      return t('time')
    },
    value: 'time',
    checked: true,
    icon:'perp-share4'
  },
])
const bgImg = computed(() => {
  if (props.statistics.unrealizedPnl > 0) {
    return upImg
  } else {
    return downImg
  }
})

const getValue = (key) => {
  return checkedOptions.value.find((item) => item.value === key)?.checked
}

async function downloadSharePoster() {
  if (shareDom.value) {
    const html2canvas = await import('html2canvas').then(m => m.default)
    html2canvas(shareDom.value, {
      backgroundColor: null,
      scale: 3,
      allowTaint: true,
      useCORS: true,
      scrollY: 0,
      scrollX: 0,
    }).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png')
      console.log(dataURL)
      downloadFile(dataURL, `ave-${Date.now()}.png`)
    })
  }
}

async function copySharePoster() {
  if (shareDom.value) {
    const html2canvas = await import('html2canvas').then(m => m.default)
    html2canvas(shareDom.value, {
      backgroundColor: null,
      scale: 3,
      allowTaint: true,
      useCORS: true,
      scrollY: 0,
      scrollX: 0,
    }).then((canvas) => {
     canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Canvas 转换为 Blob 失败');
          return;
        }

        try {
          // 2. 创建 ClipboardItem 对象
          const item = new ClipboardItem({ 'image/png': blob });

          // 3. 写入剪贴板
          await navigator.clipboard.write([item]);
          ElMessage.success(t('copySuccess2'))
        } catch (err) {
          console.error('无法复制图片: ', err);
        }
      }, 'image/png'); // 明确指定格式
    })
  }
}

function downloadFile(blob, filename) {
  let url = ''
  if (typeof blob === 'string') {
    url = blob
  } else {
    url = URL.createObjectURL(blob)
  }
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const clickOption = (option) => {
  if(option.disabled){
    return
  }
  option.checked = !option.checked
}
</script>
<style lang="scss">
.share-header .el-dialog__headerbtn{
  top: 29px;
  right: 25px;
}
</style>
