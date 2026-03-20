/**
 * 加解密工具 — 单独文件，避免 crypto-js 污染 utils/index.ts 主包
 * 仅在需要时引入此文件
 */
import CryptoJS from 'crypto-js'

export function decryptMsg(cipherBase64: string, guid: string): string {
  // 1. 生成 key (SHA256(guid))
  const key = CryptoJS.SHA256(guid)
  // 2. IV = key 前 16 字节
  const iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4)) // 4*4字节 = 16字节
  // 3. Base64 解码密文
  const cipherParams = CryptoJS.enc.Base64.parse(cipherBase64)
  // 4. AES-CBC 解密
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherParams } as any, key, {
    mode: CryptoJS.mode.CBC,
    iv,
    padding: CryptoJS.pad.Pkcs7,
  })

  // 5. 得到 Base64 编码的明文
  const base64Str = decrypted.toString(CryptoJS.enc.Utf8)

  // 6. Base64 解码 → 原始明文
  return CryptoJS.enc.Base64.parse(base64Str).toString(CryptoJS.enc.Utf8)
}
