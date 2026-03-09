// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const isProd = process.env.NODE_ENV === 'production'
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-04-24',
  srcDir: 'src/',
  devtools: {
    enabled: false
  },
  app: {
    // 禁用页面切换动画
    pageTransition: false,
    // 禁用布局切换动画
    layoutTransition: false
  },
  modules: [
    '@nuxt/eslint',
    // '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@unocss/nuxt',  // 启用 UnoCSS 模块

    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
  ],
  runtimeConfig: {
    public: {
      // apiBase: process.env.NUXT_PUBLIC_API_BASE,
      ga: process.env.NUXT_PUBLIC_GA
    }
  },
  // fonts: {
  //   families: [
  //     {
  //       name: 'DINPro-regular',
  //       src: '/fonts/DINPro-regular.otf',
  //       global: true,
  //       weight: 'normal',
  //       style: 'normal',
  //       // unicodeRange: 'U+0030-0039',
  //       preload: true
  //     },
  //     {
  //       name: 'Poppins-regular',
  //       src: '/fonts/Poppins-Regular.ttf',
  //       global: true,
  //       weight: 'normal',
  //       style: 'normal',
  //       unicodeRange: 'U+4E00-9FFF',
  //       preload: true

  //     }
  //   ],
  //   providers: {
  //     google: false,
  //     googleicons: false
  //   }
  // },
  icon: {
    // 可根据情况配置：
    // mode: 'auto' | 'local' | 'cdn'
    // 推荐用 'auto' 或 'cdn' 来避免本地构建限制
    mode: 'local',
    // 配置自定义图标集合
    // 自定义icon 放在 ./src/assets/icons 文件夹下 svg, 单色图标 需要将 svg 里 fill 改成 currentColor 这样可以修改颜色
    // 使用方式  <Icon name="custom:dark" class="text-20px color-green" />
    customCollections: [
      {
        prefix: 'custom',
        dir: './src/assets/icons'
      },
      {
        prefix: 'custom-media',
        dir: './src/assets/icons/media'
      },
    ],
    clientBundle: {
      sizeLimitKb: 512
    }
  },
  generate: {
    // routes: [
    //   '/'
    // ]
  },
  build: {
    transpile: ['element-plus']
  },
  nitro: {
    preset: 'node',  // 禁用 API 路由（或根据你的需求使用其他预设）
  },
  router: {

  },
  routeRules: {
    '/pump/**': { sitemap: false },
    '/*/components/**': { sitemap: false },
    '/follow/': { sitemap: false },
  },
  site: {
    url: 'https://pro.ave.ai', // 替换为你的域名
    name: 'Ave.ai',
  },
  css: [
    // 可以在这里添加 UnoCSS 的基础样式（如果需要的话）
    // 'uno.css',
    '@/assets/css/font.css',
    '@/assets/css/reset.css',
    '@/assets/css/var.scss',
    '@/assets/css/style.scss',
    '@/assets/css/element-plus/reset.scss'
  ],
  plugins: [
    // 添加 gameanalytics
    '@/plugins/core-js.ts',
    '@/plugins/gameanalytics.client.ts',
    '@/plugins/tooltip.client.ts', // 移到前面，确保在 directives 之前加载
    '@/plugins/directives/index.ts', // 引入自定义指令插件
    '@/plugins/pwa-meta.client.ts', // 引入 pwa-meta 插件
    '@/plugins/i18n-sync.client.ts',
    '@/plugins/i18n-global.client.ts',
    '@/plugins/theme-init.client.ts',
    '@/plugins/api/index.ts',
    '@/plugins/vemachine-init.client.ts',
    '@/plugins/tradingview.client.ts',
    '@/plugins/popover.client.ts',
    '@/plugins/dialog.client.ts',
    '@/plugins/aliyun-captcha.client.ts',
    '@/plugins/performance-clean.client.ts',
  ],
  // unocss: {
  //   nuxtLayers: true,
  // },
  elementPlus: {
    importStyle: 'scss',
    themes: ['dark'],
  },

  vite: {
    plugins: [
      nodePolyfills({
        // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
        // include: ['path'],
        // // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
        // exclude: [
        //   'http', // Excludes the polyfill for `http` and `node:http`.
        // ],
        // // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          // global: false,
          // process: false,
        },
        // Override the default polyfills for specific modules.
        // overrides: {
        //   // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        //   fs: 'memfs',
        // },
        // Whether to polyfill `node:` protocol imports.
        // protocolImports: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 修改主题色
          additionalData: '@use "~/assets/css/element-plus/index.scss";',
          api: 'modern-compiler',
        },
      }
    },
    $client: {
      optimizeDeps: {
        include: [
          'lodash-unified',
          'dayjs',
          'bignumber.js',
          'js-cookie',
        ]
      }
    },
    optimizeDeps: {
      include: [
        'lodash-unified',
        'dayjs',
        'bignumber.js',
        'js-cookie',
      ]
    },
    build: {
      minify: 'terser',
      sourcemap: !isProd,
      terserOptions: {
        compress: {
          drop_console: isProd, // 移除所有 console.log
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 区块链 SDK 按链分包 — 避免主包过大
            if (id.includes('@solana/web3.js') || id.includes('@solana/spl-token')) {
              return 'vendor-solana'
            }
            if (id.includes('tronweb') || id.includes('@tronweb3')) {
              return 'vendor-tron'
            }
            if (id.includes('@mysten/sui') || id.includes('@mysten/wallet-standard')) {
              return 'vendor-sui'
            }
            if (id.includes('@tonconnect') || id.includes('tonweb') || id.includes('tonapi-sdk')) {
              return 'vendor-ton'
            }
            if (id.includes('@7kprotocol') || id.includes('@edgex-fe')) {
              return 'vendor-defi-sdk'
            }
            if (id.includes('@walletconnect')) {
              return 'vendor-walletconnect'
            }
            // ethers 单独分包（较大）
            if (id.includes('/ethers/') || id.includes('/ethers@')) {
              return 'vendor-ethers'
            }
            // web3.js 单独分包
            if (id.includes('/web3/') || id.includes('/web3@')) {
              return 'vendor-web3'
            }
            // ECharts 单独分包
            if (id.includes('/echarts/') || id.includes('/echarts@') || id.includes('/zrender/')) {
              return 'vendor-echarts'
            }
            // Element Plus 单独分包
            if (id.includes('element-plus') || id.includes('@element-plus')) {
              return 'vendor-element-plus'
            }
            // Vue 生态
            if (
              id.includes('/vue/') ||
              id.includes('/vue@') ||
              id.includes('@vue/') ||
              id.includes('vue-router') ||
              id.includes('pinia') ||
              id.includes('@vueuse/')
            ) {
              return 'vendor-vue'
            }
          }
        }
      }
    }
  },
  pwa: {
    registerType: 'prompt',
    devOptions: {
      enabled: false
    },
    includeAssets: [
      'favicon.ico',
      'robots.txt',
      'apple-touch-icon.png',
      'icons/**',
    ],
    manifest: {
      name: 'Ave.ai',
      short_name: 'Ave',
      start_url: '/',
      display: 'standalone',
      background_color: '#131722',
      theme_color: '#131722',
      icons: [
        {
          src: '/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,ico,png,jpg,jpeg,svg,webp,json,woff2,otf,ttf,woff}'],
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MiB，避免 SW 缓存超大 chunk
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          // 匹配 Iconify 的域名
          urlPattern: ({ url }) => url.host === 'api.iconify.design',
          handler: 'CacheFirst',
          options: {
            cacheName: 'iconify-json-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 本地存 30 天
            },
            cacheableResponse: {
              // 明确允许缓存成功（200）的响应
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: ({ request }) => request.destination === 'document',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'html-cache',
            expiration: { maxAgeSeconds: 0 },
          },
        },
      ],
    },
  },

  i18n: {
    locales: [
      { code: 'zh-cn', file: 'zh-cn.json', name: '简体中文' },
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'zh-tw', file: 'zh-tw.json', name: '繁體中文' },
      { code: 'es', file: 'es.json', name: 'Español' }, // { name: 'Español', subName: '(Latinoamérica)', value: 'es' },
      { code: 'pt', file: 'pt.json', name: 'Português (Brasil)' },
      { code: 'tr', file: 'tr.json', name: 'Türkçe' },
      { code: 'ru', file: 'ru.json', name: 'Русский' },
      { code: 'vi', file: 'vi.json', name: 'Tiếng Việt' },
      { code: 'ko', file: 'ko.json', name: '한국어' },
      { code: 'ja', file: 'ja.json', name: '日本語' },
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    lazy: true, // 懒加载语言文件
    strategy: 'no_prefix',
    langDir: './lang',
    vueI18n: './i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false
    },
    compilation: {
      strictMessage: false
    }
  },
  hooks: {
    'pages:extend'(pages) {
      // 过滤 pages下 _ 开头 和 components 不进入路由
      const ignoredDirs = ['components']
      const isIgnored = (path: string) =>
        ignoredDirs.some(dir => path.includes(dir)) ||
        path.split('/').some(segment => segment.startsWith('_'))

      for (let i = pages.length - 1; i >= 0; i--) {
        if (isIgnored(pages[i].path)) {
          pages.splice(i, 1)
        }
      }
      // console.log('pages', JSON.stringify(pages))
    }
  }
})
