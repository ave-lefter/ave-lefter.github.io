export function useRankKline() {
    const klineVisible = ref(false)

    function toggleKline() {
        klineVisible.value = !klineVisible.value
    }
}