<template>
  <div
    class="w-full h-full bg-[--secondary-bg] p-12px"
    :class="{'pr-16px':trackerStore.isLeftFixed,'pl-16px':trackerStore.isRightFixed}"
  >
  <Icon name="custom:drag2" class="absolute top-4px left-50% ml--6px text-6px bg-[--dialog-list-hover] drag-handle" />
  </div>
</template>

<script setup name="trackerPop">
const trackerStore = useTrackerStore()

</script>

<style scoped lang="scss">
</style>