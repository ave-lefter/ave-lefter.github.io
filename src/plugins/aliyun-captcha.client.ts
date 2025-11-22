export default defineNuxtPlugin(() => {
  window.AliyunCaptchaConfig = {
    // 必填，验证码示例所属地区，支持中国内地（cn）、新加坡（sgp）
    region: 'sgp',
    // 必填，身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
    prefix: '8t45yce',
  }
  new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js'
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  }).then(() => {
    window.dispatchEvent(new Event('aliyunCaptcha:ready'))
  })
})
