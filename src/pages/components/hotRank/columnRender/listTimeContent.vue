<template>
  <!-- v-if="['inclusion'].includes?.(activeCategory)" -->
  <el-table-column
    v-if="false"
    align="right"
    :label="$t('listTime')"
    sortable="custom"
    :sort-orders="['descending', 'ascending', null]"
    prop="listing_at"
  >
    <template #header>
      <span>{{ $t('listTime') }}</span>
    </template>
    <template #default="{ row }">
      <!-- {{ row?.created_at ? $dayjs(row?.created_at).fromNow() : '-' }} -->
      <template v-if="!row?.listing_at">
        -
      </template>
      <template v-else-if="$f.formatTimeFromNow(row?.listing_at, true) >= 60">
        {{ $f.formatTimeFromNow(row?.listing_at) }}
      </template>
      <van-count-down
        v-else-if="row?.listing_at && $f.formatTimeFromNow(row?.listing_at, true) < 60"
        :time="(60 - $f.formatTimeFromNow(row?.listing_at, true)) * 1000"
        style="--van-count-down-text-color: currentColor"
      >
        <template #default="{ total }">
          <template v-if="total > 0">
            {{ Math.floor(($f.formatTimeFromNow(row?.listing_at, true) + 60 * 1000 - total) / 1000) }} s
          </template>
          <template v-else>
            {{ $f.formatTimeFromNow(row?.listing_at) }}
          </template>
        </template>
      </van-count-down>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "listTimeContent",
  props: {
    activeCategory: {
      type: String,
      required: true
    }
  }
}
</script>