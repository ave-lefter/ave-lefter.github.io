<template>
  <div class="">
    <div class="w-full px-20px font-500 text-16px">
      <div class=" my-10px mb-0">{{ $t('balanceOverview') }}</div>
      <div class="mb-10px">
        <label
          v-if="isHide"
          for="showSmallAssets"
          class="block text-12px text-#848e9c mt-20px hover:cursor-pointer"
        >
          <input
            id="showSmallAssets"
            v-model="isHide"
            type="checkbox"
            name="hideSmallAssets"
            value="true"
            class="vertical-middle mr-3px w-15px h-15px rounded-20px mt-2px relative top--2px cursor-pointer"
          >
          {{ $t('hideSmallAssets') }}
        </label>
        <label
          v-else
          for="hideSmallAssets"
          class="block text-12px text-#848e9c mt-20px cursor-pointer"
        >
          <input
            id="hideSmallAssets"
            v-model="isHide"
            type="checkbox"
            name="hideSmallAssets"
            value="false"
            class="vertical-middle mr-3px w-15px h-15px rounded-20px mt-2px relative top--2px cursor-pointer"
          >
          {{ $t('showSmallAssets') }}
        </label>
      </div>
    </div>
    <div class="content px-20px">
      <AssetOverview
      :isHide="isHide"/>
    </div>
  </div>
</template>

<script setup>
import AssetOverview from './assetOverview.vue'
// import AddToken from './addToken.vue'
const isHide = ref(true)
</script>

<style>
/* Custom checkbox styles that can't be easily converted to Unocss */
input[type='checkbox']::after {
  position: absolute;
  top: 0;
  color: #000;
  width: 15px;
  height: 15px;
  display: inline-block;
  visibility: visible;
  padding-left: 0px;
  text-align: center;
  content: ' ';
  border-radius: 20px;
}

input[type='checkbox']:checked::after {
  color: #eaecef;
  content: '✓';
  background-color: #3f80f7;
  border-radius: 0;
}
</style>
