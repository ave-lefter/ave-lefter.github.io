<template>
  <div class="banner" v-show="showBanner">
    <Icon
      class="close clickable text-14px color-#fff"
      name="material-symbols:cancel-outline-rounded"
      @click.stop.prevent="showBanner = false"
    />
    <el-carousel
      height="180px"
      style="width: 450px"
      v-if="bannerList?.length > 0"
      pause-on-hover
      :indicator-position="bannerList.length === 1 ? 'none' : ''"
    >
      <el-carousel-item v-for="(item, $index) in bannerList" :key="$index">
        <a href="" @click.stop.prevent="jump(item)">
          <img :src="item.picture_link" alt="" width="100%" />
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
import { _getBannersAll, type Banner } from '@/api/banner.js'
import { useStorage } from '@vueuse/core'
const localeStore = useLocaleStore()
const bannerList = useStorage<Banner[]>('bannerList_pro', [], localStorage)
const showBanner = useStorage('showBanner', true, localStorage)
watch(() => localeStore.locale, () => {
  getBannersAll()
})
onMounted(() => {
  getBannersAll()
})
function getBannersAll() {
  _getBannersAll()
    .then((res) => {
      const list = Array.isArray(res) ? res : []
      if (JSON.stringify(bannerList.value) !== JSON.stringify(list)) {
        bannerList.value = list
        showBanner.value = true
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function jump(item: Banner) {
  if (item.render_link && item.render_link.startsWith('https')) {
    window.open(item.render_link)
  }
}
</script>

<style lang="scss" scoped>
.banner {
  overflow: hidden;
  background: #000;
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: auto 100%;
  box-sizing: border-box;
  position: fixed;
  z-index: 10;
  left: 10px;
  bottom: 35px;
  width: 440px;
  height: 180px;
  border-radius: 10px;
  .close {
    position: absolute;
    top: 7px;
    right: 8px;
    color: #f5f5f5;
    font-size: 20px;
    cursor: pointer;
    opacity: 1;
    z-index: 3;
  }
}
</style>
