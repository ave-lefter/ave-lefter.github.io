<template>
  <div class="w-full h-full bg-[#000]! color-white!">
    <main class="relative w-full max-w-[1920px] mx-auto">
      <section class="max-w-[1200px] mx-auto pt-[120px]">
        <header class="text-center mb-[80px]">
          <h1 class="text-4xl font-medium mb-[-16px]">{{ $t("Android") }} {{ $t("tutor") }}</h1>
          <div class="flex items-center justify-center">
            <div class="w-[368px] h-px bg-[#1e41ea]"/>
            <div class="w-[392px]"/>
            <div class="w-[368px] h-px bg-[#1e41ea]"/>
          </div>
        </header>
        <div class="flex justify-center gap-10 mb-[120px]">
          <div class="w-[360px] bg-[#191a1a] rounded-xl p-6">
            <h2 class="text-3xl font-black text-[#1e41ea] mb-4">1.</h2>
            <p class="text-base">
              {{ $t("click") }} "<a href='https://ossaveai.com/oss/app/ave.ai.apk' class="text-[#1e41ea]">{{ $t("Android") }}</a>"
              {{ $t("helpTip1") }}
            </p>
          </div>
          <div class="w-[360px] bg-[#191a1a] rounded-xl p-6">
            <h2 class="text-3xl font-black text-[#1e41ea] mb-4">2.</h2>
            <p class="text-base">
              {{ $t("helpTip2") }} "
              <a
              :href="useLocaleStore().locale == 'zh-cn' ? 'https://t.me/ave_community_cn':'https://t.me/aveai_english'" class="text-[#1e41ea]">{{$t("help")}}</a>"
              {{$t("contactUs")}}。
            </p>
          </div>
        </div>
        <section>
          <header class="text-center mb-[66px]">
            <h2 class="text-4xl font-medium mb-[-16px]">{{ $t('Ios') }} {{ $t("tutor") }}</h2>
            <div class="flex items-center justify-center">
              <div class="w-[448px] h-px bg-[#1e41ea]"/>
              <div class="w-[232px]"/>
              <div class="w-[448px] h-px bg-[#1e41ea]"/>
            </div>
          </header>
          <div class="mb-[62px]">
            <h3
              class="bg-[#191a1a] text-base text-center w-[92px] py-1.5 rounded-[18px] mx-auto mb-6"
            >
              {{ $t("step1") }}
            </h3>
            <p class="text-sm text-center text-14px">
              {{ $t('step1Tip1') }}
            </p>
          </div>
          <div class="mb-[20px]">
            <h3
              class="bg-[#191a1a] text-base text-center w-[92px] py-1.5 rounded-[18px] mx-auto mb-6"
            >
              {{ $t("setp2") }}
            </h3>
            <p class="text-sm text-center mb-[32px]">{{ $t('step2Tip1') }}</p>
            <div class="flex justify-center gap-[53px]">
              <div class="w-[327px]">
                <p class="text-sm mb-7">
                  1. {{ $t("step2Title") }}
                  <img
                    src="@/assets/images/help/image.png"
                    alt="App Store icon"
                    class="inline-block w-4 h-4 mx-1"
                  >
                  {{$t("step2Tip2")}}。
                </p>
                <img
                  src="@/assets/images/help/image-1.png"
                  alt="App Store logout"
                  class="w-[300px] h-[167px] mb-6"
                >
                <img
                  src="@/assets/images/help/image-2.png"
                  alt="App Store logout confirmation"
                  class="w-[300px] h-[160px]"
                >
              </div>
              <div class="w-[327px]">
                <p class="text-sm mb-4">2. {{ $t('step2Tip3') }}</p>
                <img
                  src="@/assets/images/help/image-3.png"
                  alt="App Store login"
                  class="w-[300px] h-[267px] mb-7"
                >
                <p class="text-sm">
                  {{ $t('step2Tip4') }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-20 mb-30">
            <h3
              class="bg-[#191a1a] text-base text-center w-[92px] py-1.5 rounded-[18px] mx-auto mb-6"
            >
              {{ $t('step3') }}
            </h3>
            <p class="text-sm text-center mb-[22px]">{{ $t('step3Title') }}</p>
            <div class="flex justify-center gap-[53px]">
              <div class="w-[327px]">
                <p class="text-sm mb-[47px]">
                  1. {{ $t('step3Tip1') }}
                </p>
                <img
                  src="@/assets/images/help/div-ios-box-three-itembox-left-img.svg"
                  alt="App Store Ave search"
                  class="w-[300px] h-[167px]"
                >
              </div>
              <div class="w-[327px]">
                <p class="text-sm mb-[31px]">2. {{ $t('step3Tip2') }}</p>
                <img
                  src="@/assets/images/help/div-ios-box-three-itembox-right-img.svg"
                  alt="Ave App icon"
                  class="w-[300px] h-[167px]"
                >
              </div>
            </div>
          </div>
        </section>
      </section>
      <Footer/>
    </main>
  </div>
</template>

<script setup>
  import Footer from './components/footer'
  // import WOW from 'wowjs'
  // import 'animate.css'
  // onMounted(() => {
  //   new WOW.default().init()
  // })
</script>

<style scoped lang="scss">
</style>
