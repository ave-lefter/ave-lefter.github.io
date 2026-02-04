
export function useAliyunCaptcha(config: {
  element?: string
  button?: string
  slideStyle?: {
    width: number
    height: number
  }
  success?: (captchaVerifyParams: any) => void
  fail?: (error: any) => void
}) {
  const SceneId = '1o3krw5z8'

  const { element, button, slideStyle, success, fail } = config
  const captcha = ref(null)

  function getInstance(instance: any) {
    captcha.value = instance
  }
  function getLanguage() {
    const lang = localStorage.language || 'en'
    return lang.replace('zh-', '')
  }

  function _success(captchaVerifyParams: any) {
    console.log('success', captchaVerifyParams)
  }

  function _fail(error: any) {
    console.log('fail', error)
    initCaptcha()
  }

// aliyunCaptcha:read
  async function getInitAliyunCaptcha(): Promise<typeof window.initAliyunCaptcha> {
    if (window.initAliyunCaptcha) {
      return window.initAliyunCaptcha
    }
    return new Promise((resolve) => {
      const handler = () => {
        window.removeEventListener('aliyunCaptcha:ready', handler)
        resolve(window.initAliyunCaptcha)
      }
      window.addEventListener('aliyunCaptcha:ready', handler)
    })
  }

  async function initCaptcha() {
    let _initAliyunCaptcha = await getInitAliyunCaptcha()
    _initAliyunCaptcha?.({
      SceneId: SceneId, // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
      mode: 'popup', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
      element: element || '#captcha-element', // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
      button: button || '#captcha-button', // 触发验证码弹窗的元素。
      success: success || _success,
      fail: fail || _fail,
      getInstance: getInstance, // 绑定验证码实例函数，无需修改
      slideStyle: slideStyle || {
        width: 360,
        height: 40,
      }, // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
      language: getLanguage() || 'cn', // 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en）
    })
  }

  return {
    SceneId,
    initCaptcha,
    captcha
  }
}
