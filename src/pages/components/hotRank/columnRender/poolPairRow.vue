<script lang="jsx">
export default {
  name: "poolPairRow",
  props: {
    row: {
      type: Object,
    },
    _index: {
      type: Number,
    },
    pageNO: {
      type: Number,
    },
    pageSize: {
      type: Number,
    },
  },
  emits: ['collect'],
  data() {
    return {
      buttonTagRef: null,
      toolTipTagVisible: false,
      toolTipTagContent: '',
    }
  },
  render() {
    return (<>
      <RouterLink
        to={{ name: 'Token', params: { id: `${this.row.target_token}-${this.row.chain}` } }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <div
          class="token-info table-item_d"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {this._index < 9 && <span class="text-10px" style={{ opacity: 0 }}>0</span>}
          <span class="text-10px mr-5" style={{ color: '#696E7C' }}>
            #{(this.pageNO - 1) * this.pageSize + this._index + 1}
          </span>

          {(this.$store.state.currentAccount || this.$store.state.bot?.userInfo?.evmAddress) && (
            <i
              class={[
                'iconfont icon-collect',
                { collected: this.$store.state.favorites.includes(`${this.row.target_token}-${this.row.chain}`) }
              ]}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                this.$emit('collect', this.row)
              }}
            />
          )}

          <div class="icon-token-container" style={{ marginRight: '10px' }}>
            <el-image
              class="token-icon"
              src={this.$f.formatIcon(
                this.row,
                this.row.target_token == this.row.token0_address
                  ? this.row.token0_symbol
                  : this.row.token1_symbol
              )}
              v-slots={{
                error: () => (
                  <div
                    class="token-icon"
                    style={{
                      lineHeight: '32px',
                      textAlign: 'center',
                      fontSize: '16px',
                      color: '#fff',
                      background: this.$f.getChainDefaultIconColor(this.row?.chain)
                    }}
                  >
                    {(this.row.target_token == this.row.token0_address
                      ? this.row.token0_symbol
                      : this.row.token1_symbol
                    )?.slice(0, 1)?.toUpperCase?.() || ''}
                  </div>
                ),
                placeholder: () => (
                  <div
                    class="token-icon"
                    style={{
                      lineHeight: '32px',
                      textAlign: 'center',
                      fontSize: '16px',
                      color: '#fff',
                      background: this.$f.getChainDefaultIconColor(this.row?.chain)
                    }}
                  >
                    {(this.row.target_token == this.row.token0_address
                      ? this.row.token0_symbol
                      : this.row.token1_symbol
                    )?.slice(0, 1)?.toUpperCase?.() || ''}
                  </div>
                )
              }}
            />
            {(this.row?.network || this.row?.chain) && (
              <img
                class="icon-svg icon-symbol"
                src={`${this.$store.state.s3BaseUrl}chain/${this.row.chain}.png`}
                alt=""
                onError={(e) => e.target.src = '/icon-default.png'}
                lazy
                srcset=""
              />
            )}
          </div>

          <div>
            <div class="flex-start">
              <span class="token-symbol ellipsis">
                {this.row.target_token == this.row.token0_address ? this.row.token0_symbol : this.row.token1_symbol}
              </span>
              <span style={{ color: 'var(--a-text-2-color)' }}>
                /&nbsp;{this.row.target_token == this.row.token0_address ? this.row.token1_symbol : this.row.token0_symbol}
              </span>
              {(this.row?.lp_locked_percent > 0 && this.row?.lp_locked_percent <= 100) && (
                <el-tooltip
                  effect="customized"
                  placement="top"
                  popper-class={this.$store.state.mode}
                  v-slots={{
                    content: () => (
                      <ul>
                        {this.row.lp_holders && (
                          <li class="card-list-item flex-start mb-5">
                            <span class="risk-message">LP {this.$t('holders')}: {this.row.lp_holders}</span>
                          </li>
                        )}
                        {this.row.lp_locked_percent > 0 && (
                          <li class="card-list-item flex-start mb-5">
                            <span class="risk-message">{this.$t('LPLocked')}: {this.$f.formatNumber2(this.row.lp_locked_percent, 0)}%</span>
                          </li>
                        )}
                        {this.row.lp_lock_platform && (
                          <li class="card-list-item flex-start mb-5">
                            <span class="risk-message">{this.$t('platform')}: {this.row.lp_lock_platform}</span>
                          </li>
                        )}
                        {this.row.lp_locked_to && (
                          <li class="card-list-item flex-start mb-5">
                            <span class="risk-message">{this.$t('unlockDate')}: {this.$f.formatDate(this.row.lp_locked_to / 1000, 'YYYY-MM-DD')}</span>
                          </li>
                        )}
                      </ul>
                    )
                  }}
                >
                  <el-progress
                    class="progress"
                    type="circle"
                    percentage={this.row?.lp_locked_percent}
                    color="var(--custom-primary-color)"
                    width={14}
                    stroke-width={1.5}
                    indeterminate
                  >
                    <svg class="icon-suo1" aria-hidden="true">
                      <use xlinkHref="#icon-suo1" />
                    </svg>
                  </el-progress>
                </el-tooltip>
              )}
              {this.row.normal_tag?.length > 0 && this.row.normal_tag.map((i, index) => (
                <Fragment key={index}>
                  <el-image
                    class="token-icon-tag"
                    src={this.$f.formatIconTag(i.tag)}
                    lazy
                    onMouseover={(e) => {
                      this.buttonTagRef = e.currentTarget
                      this.toolTipTagVisible = true
                      this.toolTipTagContent = this.$t(`${i.tag}`)
                    }}
                    onMouseleave={() => this.toolTipTagVisible = false}
                    v-slots={{
                      error: () => <img class="token-icon-tag" src="/icon-default.png" lazy />,
                      placeholder: () => <img class="token-icon-tag" src="/icon-default.png" lazy />
                    }}
                  />
                  {i?.showText && (
                    <span
                      class="text-10px ml-3"
                      style={{
                        color: i?.color == 'green' ? this.$store.getters.upColor[7] : this.$store.getters.downColor[7]
                      }}
                    >
                      {this.$t(i?.tag)}
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
            <div
              class="font_10 color-icon flex-start mt_4"
              style={{ lineHeight: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <i
                class="iconfont icon-copy text-12px"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                v-copy={this.row.target_token}
              />
              {this.row?.medias?.length > 0 && (
                <div class="media-list flex-start ml-2">
                  {this.row.medias.map((item, index) => (
                    item.url && (
                      <div
                        key={index}
                        class="ml-2"
                        onMouseover={(e) => {
                          this.buttonTagRef = e.currentTarget
                          this.toolTipTagVisible = true
                          this.toolTipTagContent = item.url
                        }}
                        onMouseleave={() => this.toolTipTagVisible = false}
                      >
                        {item.name === 'QQ' ? (
                          <span class="media-item">
                            <i class="iconfont icon-QQ text-12px" />
                          </span>
                        ) : (
                          <a class="media-item" href={item.url} target="_blank">
                            <i class={['iconfont text-12px', `icon-${item.icon}`]} />
                          </a>
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}
              {this.row.signal_arr?.length > 0 && this.row.signal_arr.map((i, index) => (
                <div
                  key={index}
                  class="flex"
                  onMouseover={(e) => {
                    this.buttonTagRef = e.currentTarget
                    this.toolTipTagVisible = true
                    this.toolTipTagContent = this.$f.getTagTooltip(i)
                  }}
                  onMouseleave={() => this.toolTipTagVisible = false}
                >
                  <el-image
                    class="token-icon-signal-tag"
                    src={this.$f.formatIconTag(i.tag)}
                    lazy
                    v-slots={{
                      error: () => <img class="token-icon-signal-tag" src="/icon-default.png" lazy />,
                      placeholder: () => <img class="token-icon-signal-tag" src="/icon-default.png" lazy />
                    }}
                  />
                  <span
                    class="ml-2"
                    style={{
                      color: i.color == 'green' ? this.$store.getters.upColor[7] : this.$store.getters.downColor[7]
                    }}
                  >
                    {i.tag && this.$t(i.tag)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </RouterLink>

      <el-tooltip
        ref="tooltipRef1"
        visible={this.toolTipTagVisible}
        content={this.toolTipTagContent}
        placement="top"
        popper-class={this.$store.state.mode}
        effect="customized"
        virtual-ref={this.buttonTagRef}
        virtual-triggering
      />
    </>);
  }
}
</script>

<style lang="scss" scoped>
.token-info {
  display: flex;
  align-items: center;

  .token-symbol {
    font-size: 13px;
    margin-right: 3px;
  }

  .icon-collect {
    font-size: 12px;
    color: var(--a-bg-6-color);
    cursor: pointer;
    margin-right: 5px;

    &.collected {
      color: #ffbb19;
    }
  }

  .token-network {
    border: 1px solid #878fbc;
    border-radius: 10px;
    font-size: 12px;
    color: #878fbc;
    padding: 2px 5px;
    margin-left: 9px;
  }

  .token-icon {
    border-radius: 50%;
  }
}

.icon-token-container {
  margin-right: 4px;
}

.icon-svg {
  font-size: 20px;
  cursor: pointer;
  color: var(--custom-primary-color);
  border-radius: 100%;
  width: 20px;
  vertical-align: middle;

  &.icon-huoyan {
    width: 12px;
    font-size: 12px;
  }

  &.icon-new {
    font-size: 12px;
  }

  &.icon-xiala {
    width: 8px;
    height: 8px;
    margin-left: 5px;
  }
}
</style>