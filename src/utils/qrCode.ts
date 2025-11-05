import { ref } from 'vue'
import QRCode from 'qrcode'

export function useQRCode() {
  const qrcodeUrl = ref<string>('')

  async function generateQRCodeWithLogo(text: string, logoSrc: string, size = 300) {
    const canvas = document.createElement('canvas')

    try {
      // 生成二维码到 canvas
      await QRCode.toCanvas(canvas, text, { margin: 1, width: size })
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // 加载 logo
      const logo = new Image()
      logo.src = logoSrc
      logo.crossOrigin = 'anonymous' // 避免跨域问题
      logo.onload = () => {
        const logoSize = size / 4 // logo 占二维码大小的 1/4
        const x = (canvas.width - logoSize) / 2
        const y = (canvas.height - logoSize) / 2

        // 背景留白
        ctx.fillStyle = 'white'
        ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)

        // 绘制 logo
        ctx.drawImage(logo, x, y, logoSize, logoSize)

        // 输出为 base64
        qrcodeUrl.value = canvas.toDataURL('image/png')
      }
    } catch (err) {
      console.error('生成二维码失败:', err)
    }
  }

  return { qrcodeUrl, generateQRCodeWithLogo }
}
