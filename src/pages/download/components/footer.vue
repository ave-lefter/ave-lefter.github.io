<template>
  <footer class="bg-black py-16">
    <div class="container mx-auto px-4 text-left">
      <h2 class="text-5xl font-bold mb-8 text-center">{{ $t("downloadAve") }}</h2>
      <div class="flex justify-center items-center mb-[40px]">
        <NuxtLink to="/download/help" class="text-sm font-medium flex items-center">
          <img
            src="https://c.animaapp.com/mdi5x5j31K7D2j/img/frame.svg"
            alt=""
            class="w-5 h-5 mr-2"
          >
          {{ $t("appFaq") }}
        </NuxtLink>
      </div>
      <div class="flex justify-center gap-20 font-normal mb-12">
        <div class="w-[15%]">
          <h3 class="text-sm mb-2">IOS</h3>
          <a
            href="https://apps.apple.com/us/app/ave-pro/id6741381461?l=zh-Hans-CN"
            class="bg-[#161926] mb-8 text-white flex items-center justify-center py-3 px-6 rounded-lg hover:bg-opacity-80 transition duration-300"
          >
            <svg
              class="w-6 h-6 mr-2"
              viewBox="0 0 21 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.1148 13.405C17.084 8.86378 19.6359 8.74626 19.7506 8.67351C18.3152 6.57498 16.0824 6.24481 15.2877 6.21403C13.3878 6.02097 11.5803 7.31086 10.615 7.31086C9.65245 7.31086 8.1639 6.21123 6.5886 6.23921C4.51805 6.26999 2.60698 7.43957 1.53813 9.29467C-0.613561 13.0301 0.986919 18.5618 3.08545 21.5893C4.10953 23.0722 5.33228 24.7371 6.93835 24.6783C8.48287 24.6167 9.06766 23.6766 10.9368 23.6766C12.8058 23.6766 13.3291 24.6783 14.9659 24.6447C16.628 24.614 17.6828 23.1338 18.6985 21.6452C19.8765 19.9244 20.3606 18.3435 20.3885 18.2596C20.3522 18.2428 17.1456 16.4325 17.112 13.405H17.1148Z"
                fill="white"
              />
              <path
                d="M10.4521 6.37108C10.4521 3.00224 13.183 0.268555 16.5547 0.268555C16.5547 3.64019 13.821 6.37108 10.4521 6.37108Z"
                fill="white"
              />
            </svg>
            <span>App Store</span>
          </a>
          <a
            href="https://testflight.apple.com/join/BZ3XHS5f"
            class="bg-[#161926] text-white flex items-center justify-center py-3 px-6 rounded-lg hover:bg-opacity-80 transition duration-300"
          >
            <img
              src="/download/vector-9.svg"
              alt="TestFlight"
              class="w-5 h-5 mr-2"
            >
            <span>TestFlight</span>
          </a>
        </div>
        <div class="w-[15%]">
          <h3 class="text-sm mb-2">Android</h3>
          <a
            href="https://play.google.com/store/apps/details?id=ai.ave.platform"
            class="bg-[#161926] mb-8 text-white flex items-center justify-center py-3 px-6 rounded-lg hover:bg-opacity-80 transition duration-300"
          >
            <img
              src="/download/frame-1.svg"
              alt="Google Play"
              class="w-5 h-5 mr-2"
            >
            <span>Google Play</span>
          </a>
          <a
            href="https://ossaveai.com/oss/app/ave.ai.apk"
            class="bg-[#161926] text-white flex items-center justify-center py-3 px-6 rounded-lg hover:bg-opacity-80 transition duration-300"
          >
            <img
              src="/download/vector-6.svg"
              alt="Android APK"
              class="w-5 h-5 mr-2"
            >
            <span>Android APK</span>
          </a>
        </div>
        <div class="w-[15%]">
          <h3 class="text-sm mb-2 font-normal">{{ $t('deskApp') }}</h3>
          <a
            href="https://ossaveai.com/oss/app/avedex-mac.dmg.zip"
            class="bg-[#161926] mb-8 text-sm text-white flex items-center justify-center py-3 px-6 rounded-lg hover:bg-opacity-80 transition duration-300"
          >
            <svg
              class="w-6 h-6 mr-2"
              viewBox="0 0 21 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.1148 13.405C17.084 8.86378 19.6359 8.74626 19.7506 8.67351C18.3152 6.57498 16.0824 6.24481 15.2877 6.21403C13.3878 6.02097 11.5803 7.31086 10.615 7.31086C9.65245 7.31086 8.1639 6.21123 6.5886 6.23921C4.51805 6.26999 2.60698 7.43957 1.53813 9.29467C-0.613561 13.0301 0.986919 18.5618 3.08545 21.5893C4.10953 23.0722 5.33228 24.7371 6.93835 24.6783C8.48287 24.6167 9.06766 23.6766 10.9368 23.6766C12.8058 23.6766 13.3291 24.6783 14.9659 24.6447C16.628 24.614 17.6828 23.1338 18.6985 21.6452C19.8765 19.9244 20.3606 18.3435 20.3885 18.2596C20.3522 18.2428 17.1456 16.4325 17.112 13.405H17.1148Z"
                fill="white"
              />
              <path
                d="M10.4521 6.37108C10.4521 3.00224 13.183 0.268555 16.5547 0.268555C16.5547 3.64019 13.821 6.37108 10.4521 6.37108Z"
                fill="white"
              />
            </svg>
            <span>Mac OS</span>
          </a>
          <a
            href="https://ossaveai.com/oss/app/ave.ai-win64.exe"
            class="bg-[#161926] text-sm text-white flex items-center justify-center py-3 px-6 rounded-lg hover:bg-opacity-80 transition duration-300"
          >
            <svg
              class="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.107422 0.524414H9.14133V9.55514H0.107422V0.524414ZM10.1302 0.524414H19.1641V9.55514H10.1302V0.524414ZM0.107422 10.5471H9.14133V19.5811H0.107422V10.5471ZM10.1302 10.5471H19.1641V19.5811H10.1302"
                fill="white"
              />
            </svg>
            <span>Windows</span>
          </a>
        </div>
        <div class="w-[15%]">
          <span class="text-xs mb-2 block">{{ $t('downloadByScanCode') }}</span>
          <img
            src="/download/1-1040045937-171-85-3-1000342829-2aa8d298ea104cbef30a3b8a5e449fd-1.png"
            alt="QR Code"
            class="w-32 h-32 bg-white p-2 rounded-lg mx-auto"
          >
        </div>
      </div>
      <div class="text-center mb-20">
        <a
          :href="useLocaleStore().locale == 'zh-cn' ? 'https://t.me/ave_community_cn':'https://t.me/aveai_english'"
          class="bg-gradient-to-r from-[#0054e1] to-[#8860ff] text-white py-3 px-22 rounded-full inline-flex items-center hover:opacity-90 transition duration-300"
        >
          <img src="/download/vector-1.svg" alt="Telegram" class="w-5 h-5 mr-2">
          {{ $t('joinTelegram') }}
        </a>
      </div>
    </div>
  </footer>
</template>
