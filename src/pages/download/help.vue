<template>
  <main class="relative w-full max-w-[1920px] mx-auto">
    <section class="max-w-[1200px] mx-auto pt-[120px]">
      <header class="text-center mb-[80px]">
        <h1 class="text-4xl font-medium mb-[-16px]">Android 系统安装教程</h1>
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
            请点击 "<span class="text-[#1e41ea]">Android</span>"
            安装包，下载完成后按照系统引导安装即可。
          </p>
        </div>
        <div class="w-[360px] bg-[#191a1a] rounded-xl p-6">
          <h2 class="text-3xl font-black text-[#1e41ea] mb-4">2.</h2>
          <p class="text-base">
            当您在安装或使用过程中遇到任何问题，请点击 "<span class="text-[#1e41ea]">帮助</span>"
            联系客服。
          </p>
        </div>
      </div>
      <section>
        <header class="text-center mb-[66px]">
          <h2 class="text-4xl font-medium mb-[-16px]">IOS 安装教程</h2>
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
            第一步
          </h3>
          <p class="text-sm text-center">
            Ave目前上架美国、澳大利亚以及香港地区AppStore，下载Ave app需要对应地区的Apple ID
          </p>
        </div>
        <div class="mb-[20px]">
          <h3
            class="bg-[#191a1a] text-base text-center w-[92px] py-1.5 rounded-[18px] mx-auto mb-6"
          >
            第二步
          </h3>
          <p class="text-sm text-center mb-[32px]">在 App Store 切换 Apple ID。</p>
          <div class="flex justify-center gap-[53px]">
            <div class="w-[327px]">
              <p class="text-sm mb-7">
                1. 打开
                <img
                  src="@/assets/images/help/image.png"
                  alt="App Store icon"
                  class="inline-block w-4 h-4 mx-1"
                >
                App Store 应用，点击右上角的头像，退出登录。
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
              <p class="text-sm mb-4">2. 使用已上架地区的 Apple ID 登录。</p>
              <img
                src="@/assets/images/help/image-3.png"
                alt="App Store login"
                class="w-[300px] h-[267px] mb-7"
              >
              <p class="text-sm">
                如果提示"无法登录"，可能是您近期切换账号过于频繁。您可以更换 ID
                或者几小时后重试。如果 ID 被锁定，则需要进行验证或更换 ID 后再试。
              </p>
            </div>
          </div>
        </div>
        <div class="mt-20 mb-30">
          <h3
            class="bg-[#191a1a] text-base text-center w-[92px] py-1.5 rounded-[18px] mx-auto mb-6"
          >
            第三步
          </h3>
          <p class="text-sm text-center mb-[22px]">安装 App</p>
          <div class="flex justify-center gap-[53px]">
            <div class="w-[327px]">
              <p class="text-sm mb-[47px]">
                1. 登录成功后，会自动跳转至 ID 对应地区的 App Store。在 App Store
                中搜索"Ave"，点击"GET"即可开始安装。
              </p>
              <img
                src="@/assets/images/help/div-ios-box-three-itembox-left-img.svg"
                alt="App Store Ave search"
                class="w-[300px] h-[167px]"
              >
            </div>
            <div class="w-[327px]">
              <p class="text-sm mb-[31px]">2. 回到主页，打开 Ave App。</p>
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
