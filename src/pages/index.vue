<script setup lang="ts">
import ChainsSelect from "./components/chainsSelect.vue";
import CategoryTabs from "./components/categoryTabs.vue";

const {t} = useI18n()
</script>

<template>
  <div class="flex gap-16px w-full">
    <ChainsSelect/>
    <CategoryTabs
        activeInterval="1m"
        :quickInputVisible="false"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
