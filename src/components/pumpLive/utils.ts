import XIndex from './xIndex.vue'

import { type LiveContent,  getPumpLiveContent } from '@/api/pumpLive'


export function useXPopup() {
  const { $createTooltip } = useNuxtApp()

  const $tooltip = $createTooltip('x--tooltip')

  const contentProps = reactive<{
    info: LiveContent | null,
    loading: boolean
  }>({
    info: null,
    loading: false
  })

  function onEnter(tokenId: string, e: { target: any }, isGetData = true) {
    if (isGetData) {
      _getPumpLiveContent(tokenId)
      // contentProps.info = {
      //   ath_market_cap: '',
      //   banner_uri: 'https://prod-livestream-thumbnails-841162682567.s3.us-east-1.amazonaws.com/696781/1758102876756.jpeg',
      //   chain: 'solana',
      //   creator: '2Yc1csZSwDSNoPDeoAoE2cHLmYEs4AjYvbrCWFEaMXwT',
      //   description: '1Billion Rocket Pump $1BROCKET 24/7 LIVE on Pumpfun I craft endless rockets each one hand marked with $1BROCKET for the true believers. Every $1M MC = One a real rocket launch. The ultimate mission? We won’t stop until a sky shaking $1 BILLION MC ignites ',
      //   image_uri: 'https://www.iconaves.com/ipfs/thumbs/ERuzgzrjSWtaPcS5MGJtoLmBobKtvxdQE3z743Vhpump_128x128.webp',
      //   is_currently_live: '',
      //   market_cap: '54247.491',
      //   metadata_uri: '',
      //   name: 'Spirit Bomb',
      //   num_participants: 0,
      //   platform: '',
      //   reply_count: 18,
      //   stream_start_timestamp: 1758096800,
      //   symbol: 'SPIRIT',
      //   telegram: 'https://t.me/PORTAL_1BROCKET',
      //   thumbnail: 'https://prod-livestream-thumbnails-841162682567.s3.us-east-1.amazonaws.com/696781/1758102876756.jpeg',
      //   token: '9hMHvYcaUiphtW273ttnzUXDRvjXZ89xs9YBCLStpump',
      //   total_supply: '0',
      //   twitter: '1BROCKET',
      //   usd_market_cap: '0',
      //   video_uri: 'https://pump.fun/coin/B48aG7ZxWr6DM7Q7NYoabDBihQjGK13TsUqrRyEcpump?include-nsfw=true',
      //   website: 'https://1brocket.fun/'
      // }
    }
    $tooltip.show({
      content: {
        is: XIndex,
        props: contentProps
      },
      target: e.target,
      props: {
        showArrow: false,
        placement: 'bottom',
        trigger: 'hover',
        offset: 10,
        'popper-class': 'x--tooltip',
        'onUpdate:visible': (v: boolean) => {
          if (v) return
          $tooltip.hide()
        }
      }
    })
  }


  async function _getPumpLiveContent(tokenId: string) {
    if (!tokenId) {
      return
    }
    contentProps.loading = true
    getPumpLiveContent(tokenId).then(res => {
      // contentProps.info = {...res, video_uri: `https://pump.fun/coin/${res.token}?include-nsfw=true`}
      contentProps.info = res
    }).catch(() => {
      contentProps.info = null
    }).finally(() => {
      contentProps.loading = false
    })
  }

  return {
    onEnter,
    contentProps
  }
}

export function convertTextToHtml(str: string) {
  // 先处理换行符，将\n转换为<br>
  let html = str.replace(/\n/g, '<br>')

  // 然后处理链接
  const urlRegex = /(https?:\/\/[^\s]+)/g
  html = html.replace(urlRegex, function(url: string) {
    return `<a href="${url}" class="color-#009EF7 clickable" target="_blank" rel="noopener noreferrer">${url}</a>`
  })

  return html
}


