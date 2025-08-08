// plugins/app-meta.client.ts
export default defineNuxtPlugin(() => {
  // const config = useRuntimeConfig()
  // const GA = config.public.ga
  useHead({
    title: 'Ave.ai',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      { name: 'title', content: 'Ave.ai' },
      {
        name: 'description',
        content:
          'Ave.ai is the most comprehensive on-chain crypto trading platform, integrating 130+ blockchains and 300+ DEXs...',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://ave.ai' },
      { property: 'og:title', content: 'Ave.ai - The Ultimate Web3 Trading Platform' },
      {
        property: 'og:description',
        content: 'Real-Time Blockchain Data, Price Alerts, Smart Money, KOL, Sniping, Copy-Trading and more.',
      },
      { property: 'og:image', content: 'https://ave.s3.ap-east-1.amazonaws.com/logo/tg-share.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '600' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: 'https://ave.ai' },
      { property: 'twitter:title', content: 'Ave.ai - The Ultimate Web3 Trading Platform' },
      {
        property: 'twitter:description',
        content: 'Real-Time Blockchain Data, Price Alerts, Smart Money, KOL, Sniping, Copy-Trading and more.',
      },
      { property: 'twitter:image', content: 'https://ave.s3.ap-east-1.amazonaws.com/logo/tg-share.png' },
      { property: 'fb:app_id', content: '1024585522541030' },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'shortcut icon', href: '/favicon.ico' },
    ],
    // script: [
    //   {
    //     src: `https://www.googletagmanager.com/gtag/js?id=${GA}`,
    //     async: true,
    //   },
    //   {
    //     id: 'gtag-init', // 或 id: 'gtag-init'
    //     innerHTML: `
    //       window.dataLayer = window.dataLayer || [];
    //       function gtag(){dataLayer.push(arguments);}
    //       gtag('js', new Date());
    //       gtag('config', '${GA}');
    //     `,
    //     type: 'text/javascript',
    //   },
    // ],
  })

  // 执行跳转/安全逻辑
  redirectIfMobile()
  antiClickjack()
  // addTvScriptJs()
})

function redirectIfMobile() {
  const isMobile = /mobile|phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile/i.test(
    navigator.userAgent,
  )
  const isUnRedirect = /(opencc\.club)|(aveaidata\.com)|localhost|test/i.test(location.hostname)
  if (isMobile && location.protocol.includes('http') && !location.host.includes('test') && !isUnRedirect) {
    const path = location.pathname
    if (path === '/rank') {
      location.replace('https://airdrop.ave.ai')
    } else if (path === '/meme') {
      location.replace('https://meme_team.ave.ai')
    } else {
      location.replace(`${location.protocol}//m.${location.host.replace('pro.', '')}${path}${location.search}`)
    }
  }
}

function antiClickjack() {
  try {
    const anti = document.getElementById('antiClickjack')
    if (window.self === window.top && anti) {
      anti.remove()
    } else if (window.top && window.top !== window.self) {
      window.top.location.href = window.self.location.href
    }
  } catch (e) {
    console.warn('Anti clickjack failed:', e)
  }
}
