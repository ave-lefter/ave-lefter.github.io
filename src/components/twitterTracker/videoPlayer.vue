<template>
     <video ref="videoPlayer" class="video-js vjs-default-skin"/>
</template>
<script setup name="VideoPlayer">
import videojs from 'video.js'
import 'video.js/dist/video-js.css' // Import the CSS file

const props = defineProps({
  sources: {
    type: Object,
    default: () => ({}),
  },
})

const videoPlayer = ref(null)
let player = null

onMounted(() => {
  // Initialize the Video.js player once the component is mounted (client-side)
  const sources = props.sources?.map?.(el=>({
    src:el.url,
    type:el.content_type
  }))
  player = videojs(videoPlayer.value, {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources
}, () => {
    // Player is ready
  })
})

onUnmounted(() => {
  // Dispose the player when the component is unmounted to prevent memory leaks
  if (player) {
    player.dispose()
  }
})
</script>