import { expose } from 'comlink'

type WSPumpObj = any

type PumpObj = any

function transformPumpItem(i: WSPumpObj): PumpObj {
  // 使用 Object.assign 浅拷贝，性能优于 JSON
  const plainI = Object.assign({}, i)
  const plainPair = i.pair ? Object.assign({}, i.pair) : {}

  const target_token = plainPair?.target_token || ''
  const chain = plainI.chain || ''
  const token0_address = plainPair?.token0_address || ''
  const token1_address = plainPair?.token1_address || ''

  return {
    ...plainI,
    ...plainPair,
    id: `${target_token}-${chain}`,
    pair_id: `${plainPair?.pair || ''}-${chain}`,
    token: target_token,
    progress: 0,
    symbol:
      target_token === token0_address
        ? plainPair?.token0_symbol
        : plainPair?.token1_symbol,
    name:
      target_token === token0_address
        ? plainPair?.token0_name
        : plainPair?.token1_name,
    logo_url:
      target_token === token0_address
        ? plainPair?.token0_logo_url
        : plainPair?.token1_logo_url,
  }
}

const workerApi = {
  mapWsList(wsList: WSPumpObj[]): PumpObj[] {
    if (!Array.isArray(wsList)) return []
    // transformPumpItem 已经处理了数据，直接返回即可
    return wsList.map(transformPumpItem)
  }
}

expose(workerApi)

