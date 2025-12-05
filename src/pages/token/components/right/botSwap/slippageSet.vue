<template>
  <div class="flex">
    <span class="clickable flex" @click.stop="show = true">
      <slot name="icon">
        <Icon
          class="text-14px color-[--secondary-text] hover:color-[--main-text] icon-bot-setting"
          name="custom:pump-setting"
        />
      </slot>
    </span>
    <el-dialog v-model="show" class="new-dialog" width="500px" append-to-body>
      <template #header>
        <div class="text-20px mb-4px font-400">
          <button
            class="border-none bg-transparent clickable color-[--third-text] px-0"
            :class="{ 'color-[--main-text]!': settingTab === 0 }"
            @click.stop="settingTab = 0"
          >
            {{ $t('basicSetting') }}
          </button>
          <button
            v-if="chain !== 'ton'"
            class="border-none bg-transparent clickable color-[--third-text] px-0 ml-24px"
            :class="{ 'color-[--main-text]!': settingTab === 1 }"
            @click.stop="settingTab = 1"
          >
            {{ $t('autoSellSetting') }}
          </button>
        </div>
      </template>
      <el-form class="popup-content" @submit.prevent="confirmSubmit">
        <div v-show="settingTab === 0">
          <div v-if="showClipboardSet" class="mb-20px pb-20px b-b-solid b-b-[--border] b-b-1">
            <div class="flex items-center mb-15px">
              <Icon v-if="themeStore.isDark" name="custom:flash-d" class="text-14px" />
              <Icon v-else name="custom:flash-l" class="text-14px" />
              <span class="ml-5px mr-auto">{{ $t('quickBuyclipboard') }}</span>
              <div
                class="flex items-center justify-end text-12px color-[--third-text] clickable"
                @click.stop="clipboardQuickInput[chain] = ''"
              >
                <Icon name="custom:refresh-left" class="ml-5px clickable text-14px mr-3px" />
                <span>{{ $t('reset') }}</span>
              </div>
            </div>
            <div class="flex items-center">
              <img
                v-if="chain"
                class="w-16px h-16x mr-5px rd-50%"
                :src="`${configStore.token_logo_url}chain/${chain}.png`"
                alt=""
                srcset=""
              />
              <span class="mr-auto font-500">{{ getChainInfo(chain)?.name || '' }}</span>
              <el-input
                v-model="clipboardQuickInput[chain]"
                class="input-swap input-number flex-auto! max-w-150px clipped-input rd-8px!"
                inputmode="decimal"
                clearable
                placeholder="0.0"
                @update:model-value="
                  (value) => {
                    clipboardQuickInput[chain] = value?.replace?.(/\-|[^\d.]/g, '')
                  }
                "
                @blur="handleBlurBuyValue1(clipboardQuickInput[chain] || '')"
              >
                <template #append
                  ><span class="color-[--third-text]">{{
                    getChainInfo(chain)?.main_name
                  }}</span></template
                >
              </el-input>
            </div>
          </div>
          <div class="setting-list mb-10px rounded-4px swap-type">
            <button
              v-for="item in [
                { label: $t('buySetting'), value: 'buy' },
                { label: $t('sellSetting'), value: 'sell' },
              ] as const"
              :key="item.value"
              :class="{ active: item.value === swapType }"
              type="button"
              @click.stop="swapType = item.value"
            >
              {{ item.label }}
            </button>
          </div>
          <template v-if="swapType === 'buy'">
            <div class="setting-list mb-10px rounded-4px">
              <button
                v-for="item in BotSettingsArr"
                :key="item.value"
                :class="{ active: item.value === botSetting?.buy.selected }"
                type="button"
                @click.stop="botSetting.buy.selected = item.value"
              >
                {{ item.label }}
              </button>
            </div>
            <div class="color-[--third-text]">
              {{ $t('setTips') }}
            </div>
            <div class="flex items-center justify-between color-[--secondary-text] mb-8px mt-15px">
              <span>{{ $t('slippage') }}</span>
              <Icon
                class="text-15px color-[--icon-color] ml-5px clickable mr-auto"
                name="material-symbols:help-rounded"
                @click.stop="openSlippageTips"
              />
              <el-checkbox
                v-if="canSetAuto"
                v-model="isAutoB"
                :label="$t('autoSlippage')"
                size="large"
                style="--el-checkbox-text-color: var(--third-text); height: 16px"
              />
            </div>
            <div class="mt-10px">
              <el-row :gutter="10">
                <el-col
                  v-for="(item, index) in slippageList"
                  :key="index"
                  :span="6"
                  class="radio-group"
                >
                  <!-- <span v-if="index !== 0" style="flex: 1"></span> -->
                  <input
                    :id="`radio-buy-${item}-${key}`"
                    v-model="botSetting.buy[selectedB].slippageValue"
                    type="radio"
                    :value="item"
                    :disabled="isAutoB"
                    class="radio-input"
                    @change.stop="changeSlippageB"
                  />
                  <label
                    :for="`radio-buy-${item}-${key}`"
                    class="radio-item"
                    :class="{ 'no-checked': botSetting?.buy?.[selectedB]?.customSlippage }"
                    style="border-radius: 4px"
                    >{{ item }}%</label
                  >
                </el-col>
                <el-col :span="6">
                  <div class="slippage-input">
                    <el-input-number
                      v-model="botSetting.buy[selectedB].customSlippage"
                      class="bg-[--border] rounded-4px"
                      name="slippage"
                      type="number"
                      :placeholder="$t('custom')"
                      :min="0"
                      :max="100"
                      :step="0.01"
                      :disabled="isAutoB"
                      controls-position="right"
                      :controls="false"
                      clearable
                      :rules="[
                        { required: true, message: $t('enterSlippage') },
                        {
                          validator: (val: string) => Number(val) <= 100,
                          message: $t('slippageMaxTip'),
                        },
                      ]"
                      @change="(val) => handleCustomSlippageB(val)"
                    />
                    <span class="color-fff">%</span>
                  </div>
                </el-col>
              </el-row>
              <span
                v-if="
                  botSetting.buy[selectedB].slippageValue !== undefined &&
                  Number(botSetting.buy[selectedB].slippageValue) <= 0.1
                "
                class="tip"
                >{{ $t('slippageTip1') }}</span
              >
            </div>
            <div v-if="isCanMev" class="slippage-label mt-15px">
              <span class="mr-auto color-[--secondary-text]">{{ $t('protection') }}</span>
              <el-switch
                v-model="botSetting.buy[selectedB].mev"
                size="small"
                :before-change="solanaMevBeforeChange"
                class="ml-2px"
                style="--el-switch-on-color: #3c6cf6"
                @change="onProtectionChange('buy')"
              />
            </div>
            <div v-if="chain !== 'ton'" class="slippage-label mt-15px color-[--secondary-text]">
              <span>{{ chain === 'solana' ? $t('priorityFee') : $t('extraGas') }}</span>
            </div>
            <div v-if="chain !== 'ton'" :key="botSetting.buy[selectedB].mev" class="mt-10px">
              <el-row :gutter="10">
                <el-col
                  v-for="(item, index) in priorityListB"
                  :key="index"
                  :span="8"
                  class="radio-group"
                >
                  <!-- <span v-if="index !== 0" style="flex: 1"></span> -->
                  <input
                    :id="`radio-fee-buy-${index}`"
                    v-model="
                      botSetting.buy[selectedB].gas[botSetting.buy[selectedB].mev ? 0 : 1].level
                    "
                    type="radio"
                    :value="index"
                    class="radio-input"
                    @change.stop="changePriorityFee('buy')"
                  />
                  <label
                    :for="`radio-fee-buy-${index}`"
                    class="radio-item"
                    style="min-height: 60px"
                    :class="{
                      'no-checked':
                        botSetting?.buy?.[selectedB]?.gas?.[
                          botSetting?.buy?.[selectedB].mev ? 0 : 1
                        ]?.customFee,
                    }"
                    @click.stop="changePriorityFee('buy')"
                  >
                    <div class="text-12px">{{ priorityText[index] }}</div>
                    <span class="mt-10px text-14px" style="color: var(--a-text-1-color)"
                      >{{ item }} {{ chain === 'solana' ? 'SOL' : 'GWEI' }}</span
                    >
                  </label>
                </el-col>
              </el-row>
            </div>
            <div v-if="chain !== 'ton'" class="input-swap mt-10px">
              <el-input
                v-model="
                  botSetting.buy[selectedB].gas[botSetting.buy[selectedB].mev ? 0 : 1].customFee
                "
                class="input-number"
                inputmode="decimal"
                clearable
                :placeholder="chain === 'solana' ? $t('customFee1') : $t('customEvmFee1')"
                @update:model-value="watchCusTomPriorityFee($event, 'buy')"
                @blur="handleBlurFee('buy')"
              >
                <template #append
                  ><span class="color-[--third-text]">{{
                    chain === 'solana' ? 'SOL' : 'GWEI'
                  }}</span></template
                >
              </el-input>
            </div>
            <div
              v-if="
                (chain === 'solana' &&
                  botSetting.buy[selectedB].gas[botSetting.buy[selectedB].mev ? 0 : 1].customFee >=
                    0.1) ||
                (chain !== 'solana' &&
                  botSetting.buy[selectedB].gas[botSetting.buy[selectedB].mev ? 0 : 1].customFee >=
                    10)
              "
              class="mt-8px color-[--yellow] text-12px flex items-center gap-4px"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
              >
                <path
                  d="M4.5 9C2.01465 9 0 6.98535 0 4.5C0 2.01465 2.01465 0 4.5 0C6.98535 0 9 2.01465 9 4.5C9 6.98535 6.98535 9 4.5 9ZM4.05 5.85V6.75H4.95V5.85H4.05ZM4.05 2.25V4.95H4.95V2.25H4.05Z"
                  fill="#FFA622"
                />
              </svg>
              {{ t('overLimit') }}
            </div>
            <div v-if="showQuickAmount" class="mt-20px">
              <div class="mb-10px" style="color: #12b886">{{ $t('setOneClickBuyAmount') }}</div>
              <el-row :gutter="10">
                <el-col
                  v-for="(item, index) in botSetting.buy[selectedB].buyValueList"
                  :key="index"
                  :span="6"
                  class="click-setting"
                >
                  <el-input
                    v-model="botSetting.buy[selectedB].buyValueList[index]"
                    class="input-number"
                    inputmode="decimal"
                    placeholder="0.0"
                    @input="(value) => handleBuyValue(value, index)"
                    @blur="handleBlurBuyValue(index)"
                  />
                </el-col>
              </el-row>
            </div>
          </template>
          <template v-if="swapType === 'sell'">
            <div class="setting-list mb-10px rounded-4px">
              <button
                v-for="item in BotSettingsArr"
                :key="item.value"
                :class="{ active: item.value === botSetting.sell.selected }"
                type="button"
                @click.stop="botSetting.sell.selected = item.value"
              >
                {{ item.label }}
              </button>
            </div>
            <div class="color-[--third-text]">
              {{ $t('setTips') }}
            </div>
            <div class="flex items-center justify-between color-[--secondary-text] mb-8px mt-15px">
              <span>{{ $t('slippage') }}</span>
              <Icon
                class="text-15px color-[--icon-color] ml-5px clickable mr-auto"
                name="material-symbols:help-rounded"
                @click.stop="openSlippageTips"
              />
              <el-checkbox
                v-if="canSetAuto"
                v-model="isAutoS"
                :label="$t('autoSlippage')"
                size="large"
                style="--el-checkbox-text-color: var(--third-text); height: 16px"
              />
            </div>
            <div class="mt-10px">
              <el-row :gutter="10">
                <el-col
                  v-for="(item, index) in slippageList"
                  :key="index"
                  :span="6"
                  class="radio-group"
                >
                  <!-- <span v-if="index !== 0" style="flex: 1"></span> -->
                  <input
                    :id="`radio-sell-${item}-${key}`"
                    v-model="botSetting.sell[selectedS].slippageValue"
                    type="radio"
                    :value="item"
                    :disabled="isAutoS"
                    class="radio-input"
                    @change.stop="changeSlippageS"
                  />
                  <label
                    :for="`radio-sell-${item}-${key}`"
                    class="radio-item"
                    :class="{ 'no-checked': botSetting.sell?.[selectedS]?.customSlippage }"
                    style="border-radius: 4px"
                    >{{ item }}%</label
                  >
                </el-col>
                <el-col :span="6">
                  <div class="slippage-input">
                    <el-input-number
                      v-model="botSetting.sell[selectedS].customSlippage"
                      class="bg-[--border] rounded-4px"
                      name="slippage"
                      type="number"
                      :placeholder="$t('custom')"
                      :min="0"
                      :max="100"
                      :step="0.01"
                      :disabled="isAutoS"
                      controls-position="right"
                      :controls="false"
                      clearable
                      :rules="[
                        { required: true, message: $t('enterSlippage') },
                        {
                          validator: (val: string) => Number(val) <= 100,
                          message: $t('slippageMaxTip'),
                        },
                      ]"
                      @change="(val) => handleCustomSlippageS(val)"
                    />
                    <span class="color-fff">%</span>
                  </div>
                </el-col>
              </el-row>
              <span
                v-if="
                  botSetting.sell[selectedS].slippageValue !== undefined &&
                  Number(botSetting.sell[selectedS].slippageValue) <= 0.1
                "
                class="tip"
                >{{ $t('slippageTip1') }}</span
              >
            </div>
            <div v-if="isCanMev" class="slippage-label mt-15px">
              <span class="mr-auto color-[--secondary-text]">{{ $t('protection') }}</span>
              <el-switch
                v-model="botSetting.sell[selectedS].mev"
                size="small"
                :before-change="solanaMevBeforeChange"
                class="ml-2px"
                style="--el-switch-on-color: #3c6cf6"
                @change="onProtectionChange('sell')"
              />
            </div>
            <div v-if="chain !== 'ton'" class="slippage-label mt-15px color-[--secondary-text]">
              <span>{{ chain === 'solana' ? $t('priorityFee') : $t('extraGas') }}</span>
            </div>
            <div v-if="chain !== 'ton'" :key="botSetting.sell[selectedS].mev" class="mt-10px">
              <el-row :gutter="10">
                <el-col
                  v-for="(item, index) in priorityListS"
                  :key="index"
                  :span="8"
                  class="radio-group"
                >
                  <!-- <span v-if="index !== 0" style="flex: 1"></span> -->
                  <input
                    :id="`radio-sell-fee-${index}`"
                    v-model="
                      botSetting.sell[selectedS].gas[botSetting.sell[selectedS].mev ? 0 : 1].level
                    "
                    type="radio"
                    :value="index"
                    class="radio-input"
                    @change.stop="changePriorityFee('sell')"
                  />
                  <label
                    :for="`radio-sell-fee-${index}`"
                    class="radio-item"
                    style="min-height: 60px"
                    :class="{
                      'no-checked':
                        botSetting?.sell?.[selectedS]?.gas?.[
                          botSetting?.sell?.[selectedS].mev ? 0 : 1
                        ]?.customFee,
                    }"
                    @click.stop="changePriorityFee('sell')"
                  >
                    <div class="text-12px">{{ priorityText[index] }}</div>
                    <span class="mt-10px text-14px" style="color: var(--a-text-1-color)"
                      >{{ item }} {{ chain === 'solana' ? 'SOL' : 'GWEI' }}</span
                    >
                  </label>
                </el-col>
              </el-row>
            </div>
            <div v-if="chain !== 'ton'" class="input-swap mt-10px">
              <el-input
                v-model="
                  botSetting.sell[selectedS].gas[botSetting.sell[selectedS].mev ? 0 : 1].customFee
                "
                class="input-number"
                inputmode="decimal"
                clearable
                :placeholder="chain === 'solana' ? $t('customFee1') : $t('customEvmFee1')"
                @update:model-value="watchCusTomPriorityFee($event, 'sell')"
                @blur="handleBlurFee('sell')"
              >
                <template #append
                  ><span class="color-[--third-text]">{{
                    chain === 'solana' ? 'SOL' : 'GWEI'
                  }}</span></template
                >
              </el-input>
            </div>
            <div v-if="showQuickAmount" class="mt-20px">
              <div class="mb-10px" style="color: #f6465d">{{ $t('setOneClickSellAmount') }}</div>
              <el-row :gutter="10">
                <el-col
                  v-for="(item, index) in botSetting.sell[selectedS].sellPerList"
                  :key="index"
                  :span="6"
                  class="click-setting"
                >
                  <el-input
                    v-model="botSetting.sell[selectedS].sellPerList[index]"
                    class="input-number"
                    inputmode="decimal"
                    placeholder="0"
                    @input="(value) => handlePer(value, index)"
                  >
                    <template #suffix>
                      <span class="color-text-1">%</span>
                    </template>
                  </el-input>
                </el-col>
              </el-row>
            </div>
          </template>
        </div>
          <div v-show="settingTab === 1">
            <div class="flex items-center bg-#FFBE3C1A p-10px rd-4px text-12px mb-20px">
              <Icon class="color-#FFBE3C text-14px" name="mdi:alert-circle" />
              <span class="ml-4px">
                {{ $t('autoSellTips') }}
              </span>
            </div>
            <el-scrollbar max-height="537px" class="pr-10px" :always="false">
              <div class="h-full overflow-hidden">
                <div class="slippage-label">
                  <span class="mr-5px">{{ $t('autoSellHalf') }}</span>
                  <Icon
                    v-tooltip="$t('autoSellHalfTips')"
                    class="text-15px color-[--icon-color] clickable mr-auto"
                    name="material-symbols:help-rounded"
                  />
                  <el-switch
                    v-model="autoSellConfigs.autoSell"
                    size="small"
                    class="ml-2px"
                    style="--el-switch-on-color: #3c6cf6"
                  />
                </div>
                <div class="slippage-label mt-15px">
                  <span class="mr-5px">{{ $t('DEVSEll') }}</span>
                  <Icon
                    v-tooltip="$t('devSellTips')"
                    class="text-15px color-[--icon-color] clickable mr-auto"
                    name="material-symbols:help-rounded"
                  />
                  <el-switch
                    v-model="autoSellConfigs.isAutoSellConfig_devsell"
                    size="small"
                    class="ml-2px"
                    style="--el-switch-on-color: #3c6cf6"
                  />
                </div>
                <div
                  v-show="autoSellConfigs.isAutoSellConfig_devsell"
                  class="flex items-center gap-20px mt-5px"
                >
                  <el-select
                    v-model="autoSellConfigs.autoSellConfig_devsell!.priceChange"
                    placeholder="--"
                    class="input-number-limit"
                    size="default"
                  >
                    <template #prefix>
                      <div class="inline-flex items-center text-12px color-[--third-text]">
                        <span>{{ $t('DEVSEll') }}</span
                        ><span class="text-18px mt--3px">≥</span>
                      </div>
                    </template>
                    <el-option
                      v-for="item in [0, 25, 50]"
                      :key="item"
                      :label="item + '%'"
                      :value="item"
                    />
                  </el-select>
                  <el-input-number
                    v-model="autoSellConfigs.autoSellConfig_devsell!.sellRatio"
                    class="input-number-limit"
                    :min="1"
                    :max="100"
                    :controls="false"
                    placeholder="--"
                  >
                    <template #prefix>
                      <span class="text-12px color-[--third-text]">{{ $t('sellRatio') }}</span>
                    </template>
                    <template #suffix>
                      <span class="color-[--third-text]">%</span>
                    </template>
                  </el-input-number>
                </div>
                <div class="slippage-label mt-15px">
                  <span class="mr-5px">{{ $t('trailingStop') }}</span>
                  <Icon
                    v-tooltip="$t('trailingStopTips')"
                    class="text-15px color-[--icon-color] clickable mr-auto"
                    name="material-symbols:help-rounded"
                  />
                  <el-switch
                    v-model="autoSellConfigs.isAutoSellConfig_trailing"
                    size="small"
                    class="ml-2px"
                    style="--el-switch-on-color: #3c6cf6"
                  />
                </div>
                <div
                  v-show="autoSellConfigs.isAutoSellConfig_trailing"
                  class="flex items-center gap-20px mt-5px"
                >
                  <el-input-number
                    v-model="autoSellConfigs.autoSellConfig_trailing!.priceChange"
                    class="input-number-limit"
                    :min="1"
                    :controls="false"
                    placeholder="--"
                  >
                    <template #prefix>
                      <span class="text-12px color-[--third-text]">{{ $t('pullback') }}</span>
                    </template>
                    <template #suffix>
                      <span class="color-[--third-text]">%</span>
                    </template>
                  </el-input-number>
                  <el-input-number
                    v-model="autoSellConfigs.autoSellConfig_trailing!.sellRatio"
                    class="input-number-limit"
                    :min="1"
                    :max="100"
                    :controls="false"
                    placeholder="--"
                  >
                    <template #prefix>
                      <span class="text-12px color-[--third-text]">{{ $t('sellRatio') }}</span>
                    </template>
                    <template #suffix>
                      <span class="color-[--third-text]">%</span>
                    </template>
                  </el-input-number>
                </div>
                <div class="slippage-label mt-15px">
                  <span class="mr-5px">{{ $t('listingOnDex') }}</span>
                  <Icon
                    v-tooltip="$t('listingOnDexTips')"
                    class="text-15px color-[--icon-color] clickable mr-auto"
                    name="material-symbols:help-rounded"
                  />
                  <el-switch
                    v-model="autoSellConfigs.isAutoSellConfig_migrated"
                    size="small"
                    class="ml-2px"
                    style="--el-switch-on-color: #3c6cf6"
                  />
                </div>
                <div
                  v-show="autoSellConfigs.isAutoSellConfig_migrated"
                  class="flex items-center gap-20px mt-5px"
                >
                  <el-input-number
                    v-model="autoSellConfigs.autoSellConfig_migrated!.sellRatio"
                    class="input-number-limit"
                    :min="1"
                    :max="100"
                    :controls="false"
                    placeholder="--"
                  >
                    <template #prefix>
                      <span class="text-12px color-[--third-text]">{{ $t('sellRatio') }}</span>
                    </template>
                    <template #suffix>
                      <span class="color-[--third-text]">%</span>
                    </template>
                  </el-input-number>
                </div>
                <AutoSellTakeProfitStopLoss :autoSellConfigs="autoSellConfigs" :title="$t('takeProfitAndStopLoss0')" name=''/>
                <AutoSellTakeProfitStopLoss :autoSellConfigs="autoSellConfigs" :title="$t('takeProfitAndStopLoss1')" name='1'/>
                <AutoSellTakeProfitStopLoss :autoSellConfigs="autoSellConfigs" :title="$t('takeProfitAndStopLoss2')" name='2'/>
                <AutoSellTakeProfitStopLoss :autoSellConfigs="autoSellConfigs" :title="$t('takeProfitAndStopLoss3')" name='3'/>
                <AutoSellTakeProfitStopLoss :autoSellConfigs="autoSellConfigs" :title="$t('takeProfitAndStopLoss4')" name='4'/>
                <AutoSellTakeProfitStopLoss :autoSellConfigs="autoSellConfigs" :title="$t('takeProfitAndStopLoss5')" name='5'/>
                <AutoSellTakeProfitStopLoss :autoSellConfigs="autoSellConfigs" :title="$t('takeProfitAndStopLoss6')" name='6'/>
              </div>
            </el-scrollbar>
            <!-- <div class="slippage-label mt-15px">
              <span class="mr-5px">{{ $t('takeProfitAndStopLoss') }}</span>
              <Icon
                v-tooltip="$t('takeProfitAndStopLossTips')"
                class="text-15px color-[--icon-color] clickable mr-auto"
                name="material-symbols:help-rounded"
              />
              <el-switch
                v-model="autoSellConfigs.isAutoSellConfig"
                size="small"
                class="ml-2px"
                style="--el-switch-on-color: #3c6cf6"
              />
            </div>
            <ul v-show="autoSellConfigs.isAutoSellConfig">
              <li
                v-for="(item, index) in autoSellConfigs.autoSellConfig"
                :key="index"
                class="mt-10px flex items-center gap-4px"
              >
                <span v-if="item.isUp" class="color-#12B886 text-14px mr-10px">{{
                  $t('takeProfit')
                }}</span>
                <span v-else class="color-#F6465D text-14px mr-10px">{{ $t('stopLoss') }}</span>
                <el-input-number
                  v-model="item.priceChange"
                  class="input-number-limit"
                  :min="1"
                  :controls="false"
                  placeholder="--"
                >
                  <template #prefix>
                    <div class="flex items-center">
                      <Icon v-if="item.isUp" name="ri:arrow-up-long-fill" class="color-#12B886" />
                      <Icon v-else name="ri:arrow-down-long-fill" class="color-#F6465D" />
                      <span class="text-12px color-[--third-text]">{{
                        item.isUp ? $t('rise') : $t('fall')
                      }}</span>
                    </div>
                  </template>
                  <template #suffix>
                    <span class="color-[--third-text]">%</span>
                  </template>
                </el-input-number>
                <el-input-number
                  v-model="item.sellRatio"
                  class="input-number-limit"
                  :min="1"
                  :max="100"
                  :controls="false"
                  placeholder="--"
                >
                  <template #prefix>
                    <span class="text-12px color-[--third-text]">{{ $t('sell') }}</span>
                  </template>
                  <template #suffix>
                    <span class="color-[--third-text]">%</span>
                  </template>
                </el-input-number>
                <Icon
                  class="text-16px ml-5px clickable color-[--third-text]"
                  name="bx:bxs-trash-alt"
                  @click.stop="autoSellConfigs.autoSellConfig.splice(index, 1)"
                />
              </li>
              <li class="flex gap-8px items-center text-14px mt-20px">
                <button
                  class="flex-1 h-44px flex items-center justify-center clickable bg-#12B8861A color-#12B886 border-none rd-8px disabled:op-50 disabled:cursor-not-allowed"
                  type="button"
                  :disabled="autoSellConfigs.autoSellConfig?.length >= 5"
                  @click.stop="addStopProfit"
                >
                  <Icon class="text-16px" name="material-symbols:add-circle-outline-rounded" />
                  <span class="ml-5px">{{ $t('addTakeProfit') }}</span>
                </button>
                <button
                  class="flex-1 h-44px flex items-center justify-center clickable bg-#F6465D1A color-#F6465D border-none rd-8px disabled:op-50 disabled:cursor-not-allowed"
                  type="button"
                  :disabled="autoSellConfigs.autoSellConfig?.length >= 5"
                  @click.stop="addStopLoss"
                >
                  <Icon class="text-16px" name="material-symbols:add-circle-outline-rounded" />
                  <span class="ml-5px">{{ $t('addStopLoss') }}</span>
                </button>
              </li>
            </ul> -->
          </div>

        <div class="form-submit">
          <el-button
            class="w-full"
            block
            size="large"
            type="primary"
            native-type="submit"
            :disabled="botSetting[selected].slippageValue == 0"
          >
            {{ $t('save') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import BigNumber from 'bignumber.js'
import { formatBotGasTips } from '@/utils/bot'
import { cloneDeep } from 'lodash-es'
import { ElMessageBox } from 'element-plus'
import type { BotChain, BotSettingKey } from '~/utils/types'
import AutoSellTakeProfitStopLoss from './autoSellTakeProfitStopLoss.vue'
const props = defineProps({
  canSetAuto: { type: Boolean, default: true },
  chain: { type: String as PropType<BotChain>, default: '' },
  setting: { type: Object, default: () => ({}) },
  isAutoSell: { type: Boolean, default: true },
  showQuickAmount: { type: Boolean, default: true },
  showClipboardSet: { type: Boolean, default: false },
  showAutoSell: { type: Boolean, default: false },
  initSwapType: { type: String as PropType<'buy' | 'sell'>, default: 'buy' },
})

const emit = defineEmits(['update:slippage', 'onSubmit'])

const { t } = useI18n()
const botSwapStore = useBotSwapStore()
const themeStore = useThemeStore()
const configStore = useConfigStore()
const swapType = ref<'buy' | 'sell'>(props.initSwapType || 'buy')

const slippageList = [5, 9, 20]
// 获取 uuid
const key = Math.random().toString(36).slice(-8)
const show = ref(false)
const isAutoB = ref(false)
const isAutoS = ref(false)
const botSettingStore = useBotSettingStore()

const botSetting = ref(cloneDeep(props.setting ?? {}))

const { autoSellConfigs, loadAutoSellConfigs, saveAutoSellConfigs } = useAutoSellConfig()

const selected = computed(() => botSetting.value.selected)

const selectedB = computed(() => botSetting.value.buy.selected)

const selectedS = computed(() => botSetting.value.sell.selected)

const settingTab = ref(0)
const clipboardQuickInput = ref(cloneDeep(botSettingStore.clipboardQuickInput))

// const slippageValue = ref<number | undefined>()
// const customSlippage = ref<number | undefined>()

watch(show, (val) => {
  if (val) {
    swapType.value = props.initSwapType || swapType.value
    if (props.showAutoSell) {
      settingTab.value = 1
    }
    botSetting.value = cloneDeep(props.setting ?? {})
    initSlippage('buy')
    initSlippage('sell')
    loadAutoSellConfigs()
    clipboardQuickInput.value = cloneDeep(botSettingStore.clipboardQuickInput)
  }
})

function initSlippage(type: 'buy' | 'sell', setIsAuto = true) {
  const selected = botSetting.value?.[type]?.selected || botSetting.value?.selected || 's1'
  const s = botSetting.value?.[type]?.[selected]?.slippage ?? 9
  if (setIsAuto) {
    if (type === 'buy') {
      isAutoB.value = s === 'auto'
    }
    if (type === 'sell') {
      isAutoS.value = s === 'auto'
    }
  }
  if (setIsAuto) {
    botSetting.value[type][selected].slippageValue = s === 'auto' ? undefined : Number(s)
    botSetting.value[type][selected].customSlippage =
      s === 'auto' || slippageList.includes(Number(s)) ? undefined : Number(s)
  } else {
    if (s === 'auto') {
      botSetting.value[type][selected].slippageValue = 9
      botSetting.value[type][selected].customSlippage = undefined
    } else {
      botSetting.value[type][selected].slippageValue = Number(s)
      botSetting.value[type][selected].customSlippage = slippageList.includes(Number(s))
        ? undefined
        : Number(s)
    }
  }
}

watch(
  () => botSetting.value.buy.selected,
  () => {
    if (show.value) {
      initSlippage('buy')
    }
  }
)

watch(
  () => botSetting.value.sell.selected,
  () => {
    if (show.value) {
      initSlippage('sell')
    }
  }
)

watch(isAutoB, (val) => {
  const selected = botSetting.value.buy.selected
  if (val) {
    botSetting.value.buy[selected].slippageValue = undefined
  } else {
    initSlippage('buy', false)
  }
})

watch(isAutoS, (val) => {
  const selected = botSetting.value.sell.selected
  if (val) {
    botSetting.value.sell[selected].slippageValue = undefined
  } else {
    initSlippage('sell', false)
  }
})

const priorityText = computed(() => [`🐢 ${t('slow')}`, `🚗 ${t('normal')}`, `🚄 ${t('fast')}`])

// const priorityList = computed(() => {
//   const selected = botSetting.value.selected
//   const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore?.gasTip, props.chain)
//   return botSetting.value[selected]?.mev ? gasTip1List : gasTip2List
// })

const priorityListB = computed(() => {
  const selected = botSetting.value.buy.selected
  const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore?.gasTip, props.chain)
  return botSetting.value.buy[selected]?.mev ? gasTip1List : gasTip2List
})

const priorityListS = computed(() => {
  const selected = botSetting.value.sell.selected
  const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore?.gasTip, props.chain)
  return botSetting.value.sell[selected]?.mev ? gasTip1List : gasTip2List
})

const isCanMev = computed(() => {
  const { gasTip1List } = formatBotGasTips(botSwapStore?.gasTip, props.chain)
  return gasTip1List?.length > 1
})

// other methods
// function changeSlippage() {
//   if (!show.value) return
//   const selected = botSetting.value.selected
//   botSetting.value[selected].customSlippage = undefined
// }

function changeSlippageB() {
  if (!show.value) return
  const selected = botSetting.value.buy.selected
  botSetting.value.buy[selected].customSlippage = undefined
}

function changeSlippageS() {
  if (!show.value) return
  const selected = botSetting.value.sell.selected
  botSetting.value.sell[selected].customSlippage = undefined
}

// function handleCustomSlippage(val: number | undefined) {
//   if (val) {
//     const selected = botSetting.value.selected
//     botSetting.value[selected].slippageValue = botSetting.value[selected].customSlippage
//   }
// }

function handleCustomSlippageB(val: number | undefined) {
  if (val) {
    const selected = botSetting.value.buy.selected
    botSetting.value.buy[selected].slippageValue = botSetting.value.buy[selected].customSlippage
  }
}

function handleCustomSlippageS(val: number | undefined) {
  if (val) {
    const selected = botSetting.value.sell.selected
    botSetting.value.sell[selected].slippageValue = botSetting.value.sell[selected].customSlippage
  }
}

function confirmSubmit() {
  const setting = cloneDeep(botSetting.value as (typeof botSettingStore.botSettings)['eth'])
  const selectedB = botSetting.value.buy.selected as BotSettingKey
  const selectedS = botSetting.value.sell.selected as BotSettingKey

  const slippageValueB = botSetting.value.buy[selectedB].slippageValue
  if (setting?.buy?.[selectedB]) {
    if (slippageValueB === undefined) {
      setting!.buy[selectedB].slippage = 'auto'
    } else {
      setting!.buy[selectedB].slippage = String(slippageValueB)
    }
    ;['s1', 's2', 's3'].forEach((s) => {
      Reflect.deleteProperty(setting!.buy![s as BotSettingKey], 'slippageValue')
      Reflect.deleteProperty(setting!.buy![s as BotSettingKey], 'customSlippage')
    })
  }

  const slippageValueS = botSetting.value.sell[selectedS].slippageValue
  if (setting?.sell?.[selectedS]) {
    if (slippageValueS === undefined) {
      setting!.sell[selectedS].slippage = 'auto'
    } else {
      setting!.sell[selectedS].slippage = String(slippageValueS)
    }
    ;['s1', 's2', 's3'].forEach((s) => {
      Reflect.deleteProperty(setting!.sell![s as BotSettingKey], 'slippageValue')
      Reflect.deleteProperty(setting!.sell![s as BotSettingKey], 'customSlippage')
    })
  }

  if (setting) {
    if (props.chain === 'solana') {
      botSettingStore.botSettings = {
        ...botSettingStore.botSettings,
        solana: { ...setting },
      }
    } else {
      botSettingStore.botSettings = {
        ...botSettingStore.botSettings,
        [props.chain]: { ...setting },
      }
    }
  }
  botSettingStore.clipboardQuickInput = cloneDeep(clipboardQuickInput.value)
  console.log('setting', setting)
  emit('onSubmit', setting)
  saveAutoSellConfigs()
  show.value = false
}

function changePriorityFee(type: 'buy' | 'sell') {
  // 如果切换等级，同时取消自定义费
  const selected = botSetting.value[type].selected
  const gas = botSetting.value[type][selected]?.gas?.[botSetting.value[type][selected].mev ? 0 : 1]
  if (gas) gas.customFee = ''
}

function watchCusTomPriorityFee(val: string, type: 'buy' | 'sell') {
  const selected = botSetting.value[type].selected
  const gas = botSetting.value[type][selected]?.gas?.[botSetting.value[type][selected].mev ? 0 : 1]
  if (gas) gas.customFee = val
}

function handleBlurFee(type: 'buy' | 'sell') {
  const selected = botSetting.value[type].selected
  const gas = botSetting.value[type][selected]?.gas?.[botSetting.value[type][selected].mev ? 0 : 1]
  if (gas && new BigNumber(gas.customFee).lt(0)) {
    gas.customFee = ''
  }
}

function handleBuyValue(value: string, index: number) {
  const v = value.replace(/-|[^\d.]/g, '')
  const selected = botSetting.value.buy.selected
  botSetting.value.buy[selected].buyValueList[index] = v
}

function handleBlurBuyValue(index: number) {
  // 限制合法性，可添加逻辑
  const decimals = 4
  const selected = botSetting.value.buy.selected
  const v = botSetting.value.buy[selected].buyValueList[index]
  const v1 = new BigNumber(v || 0)
    .toFixed()
    ?.match?.(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))?.[0]
  if (String(v) !== String(v1)) {
    if (Number(v1) === 0) {
      botSetting.value.buy[selected].buyValueList[index] = '0'
    } else {
      botSetting.value.buy[selected].buyValueList[index] = v1
    }
  }
}

function handleBlurBuyValue1(value: string) {
  const decimals = 4
  const v = value
  const v1 =
    new BigNumber(v || 0)
      ?.toFixed?.()
      .match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))?.[0] || ''
  if (String(v) !== String(v1)) {
    if (v === '') {
      clipboardQuickInput.value[props.chain] = ''
    } else if (Number(v1) === 0) {
      clipboardQuickInput.value[props.chain] = '0'
    } else {
      clipboardQuickInput.value[props.chain] = v1
    }
  }
}

function handlePer(value: string, index: number) {
  let v = value.replace(/-|[^\d.]/g, '')
  if (Number(v) > 100) {
    v = '100'
  } else if (Number(v) < 0) {
    v = '0'
  }
  const selected = botSetting.value.selected
  botSetting.value[selected].sellPerList[index] = v
}

function openSlippageTips() {
  // 提示逻辑，可扩展
  ElMessageBox.alert(t('slippageTips'), {
    title: t('slippage'),
    confirmButtonText: t('iKnown'),
  }).then(() => {
    // on close
  })
}

function solanaMevBeforeChange() {
  return true // 可做权限判断
}

function onProtectionChange(type: 'buy' | 'sell') {
  nextTick(() => changePriorityFee(type))
}

function addStopProfit() {
  autoSellConfigs.value.autoSellConfig.push({
    open: true,
    priceChange: undefined,
    sellRatio: undefined,
    type: 'default',
    isUp: true,
  })
}

function addStopLoss() {
  autoSellConfigs.value.autoSellConfig.push({
    open: true,
    priceChange: undefined,
    sellRatio: undefined,
    type: 'default',
    isUp: false,
  })
}
</script>

<style lang="scss" scoped>
.popup-content {
  --van-cell-background-color: #eaecef;
}
.radio-group {
  display: flex;
  align-items: center;
  .radio-input {
    width: 0;
    height: 0;
    font-size: 0;
    opacity: 0;
    &:checked + .radio-item:not(.no-checked) {
      // background: var(--custom-primary-color);
      border: 1px solid var(--primary-color);
      color: var(--main-text);
      background: rgba($color: #3f80f7, $alpha: 0.08);
    }
    &:disabled + .radio-item {
      opacity: 0.5;
    }
  }
  .radio-item {
    border: 1px solid var(--border);
    background: var(--border);
    border-radius: 8px;
    min-width: 86px;
    font-size: 14px;
    color: var(--secondary-text);
    letter-spacing: 0;
    font-weight: 400;
    text-align: center;
    min-height: 32px;
    line-height: 1;
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 8px 0;
  }
}
.slippage-label {
  font-size: 14px;
  color: var(--secondary-text);
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
  text-align: left;
  display: flex;
  align-items: center;
  line-height: 1;
  .iconfont {
    &:active {
      opacity: 0.5;
    }
  }
}
.slippage-input {
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--custom-text-1-color);
  font-weight: 400;
  .is-disabled {
    opacity: 0.5;
  }
  &:deep() .el-input__wrapper,
  &:deep() .el-input__inner {
    background-color: var(--border);
    color: var(--main-text);
  }
  &:deep() .el-input-number__decrease,
  &:deep() .el-input-number__increase {
    background-color: var(--border);
    color: var(--main-text);
  }
  .input {
    font-size: 14px;
    background: #ffffff;
    border: 1px solid #dcdee0;
    color: var(--main-text);
    border-radius: 8px;
    height: 36px;
    padding: 0 14px;
    flex: 1;
    &:focus-within {
      border-color: #558bed;
    }
    :deep() .van-field__body {
      height: 100%;
    }
  }
  span {
    margin-left: 5px;
  }
}
.form-submit {
  margin-top: 20px;
  text-align: center;
}

.input-swap {
  display: flex;
  align-items: center;
  background: var(--border);
  border-radius: 4px;
  height: 32px;
  --el-fill-color-light: var(--border);
}
.input-number {
  flex: 1;
  background: var(--border);
  --el-input-bg-color: var(--border);
  --el-input-border-color: var(--border);
  border-radius: 4px;
  :deep().el-input__inner {
    color: var(--main-text);
  }
}
.slippage-input {
  --el-input-border-color: transparent;
  --el-border-color: transparent;
  :deep() .el-input__wrapper {
    color: var(--a-text-1-color);
  }
}
.click-setting {
  :deep() .el-input__inner {
    text-align: center;
  }
}
.setting-list {
  display: flex;
  justify-content: space-between;
  background: var(--border);
  // color: var(--third-text);
  padding: 2px;
  button {
    color: var(--third-text);
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    border: none;
    cursor: pointer;
    flex: 1;
    border-radius: 4px;
    height: 28px;
    font-size: 14px;
    background: transparent;
    &.active {
      background: var(--dialog-tab-active-bg);
      color: var(--main-text);
    }
  }
  &.swap-type {
    padding: 4px;
    button {
      height: 32px;
      &.active {
        &:first-child {
          color: var(--up-color);
        }
        &:last-child {
          color: var(--down-color);
        }
      }
    }
  }
}
.input-number-limit {
  width: auto;
  flex: 1;
  :deep(.el-input) {
    height: 36px;
    --el-input-bg-color: var(--border);
    --el-input-border-color: transparent;
    --el-input-hover-border-color: transparent;
    --el-input-focus-border-color: transparent;
    .el-input__inner {
      text-align: right;
    }
  }
  :deep(.el-select__wrapper) {
    height: 36px;
    font-size: 14px;
    .el-select__selected-item {
      text-align: right;
    }
  }
}
.clipped-input {
  :deep(.el-input-group__append) {
    padding: 0 8px;
  }
}
:deep(.el-input__inner::placeholder) {
  color: var(--third-text);
}
:deep(.el-checkbox__inner) {
  border-color: var(--border);
}
</style>
