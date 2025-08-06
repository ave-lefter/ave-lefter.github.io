<script setup lang="ts">
const signalStore = useSignalStore()
</script>
<template>
    <Draggable
v-if="!signalStore.isLeftFixed && !signalStore.isRightFixed && signalStore.signalVisible"
        class-name="top-0 left-0 fixed" :z="3" :initialWidth="signalStore.signalBoundingRect.width"
        :initial-height="signalStore.signalBoundingRect.height" :x="signalStore.signalBoundingRect.x"
        :y="signalStore.signalBoundingRect.y" :min-width="240" :min-height="160" :parent="true" :handles="[
            'tl',
            'tm',
            'tr',
            'mr',
            'br',
            'bm',
            'bl',
            'ml',
        ]" drag-cancel="#drag-disabled,#drag-settings,#custom-filter" @onDragStop="signalStore.onDragStop"
        @onResizing="signalStore.onResizing" @onDrag="signalStore.onDrag">
        <Signal
:container-width="signalStore.signalBoundingRect.width"
            :scroll-height="signalStore.signalBoundingRect.height - 117"
            class="border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]" />
    </Draggable>
    <Draggable
v-if="signalStore.isLeftFixed && signalStore.signalVisible"
        class="[&&]:relative shrink-0 left fixed! left-0 top-61px left-drag" :axis="'x'" :min-width="240" :max-width="360"
        :initial-width="signalStore.fixedWidth" :initial-height="signalStore.winHeight - 95" :parent="true" :handles="[
            'mr',
        ]" drag-cancel="#drag-disabled" @onDragStop="signalStore.onLeftDragStop"
        @onResizing="signalStore.onFixedResizing">
        <Signal :container-width="signalStore.fixedWidth" :scroll-height="signalStore.winHeight - 200" />
    </Draggable>
    <Draggable
v-if="signalStore.isRightFixed && signalStore.signalVisible"
        class="[&&]:relative shrink-0 right fixed! top-61px left-0 right-drag" :axis="'x'"
        :x="signalStore.winWidth - signalStore.fixedWidth" :min-width="240" :parent="true" :max-width="360"
        :initial-width="signalStore.fixedWidth" :initial-height="signalStore.winHeight - 95" :handles="[
            'ml',
        ]" drag-cancel="#drag-disabled" @onDragStop="signalStore.onRightDragStop"
        @onResizing="signalStore.onFixedResizing">
        <Signal :container-width="signalStore.fixedWidth" :scroll-height="signalStore.winHeight - 200" />
    </Draggable>
</template>