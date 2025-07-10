import {UAParser} from 'ua-parser-js'
import Cookies from 'js-cookie'
import { createCacheRequest } from '@/utils/cacheRequest'
// record_id（有tx_hash就用tx_hash，否则用order_id）
// chain（record_id + chain 做主键）
// create_time（服务器时间）
// platform
// destination
// type（10: 市价，20: 挂单）
// tx_hash
// order_id （aveswap_，jupiter_）
// status（1: sended，100:success，-100:failed）
// wallet
// out_token
// out_amount
// in_token
// in_amount
// update_time（服务器时间）
// remark

// 接口：1. recordTransaction(all args above)2. updateTransaction(chain, tx_hash, status)这两个接口可以测了在测试环境
// /v2/aveswap/updatetx
// /v2/aveswap/recordtx
export function recordTransaction(data: any) {
  const ua = window.navigator.userAgent
  let platform = 'pc'
  if (ua.includes('Android') && /Ave.ai/i.test(ua)) {
    platform = 'android'
  } else if (ua.includes('iPhone') && /Ave.ai/i.test(ua)) {
    platform = 'ios'
  }
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/aveswap/recordtx', {
    method: 'post',
    body: {
      platform,
      record_id: data.tx_hash || data.order_id,
      ...data,
      in_amount: Number(data.in_amount),
      out_amount: Number(data.out_amount),
    }
  }).catch(err => {
    console.log(err)
  })
}


export function updateTransaction(data: any) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/aveswap/updatetx', {
    method: 'post',
    body: { ...data }
  }).catch(err => {
    console.log(err)
  })
}

// 推广埋点
// 推广追踪系统接口
// POST   https://0ftrfsdb.xyz/v2api/trace/v1/log
// 请求参数：
// {
//     "trace_items": [
//         {
//             "category": "register",
//             "utm_source": "test_0619",
//             "eid": "test_2025_0619",
//             "pid": "test_2025_0619",
//             "code": "test_2025_0619",
//             "device_id": "test_2025_0619",
//             "device": "iPhone15.4",
//             "platform": "ios",
//             "browser": "chrome",
//             "extra": "",
//             "event_time": 1750319280
//         }
//     ]
// }

function getDeviceId() {
  return FingerprintJs.load().then((fp) => fp.get()).then(async data => data.visitorId)
}

async function getDeviceInfo() {
  // if (localStorage.getItem('device_info')) {
  //   return Promise.resolve(JSON.parse(localStorage.getItem('device_info')))
  // }
  const parser = new UAParser()
  const result = parser.getResult()
  const deviceId = await getDeviceId()
  const deviceInfo = {
    device_id: deviceId,
    device: result.device.model || result.os.name || '',
    platform: result.os.name  || '',
    browser: result.browser.name || '',
  }

  localStorage.setItem('device_info', JSON.stringify(deviceInfo))
  return deviceInfo
}


export const trackRef = createCacheRequest(async function trackRef(data) {
  let device = await getDeviceInfo()
  const refInfo = JSON.parse(Cookies.get('refInfo') || 'null')
  // console.log('refInfo', refInfo)
  if (refInfo) {
    // delete refInfo.id
    device = {
      ...refInfo,
      ...device,
    }
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/trace/v1/log', {
    method: 'post',
    body: { trace_items: [{
      event_time: Math.floor(Date.now() / 1000),
      extra: '',
      ...device,
      ...data
    }]}
  })
}, 3000)

