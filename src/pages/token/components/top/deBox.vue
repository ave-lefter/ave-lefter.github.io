<template>
  <div class="debox">
    <a
      v-if="supportChain[chain]"
      href=""
      class="p-2px radius-2px h-16px flex items-center bg-btn"

      @click.stop.prevent="toggle"
      >
      <Icon
        name="custom:debox"
        class="color-[--d-666-l-999] text-12px"
        :class="show? 'color-#21c161': ''"
      />
      <!-- <img v-if="show" src="@/assets/images/debox_on.svg" alt="" width="16px">
      <img  v-else src="@/assets/images/debox_off.svg" alt="" width="16px"> -->
  </a>
    <div v-show="supportChain[chain] && show" id="chat-deBox"/>
  </div>
</template>

<script setup lang="ts">
import { DeBoxChatWidget } from '@debox-pro/chat-widget-html'
import { _getConversationId } from '@/api/debox'
import { getAddressAndChainFromId } from '@/utils'
import { useLocalStorage, useStorage } from '@vueuse/core'
const deboxConversation = useStorage<Record<string, string>>('deboxCoversation', {}, sessionStorage)
const route = useRoute()
const conversationId = shallowRef('')
const supportChain: Record<string, number> = {
  solana: -200,
  eth: 1,
  optimism: 10,
  bsc: 56,
  polygon: 137,
  xlayer: 196,
  ftm: 250,
  zksync: 324,
  merlin: 4200,
  mantle: 5000,
  base: 8453,
  arbitrum: 42161,
  avalanche: 43114,
  linea: 59144,
  blast: 81457,
  bitlayer: 200901,
  scroll: 534352,
}
const show = useLocalStorage('showDeBox', false)
const isMin = useLocalStorage('isMin', true)
let counts = 0
const chain = computed(() => {
  return getAddressAndChainFromId(route.params.id as string)?.chain || ''
})
const tokenAddress = computed(() => {
  return (
    getAddressAndChainFromId(route.params.id as string)?.address
  )
})
watch(
  () => route.params.id,
  () => {
    if (DeBoxChatWidget.tag) {
      init()
    }
  }
)
onMounted(() => {
  init()
})
onUnmounted(() => {
  if (DeBoxChatWidget.tag) {
    DeBoxChatWidget.destroy()
  }
})
async function init() {
  if (supportChain[chain.value] && show.value) {
    conversationId.value = await getConversationId() || ''
    if (conversationId.value) {
      toggleSDK(conversationId.value)
    }
  }
}
function toggleSDK(curConversationId: string) {

  // 可判断插件是否初始化
  if (DeBoxChatWidget.tag) {
    // 判断当前会话ID 是否等于插件初始化的会话ID
    console.log('-----------DeBoxChatWidget.config.conversationId-------------', DeBoxChatWidget.config.conversationId)
    console.log('-----------curConversationId------------', curConversationId)
    // if (DeBoxChatWidget.config.conversationId !== curConversationId) {
      // 变更会话
      DeBoxChatWidget.setConversation(curConversationId, isMin.value)
    // } else {
    //   // 缩放会话
    //   DeBoxChatWidget.toggleChat()
    // }

    // DeBoxChatWidget.toggleChat(false)


  } else {
    DeBoxChatWidget.init({
      projectId: 'QMPwBXl11rZZlQp0',
      zIndex: '999',
      containerDomId: 'chat-deBox',
      destroyOnClose: true,
      defaultOpen: isMin.value,
      conversationId: curConversationId,
      onToggle: (isOpen) => {
      console.log(isOpen)
        console.log('--------isOpen-------', isOpen, typeof isOpen)
        isMin.value = isOpen
      },
      onDestroy: () => {
        console.log('--------onDestroy-------')
        show.value = false
      },

    })
  }
}
function getConversationId(): Promise<string> {
  return new Promise((resolve, reject) => {
      const data = {
          chain_id: supportChain[chain.value],
          contract_address: tokenAddress.value,
      }
    // if (deboxConversation.value[data.contract_address + '-' + data.chain_id]) {
    //   conversationId.value = deboxConversation.value[data.contract_address + '-' + data.chain_id]
    //   return
    // }

      _getConversationId(data)
      .then((res) => {
        conversationId.value = res?.data?.cid
        console.log('--------res---', res?.data?.cid)
        resolve(conversationId.value)
        // console.log('---------uuuuuuuuuu---------------',Object.keys(deboxConversation.value)?.length)
        // if (deboxConversation.value && Number(Object.keys(deboxConversation.value)?.length) > 100) {
        //   deboxConversation.value = Object.fromEntries(
        //       Object.entries(deboxConversation.value).slice(0, 99)
        //   )
        // }
        // deboxConversation.value[data.contract_address + '-' + data.chain_id] = res?.data?.cid
        if (DeBoxChatWidget.tag) {
            DeBoxChatWidget.setConversation(conversationId.value)
        }
      }).catch(() => {
          reject('')
        })
  })
}
function toggle() {
  show.value = !show.value
  if (show.value) {
      init()
  } else {
    if (DeBoxChatWidget.tag) {
      DeBoxChatWidget.destroy()
    }
  }
}
</script>

<style scoped>
.bg-btn {
    margin-right: 4px;
    height: 16px;
    min-width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    background-color: var(--d-222-l-F2F2F2);
    padding: 2px;
}
</style>
