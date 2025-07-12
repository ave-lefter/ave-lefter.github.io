<template>
  <div class="table relative">
    <loading
      v-model:active="loading"
      :can-cancel="false"
      loader="dots"
      :opacity="0.2"
      :backgroundColor="$store.state.mode==='light'? '#F5F5F5':'#131722'"
      color="#3F80F7"
      :is-full-page="false"
    />
    <el-table :data="userTokenListInit" style="width: 100%" @row-click="tableRowClick">
      <template #empty>
        <div class="table-empty">
          <img src="@/assets/images/empty-black.svg" lazy />
          <div v-if="$store.state.wallet == ''" style="display: flex; flex-direction: column">
            <span>{{ $t('noWalletTip') }}</span>
            <el-button
              style="width: 100%; border-radius: 6px"
              type="primary"
              v-if="$store.state.wallet === ''"
              @click.stop="
                $store.commit('changeConnectVisible', true);
                $store.commit('setIsShowImportAddress', true)
              "
            >
              {{ $t('connectWallet') }}
            </el-button>
          </div>
          <span v-else>{{ $t('noBalance') }}</span>
        </div>
      </template>
      <el-table-column prop="address" :label="$t('token')">
        <template #default="{ row }">
          <div class="token-info flex-start">
            <div v-if="row?.logo_url" class="icon-token-container">
              <!-- <img
                class="token-icon"
                :src="row?.logo_url || $f.formatIcon(formatChain(row))"
                alt
                height="25"
                onerror="this.src='/icon-default.png'"
              /> -->
              <el-image class="token-icon" :src="$f.formatIcon(row, row.symbol)" lazy>
                <template #error>
                  <img class="token-icon" :src="$f.formatDefaultIcon(row, row.symbol)" />
                </template>
                <template #placeholder>
                  <img class="token-icon" :src="$f.formatDefaultIcon(row, row.symbol)" />
                </template>
              </el-image>
              <img
                class="icon-svg icon-symbol"
                :src="`${$store.state.s3BaseUrl}chain/${row?.network || row?.chain}.png`"
                alt=""
                srcset=""
                onerror="this.src='/icon-default.png'"
              >
            </div>
            <span class="token-symbol">{{ row.symbol }}</span>
            <span class="risk-status hight" v-if="row.risk_score > 55 || row.risk_level < 0">
              {{ $t('highRisk') }}
            </span>
            <!-- <span class="risk-status hight" v-if="row.flag ==='blacklist' && row.symbol">黑名单</span>
            <span class="risk-status hight" v-if="row.flag ==='whitelist' && row.symbol">白名单</span>
            <span class="risk-status hight" v-if="row.flag ==='lp' && row.symbol">lp</span> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('price')">
        <template #default="{ row }">
          {{ row.price ? '$' + $f.formatNumber2(row.price) : '-.-' }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('amount')">
        <template #default="{ row }">{{ $f.formatNumber2(row.amount) }}</template>
      </el-table-column>
      <el-table-column prop :label="$t('value')">
        <template #default="{ row }">
          <span v-if="row.price">${{ $f.formatNumber2(row.amount * row.price) }}</span>
          <span v-else>-.-</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operate')" width="120">
        <template #default="{ row }">
          <a
            v-if="!row.is_hidden"
            type="primary"
            plain
            style="color: #465273"
            @click.stop="deleteCoin(row)"
          >
            {{ $t('remove') }}
          </a>
          &nbsp;&nbsp;
          <a type="primary" @click.stop="addCoin(row)" v-else>
            {{ $t('add') }}
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { setUserTokenStatus } from '@/api'
export default {
  name: 'Table',
  data() {
    return {
      loading: false
    }
  },
  computed: {
    userTokenListInit() {
      let userTokenList = this.$store.state.userTokenList || []
      return userTokenList?.filter(i => i.amount > 0)
    }
  },
  methods: {
    tableRowClick(row) {
      this.$router.push({
        name: 'Token',
        params: { id: row.id + '-' + row.chain },
        query: { from: this.$route.name }
      })
    },
    deleteCoin(item) {
      this.$confirm(this.$t('removeTips', { n: item.symbol }), this.$t('tips'), {
        type: 'warning',
        confirmButtonText: this.$t('confirm1'),
        cancelButtonText: this.$t('cancel'),
        customClass: this.$store.state.mode,
      })
        .then(() => {
          setUserTokenStatus({
            token: item.token,
            type: 'blacklist'
          }).then(res => {
            this.$message.success(`${this.$t('remove')}Token`)
            this.$store.dispatch('getUserTokenList')
          })
        })
        .catch(() => {})
    },
    addCoin(item) {
      setUserTokenStatus({
        token: item.token,
        type: 'whitelist'
      })
        .then(res => {
          this.$message.success(`${this.$t('add')}Token`)
          this.$store.dispatch('getUserTokenList')
        })
        .catch(err => {
          this.$message.err(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.table {
  font-size: 14px;
  color: #878fbc;
  letter-spacing: 0.29px;
  position: relative;
  .empty {
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      text-align: center;
    }
    img {
      width: 50px;
    }
    span {
      display: block;
      line-height: 1;
    }
  }
  .red {
    color: rgb(255, 100, 109);
  }
  .green {
    color: rgb(70, 215, 171);
  }
}
.table-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
  min-height: calc(100vh - 230px);
}
:deep(.el-table) {
  font-size: 14px;
  background: #131722;
  min-height: calc(100vh - 200px);
  tr {
    background: #131722;
    cursor: pointer;
    &:hover {
      td {
        &.el-table__cell {
          background-color: #272b32;
        }
      }
    }
  }
  .cell {
    line-height: 15px;
  }
  th {
    background: #131722;
    border-bottom: none;
    &.el-table__cell.is-leaf {
      border-bottom: none;
    }
    .cell {
      color: #80838b;
      font-weight: 400;
    }
  }
  td {
    &.el-table__cell {
      padding: 12px 0;
      border-bottom: 1px solid #202430;
      font-weight: 500;
    }
    .cell {
      color: #eaecef;
    }
  }
}
a {
  color: #3f80f7;
}
.token-icon {
  margin-right: 3px;
}
.token-symbol {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px 5px;
}
.risk-status {
  display: inline-block;
  font-size: 10px;
  border: 1px solid;
  border-radius: 20px;
  padding: 2px 5px;
  color: #f72121;
  font-size: 12px;
}
</style>
