// 获取分佣信息
// /referral/getReferralInfo
export async function getReferralInfo() {
    const { $api } = useNuxtApp()
    return $api('/botapi/referral/getReferralInfo',{
      method: 'get'
    })
}
  
  // 获取邀请码
  // /referral/getRefCode
  export async function getRefCode() {
    const { $api } = useNuxtApp()
    return $api( '/botapi/referral/getRefCode',{
      method: 'get'
    })
  }

  // 获取被邀请人列表
export async function getInviteeList(data = {pageNo: 0, pageSize: 50}){
    //   return {
    //     userItems:[
    //         {
    //             'level': 1, //等级
    //             'guid': '6074341763',
    //             'bindRefTime': 1729910374, // 绑定时间
    //             'username': 'zh**tg' // 用户名
    //         },
    //         {
    //             'level': 2,
    //             'guid': '6876082173',
    //             'bindRefTime': 1729846475,
    //             'username': 'jg**ds'
    //         },
    //         {
    //             'level': 1,
    //             'guid': '6097411603',
    //             'bindRefTime': 1729846475,
    //             'username': 'Jo**av'
    //         },
    //         {
    //             'level': 1,
    //             'guid': '6006728920',
    //             'bindRefTime': 1729846475,
    //             'username': 'Tina***bers'
    //         }
    //     ],
    //     totalUserCount:4
    //   }
    const { $api } = useNuxtApp()
      return $api('/botapi/referral/getInviteeListWithPageInfo',{
        method: 'get',
        query: data
      })
    }

    // 一键领取分佣
// 错误
// No more than one claims is allowed per day, please try again the next day  每天最多提现1次, 请次日再试
// There are already orders being withdrawn 已有提现中的订单
// No items found for withdrawal 未找到可提现的项目
// withdraw wallet insufficient funds, please contact the administrator 提现钱包余额不足, 请联系管理员
// amount less than or equal to transaction fee 金额小于或等于交易费
export function createWithdrawIncomeOrder() {
    const { $api } = useNuxtApp()
    return $api('/botapi/referral/createWithdrawIncomeOrder',{
      method: 'post'
    })
  }

  // 获取分佣领取记录列表
//  /referral/getWithdrawRecordList

export async function getWithdrawRecordList() {
    // return [
    //   {
    //       'batchId': '129701', // 批ID
    //       'createTime': '2024-11-15T06:40:41.922973Z', // 时间
    //       'status': 'finished', // 状态 inprogress 进行中  finished 已完成
    //       'list': [
    //           {
    //               'id': 139,
    //               'createTime': '2024-11-15T06:40:41.922973Z',
    //               'status': 'error',  // generated 提取中 error 失败 confirmed 已完成 pending 审核中 approved 审核通过,提取中 rejected 审核失败 timeout_error 超时
    //               'guid': '5592975131',
    //               'batchId': '129701',
    //               'chain': 'eth',
    //               'withdrawAddress': '0xebe63567a6aba2e1b05e1872f71beaa329ebaf47',
    //               'tokenAddress': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    //               'tokenSymbol': 'ETH',
    //               'tokenDecimals': 18,
    //               'tokenLogoUrl': 'token_icon/eth/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
    //               'withdrawValue': '34351451407878', // 提现数量 单位lamports
    //               'txHash': '',  // 交易hash
    //               'errorLog': 'amount less than or equal to transaction fee'  // 错误原因
    //           },
    //           {
    //               'id': 138,
    //               'createTime': '2024-11-15T06:40:41.922973Z',
    //               'status': 'error',
    //               'guid': '5592975131',
    //               'batchId': '129701',
    //               'chain': 'solana',
    //               'withdrawAddress': '8UJG8bGKWzLaUjFhkbqA66nuhsq2H1Wwy2p3EkWtAnj8',
    //               'tokenAddress': 'sol',
    //               'tokenSymbol': 'SOL',
    //               'tokenDecimals': 9,
    //               'tokenLogoUrl': 'token_icon/solana/So11111111111111111111111111111111111111112.png',
    //               'withdrawValue': '650156',
    //               'txHash': '',
    //               'errorLog': 'amount less than or equal to transaction fee'
    //           }
    //       ]
    //   },
    //   {
    //     'batchId': '129701', // 批ID
    //     'createTime': '2024-11-15T06:40:41.922973Z', // 时间
    //     'status': 'finished', // 状态 inprogress 进行中  finished 已完成
    //     'list': [
    //         {
    //             'id': 139,
    //             'createTime': '2024-11-15T06:40:41.922973Z',
    //             'status': 'error',  // generated 提取中 error 失败 confirmed 已完成 pending 审核中 approved 审核通过,提取中 rejected 审核失败 timeout_error 超时
    //             'guid': '5592975131',
    //             'batchId': '129701',
    //             'chain': 'eth',
    //             'withdrawAddress': '0xebe63567a6aba2e1b05e1872f71beaa329ebaf47',
    //             'tokenAddress': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    //             'tokenSymbol': 'ETH',
    //             'tokenDecimals': 18,
    //             'tokenLogoUrl': 'token_icon/eth/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
    //             'withdrawValue': '34351451407878', // 提现数量 单位lamports
    //             'txHash': '',  // 交易hash
    //             'errorLog': 'amount less than or equal to transaction fee'  // 错误原因
    //         },
    //         {
    //             'id': 138,
    //             'createTime': '2024-11-15T06:40:41.922973Z',
    //             'status': 'error',
    //             'guid': '5592975131',
    //             'batchId': '129701',
    //             'chain': 'solana',
    //             'withdrawAddress': '8UJG8bGKWzLaUjFhkbqA66nuhsq2H1Wwy2p3EkWtAnj8',
    //             'tokenAddress': 'sol',
    //             'tokenSymbol': 'SOL',
    //             'tokenDecimals': 9,
    //             'tokenLogoUrl': 'token_icon/solana/So11111111111111111111111111111111111111112.png',
    //             'withdrawValue': '650156',
    //             'txHash': '',
    //             'errorLog': 'amount less than or equal to transaction fee'
    //         }
    //     ]
    // }
    //     ]
    const { $api } = useNuxtApp()
    return $api('/botapi/referral/getWithdrawRecordList',{
      method: 'get'
    })
  }