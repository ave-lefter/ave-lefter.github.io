import type { JsonFragment } from 'ethers'
import { type TronWeb, utils } from 'tronweb'

let time = 0
const interval = 200

export function TronContract(abi1: string[], address: string) {
  const walletStore = useWalletStore()
  const tronWeb = walletStore.provider ? getWalletTronWeb() : null
  const abi = abiToJson(abi1)


  const contract: {
    address: string
    abi: typeof abi
    [key: string]: any
  } = {
    address,
    abi
  }

  abi.forEach(i => {
    if (i.type === 'function' && i.name) {
      let fn: any = null

      fn = async (...params: any[]) => {
        if (i.stateMutability === 'view' || i.stateMutability === 'pure') {
          return await fn.__staticCall(...params)
        } else {
          const { functionSelector, parameter, options } = encodeTronFunctionParams(i, params)
          return tronWeb?.transactionBuilder.triggerSmartContract(address, functionSelector, options, parameter as any)
            .then(transaction => tronWeb.trx.sign(transaction.transaction))
            .then(signedTx => tronWeb.trx.sendRawTransaction(signedTx))
            .then(async receipt => {
              if (receipt?.result && receipt?.transaction?.txID) {
                return {
                  transaction: receipt.transaction.txID,
                  hash: receipt.transaction.txID,
                  wait: () => confirmTronTx(receipt.transaction.txID)
                }
              } else {
                throw new Error((receipt?.code || receipt).toString())
              }
            })
        }
      }

      fn.__staticCall = async (...params: any[]) => {
        if (!time || (Date.now() - time) > interval) {
          time = Date.now()
        } else {
          time = Math.max(time, Date.now()) + interval
          const delay = time > Date.now() ? time - Date.now() + interval : interval
          await sleep(delay)
        }

        const { functionSelector, parameter, options } = encodeTronFunctionParams(i, params)
        console.log(address, 'functionSelector', functionSelector, 'parameter', parameter, 'options', options)
        return tronWeb?.transactionBuilder.triggerConstantContract(address, functionSelector, options, parameter as any)
          .then(async transaction => {
            const len = transaction.constant_result?.[0]?.length ?? 0
            if (len === 0 || len % 64 === 8) {
              let msg = 'The call has been reverted or has thrown an error.'
              if (len !== 0) {
                let msg2 = ''
                const chunk = transaction.constant_result[0].substring(8)
                for (let i = 0; i < len - 8; i += 64) {
                  msg2 += tronWeb.toUtf8(chunk.substring(i, i + 64))
                }
                msg += msg2.replace(/[\u0000\u000b\f]+/g, ' ').replace(/ +/g, ' ').replace(/\s+$/g, '')
              }
              return msg
            }
            let output = tronWeb.utils.abi.decodeParamsV2ByABI(i, '0x' + transaction.constant_result[0])
            if (output.length === 1 && Object.keys(output).length <= 2) {
              output = output[0]
            }
            return output
          })
      }

      fn.staticCall = fn.__staticCall
      contract[i.name] = fn
    }
  })

  return contract
}

// 你已有的辅助函数保持不变
type GetTransactionResponse = Awaited<ReturnType<TronWeb['trx']['getTransaction']>>

export async function confirmTronTx(hash: string): Promise<GetTransactionResponse & { transactionHash: string } | null> {
  const tronWeb = getWalletTronWeb()
  if (!tronWeb) return null
  await sleep(2000)
  return tronWeb.trx.getTransaction(hash).then(async (tx) => {
    const status = tx?.ret?.[0]?.contractRet
    if (status) {
      if (status === 'SUCCESS') {
        return { ...tx, status: 1, transactionHash: hash }
      } else {
        return Promise.reject(status)
      }
    } else {
      await sleep(5000)
      return confirmTronTx(hash)
    }
  }).catch((err: string) => {
    console.log(err)
    if (err === 'OUT_OF_ENERGY') {
      return Promise.reject(err)
    } else {
      return confirmTronTx(hash)
    }
  })
}

function getTronFunctionSelector(abi: { name?: string; type: string; components?: any[] }, addName = false): string {
  const pre = addName ? 'tuple' : ''

  if (abi.type === 'tuple[]') {
    if (abi.components) {
      return pre + '(' + abi.components.map(i => {
        const name = addName ? (' ' + i.name) : ''
        if (i.type.startsWith('tuple')) {
          return getTronFunctionSelector(i, addName) + name
        } else {
          return i.type + name
        }
      }).join(',') + ')[]'
    }
  }

  if (abi.type === 'tuple') {
    if (abi.components) {
      return pre + '(' + abi.components.map(i => {
        const name = addName ? (' ' + i.name) : ''
        if (i.type.startsWith('tuple')) {
          return getTronFunctionSelector(i, addName) + name
        } else {
          return i.type + name
        }
      }).join(',') + ')'
    }
  }

  const name = addName && abi.name ? (' ' + abi.name) : ''
  return abi.type + name
}


function encodeTronFunctionParams(i: JsonFragment, params: any) {
  let functionSelector = `${i.name}(`

  const parameter: { type: string; value: any }[] = []

  i.inputs?.forEach((j, k) => {
    let v = params[k]

    if (j?.type?.startsWith('tuple')) {
      const sig = getTronFunctionSelector(j as any)
      const sigWithNames = getTronFunctionSelector(j as any, true)
      functionSelector += sig

      // 🧠 补全嵌套 tuple 中的 address 字段
      const fixAddressInTuple = (tuple: any, components: any[]) => {
        components.forEach(comp => {
          if (comp.type === 'address') {
            const val = tuple[comp.name]
            if (!val || typeof val !== 'string') {
              tuple[comp.name] = '0x0000000000000000000000000000000000000000'
            } else if (!/^0x[a-fA-F0-9]{40}$/.test(val)) {
              tuple[comp.name] = '0x' + utils.address.toHex(val).slice(2).padStart(40, '0')
            }
          } else if (comp.type.startsWith('tuple') && comp.components) {
            fixAddressInTuple(tuple[comp.name], comp.components)
          }
        })
      }

      if (Array.isArray(v)) {
        v.forEach(item => fixAddressInTuple(item, j?.components as any[]))
      } else {
        fixAddressInTuple(v, j.components as any[])
      }

      parameter.push({ type: sigWithNames, value: v })
    } else {
      functionSelector += j.type

      if (j.type === 'address') {
        if (!v || typeof v !== 'string' || v === '0x') {
          v = '0x0000000000000000000000000000000000000000'
        } else if (!/^0x[a-fA-F0-9]{40}$/.test(v)) {
          v = '0x' + utils.address.toHex(v).slice(2).padStart(40, '0')
        }
      }

      parameter.push({ type: j.type as string, value: v })
    }

    if (k < ((i?.inputs?.length || 0) - 1)) {
      functionSelector += ','
    }
  })

  functionSelector += ')'

  const optionsParam = params?.[i.inputs?.length || 0] || {}
  const options = {
    callValue: 0,
    feeLimit: 1000000000
  }

  if (optionsParam?.value) {
    options.callValue = Number(optionsParam.value)
  }

  return { functionSelector, parameter, options }
}

