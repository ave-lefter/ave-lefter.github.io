import type { ChartingLibraryWidgetConstructor } from './tradingview/charting_library'
export {}

declare global {
  interface Window {
    vemachine?: {
      generateToken?: (arg?: boolean) => Promise<string>
    }
    TradingView: {
      widget: ChartingLibraryWidgetConstructor
    }
    AliyunCaptchaConfig?: {
      region: string
      prefix: string
    }
    initAliyunCaptcha?: (config: {
      SceneId: string
      mode: string
      element: string
      button: string
      success: (captchaVerifyParams: any) => void
      fail: (error: any) => void
      getInstance: (instance: any) => void
      slideStyle?: {
        width: number
        height: number
      }
      language?: string // 'cn' | 'tw' | 'en'
      timeout?: number // 5000
      rem?: number // 1 对验证码UI进行整体缩放。请传入正数，如0.5是缩小一倍，2是放大一倍。
      onError?: () => void // 验证码初始化接口请求和验证码资源加载失败、超时的错误回调函数。
      onClose?: () => void // 验证码弹窗关闭时触发的回调函数。
      captchaLogoImg?: string // 一点即过、拼图验证或图像复原嵌入式触发按钮右侧的企业Logo更换参数，为图片URL链接或者base64格式数据。
      dualStack?: boolean // 是初始化请求域名、验证请求域名是否开启支持双栈，取值： false：只支持IPv4。 true：同时支持IPv4和IPv6。
      UserCertifyId?: string // 客户自定义生成的certifyId。非必传，用于客户期望通过验证码透传参数关联业务流程场景，在服务端验签接口返回该参数，支持客户进行校验。参数格式标准：身份标（prefix）_10位随机字符串（包含大小写字母和数字）。示例值：1q5***_7G47iByes3

    }) => void
  }
}
