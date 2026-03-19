<script lang="ts" setup>
import dayjs from 'dayjs'

const timestamp = defineModel<string[]>('timestamp')
const timeString = computed(() => {
    const [start, end] = timestamp.value || []
    if (!start || !end) {
        return '--'
    }
    const [startDate, startTime] = formatTime(start)
    const [endDate, endTime] = formatTime(end)
    if (startDate === endDate) {
        return `${startDate} ${startTime} - ${endTime}`
    } else {
        return `${startDate} ${startTime} - ${endDate} ${endTime}`
    }
})

function formatTime(date:string) {
    const dayjsDate = dayjs(Number(date) * 1000)
    return [dayjsDate.format('MM/DD'), dayjsDate.format('HH:mm:ss')]
}

function reset() {
    if(timestamp.value){
        timestamp.value = []
    }
}

function setTimeStamp(type:number){
    const [start, end] = timestamp.value || []
    if (!start || !end) {
        return '--'
    }
   const resolution = localStorage.getItem('tv_resolution') || '15'
   if(resolution){
    const params = resolutionMap[resolution as keyof typeof resolutionMap] || {val:resolution,unit:'m'}
    const startUnix = dayjs(Number(start)*1000).add(type*params.val,params.unit).unix()
    const endUnix = dayjs(Number(end)*1000).add(type*params.val,params.unit).unix()
    timestamp.value = [String(startUnix),String(endUnix)]
   }
}
</script>

<template>
    <div class="h-24px flex items-center justify-center bg-[--main-input-button-bg] color-[--d-E0E0E0-l-333] mb-12px text-12px gap-4px">
        <span>{{timeString}}</span>
        <Icon name="custom:arrow-left" class="cursor-pointer hover:color-[--main-text] text-9px mr-4px" @click="setTimeStamp(-1)"/>
        <Icon name="custom:arrow-right" class="cursor-pointer hover:color-[--main-text] text-9px"  @click="setTimeStamp(1)"/>
        <span class="color-[--primary-color] cursor-pointer" @click="reset">{{ $t('reset') }}</span>
    </div>
</template>