<template>
  <div>
    <div
      class="progress-container"
      :style="{ height: big ? '140px !important' : `${height}px !important`, 'justify-content': end ? 'flex-end' : 'center' }"
    >
      <div :id="id"/>
    </div>
    <div v-if="progress > 0 && big" class="checking-tips" :style="{ color: riskColor[0] }">
      <span>{{ riskColor[1] }}</span>
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ArcProgress from 'arc-progress'
import { v4 as uuidv4 } from 'uuid'
// const {isDark} =  storeToRefs(useThemeStore())
// import { useStore } from 'vuex'

const props = defineProps({
  progress: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 260
    },
    thickness: {
      type: Number,
      default: 20
    },
    big: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 60
    },
    textHeight: {
      type: Number,
      default: 30
    },
    end: {
        type: Boolean,
        default: false
    },
    fontSize: {
        type: String,
        default: '12px'
    },
    colorList: {
      type: Array<string>,
      default: ()=>['#ccc', '#81c54e', '#f8be46', '#FF354C']
    }
})


const { t } = useI18n()
// const store = useStore()
const themeStore = useThemeStore()
const id = 'progress-container' + '-' + uuidv4()
const arcProgress = ref<any>(null)

const w = computed(() => Math.round(props.width / 2))

const getColor = (progress: number): string => {
  if (progress === 0) return props.colorList[0]
  if (progress > 0 && progress < 0.4) return props.colorList[1]
  if (progress >= 0.4 && progress < 0.6) return props.colorList[2]
  return props.colorList[3]
}

const riskColor = computed((): [string, string] => {
  if (props.progress < 0.4) {
    return [props.colorList[1], t('seemsNoProblem')]
  } else if (props.progress < 0.6) {
    return [props.colorList[2], t('possibleRisks')]
  } else {
    return [props.colorList[3], t('highRisk')]
  }
})

const init = () => {
  const progressValue = Math.round(props.progress * 100)
  arcProgress.value = new ArcProgress({
    el: `#${id}`,
    progress: props.progress,
    speed: 5,
    value: progressValue,
    animation: false,
    text: `${progressValue}`,
    textStyle: props.big
      ? {
          size: '40px',
          color: getColor(props.progress),
          x: w.value,
          y: 90,
          font: 'Outfit-Medium'
        }
      : {
          size: props.fontSize || '12px',
          color: getColor(props.progress),
          x: w.value,
          y: props.textHeight,
          font: 'Outfit-Medium'
        },
    arcStart: 180,
    arcEnd: 360,
    size: props.width,
    thickness: props.thickness,
    emptyColor: props.colorList[0],
    fillColor: getColor(props.progress),
    customText: props.big
      ? [{ text: t('riskAssessment'), size: '14px', color: '#aaa', x: w.value, y: 120 }]
      : [{ text: t('riskAssessment'), size: '12px', color: themeStore.isDark ? '#566275': '#A9B0BC', x: w.value, y: 70 }],
    lineCap: 'round',
  })
}

watch(() => props.progress, (val) => {
  if (arcProgress.value) {
    arcProgress.value.updateProgress({
      progress: val,
      text: `${Math.round(val * 100)}`,
      textStyle: props.big
        ? {
            size: '40px',
            color: getColor(val),
            x: w.value,
            y: 90,
            font: 'Outfit-Medium'
          }
        : {
            size: props.fontSize || '12px',
            color: getColor(val),
            x: w.value,
            y: props.textHeight,
            font: 'Outfit-Medium'
          },
      fillColor: getColor(val),
      emptyColor: props.colorList[0]
    })
  }
})

// watch(() => store.getters.language, () => {
//   if (arcProgress.value) {
//     arcProgress.value.destroy()
//     init()
//   }
// })

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.progress-container {
  overflow-y: hidden;
  display: flex;
  justify-content: center;
}
.checking-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin: 15px 0 0 0;
}
</style>
