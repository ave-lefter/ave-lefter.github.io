import { perpApi as api } from './request'
import { type Metadata } from '@edgex-fe/typescript-sdk'

import localforage from 'localforage'

// 获取metadata
export async function getPerpMetadata(): Promise<Metadata> {
  const cached: { data: any, timestamp: number } = (await localforage.getItem('perpMetadata')) ||  { data: null, timestamp: 0 }
  if (cached?.data && cached.timestamp > Date.now() - 10 * 60 * 1000) {
    return cached.data
  }
  return api('/api/v1/public/meta/getMetaData').then((res) => {
    localforage.setItem('perpMetadata', {
      data: res,
      timestamp: Date.now(),
    })
    return res as any
  })
}
