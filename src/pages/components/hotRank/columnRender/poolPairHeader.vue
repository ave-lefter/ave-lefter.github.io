<script lang="jsx">
export default {
  name: "poolPairHeader",
  render() {
    return (<>
      <span class="text-10px" style="opacity: 0">0</span>
      <span>{this.$t('poolPair')}</span>
    </>);
  }
}
</script>