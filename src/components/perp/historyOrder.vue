<script setup lang="ts">
import dayjs from 'dayjs'
import { getActiveOrderPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const {t} = useI18n()
const props = defineProps<{
    searchParams:any
}>()
const listData = shallowRef([
  {
    'id': '684132298106340308',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'side': 'BUY',
    'price': '10.0',
    'size': '0.002',
    'clientOrderId': '9077223744180376',
    'type': 'LIMIT',
    'timeInForce': 'GOOD_TIL_CANCEL',
    'reduceOnly': false,
    'triggerPrice': '0',
    'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
    'expireTime': '1764924249710',
    'sourceKey': '',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'openTpslParentOrderId': '0',
    'isSetOpenTp': true,
    'openTp': {
      'side': 'SELL',
      'price': '0.0',
      'size': '0.002',
      'clientOrderId': '3748619042667797',
      'triggerPrice': '99999.0',
      'triggerPriceType': 'LAST_PRICE',
      'expireTime': '1764924249771',
      'l2Nonce': '15654054',
      'l2Value': '0.000200',
      'l2Size': '0.002',
      'l2LimitFee': '1.000000',
      'l2ExpireTime': '1765701849771',
      'l2Signature': {
        'r': '0x020ece39d627940800ec7feb86e2f20b961784077108311ea9a6d4e3db552925',
        's': '0x027684ff65c432e4bdd53e6bd09d2e549e820344403029f75df2d80e05048237',
        'v': ''
      }
    },
    'isSetOpenSl': true,
    'openSl': {
      'side': 'SELL',
      'price': '0.0',
      'size': '0.002',
      'clientOrderId': '5381337694524634',
      'triggerPrice': '5.0',
      'triggerPriceType': 'LAST_PRICE',
      'expireTime': '1764924249849',
      'l2Nonce': '2330466470',
      'l2Value': '0.000200',
      'l2Size': '0.002',
      'l2LimitFee': '1.000000',
      'l2ExpireTime': '1765701849849',
      'l2Signature': {
        'r': '0x059c5085f4462e0bc497917210ce8a4ce087debc982b006fc23014d914ac4aba',
        's': '0x07223917d60e909d6ea27fb0d5f2c461781d539fa9192f491fcc1806c4aa758e',
        'v': ''
      }
    },
    'isWithoutMatch': false,
    'withoutMatchFillSize': '0',
    'withoutMatchFillValue': '0',
    'withoutMatchPeerAccountId': '0',
    'withoutMatchPeerOrderId': '0',
    'maxLeverage': '10',
    'takerFeeRate': '0.00038',
    'makerFeeRate': '0.00012',
    'liquidateFeeRate': '0.01',
    'marketLimitPrice': '0',
    'marketLimitValue': '0',
    'l2Nonce': '2358176333',
    'l2Value': '0.020000',
    'l2Size': '0.002',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765701849710',
    'l2Signature': {
      'r': '0x02f1409e552cc2876ace8284b12b9e01096a6199189881ac5a0665c31baa1cdf',
      's': '0x02f64675fb35eab6628cc0f3ade9d4a2cbf71cdcf2ea6606962a1fb6261eb7e4',
      'v': ''
    },
    'extraType': '',
    'extraDataJson': '{"requestId":"1762741223090.SZOhWT","moid":"6k10jwJ41dOlyZqmcxUc"}',
    'status': 'CANCELED',
    'matchSequenceId': '1416920755',
    'triggerTime': '0',
    'triggerPriceTime': '0',
    'triggerPriceValue': '0',
    'cancelReason': 'USER_CANCELED',
    'cumFillSize': '0',
    'cumFillValue': '0',
    'cumFillFee': '0',
    'maxFillPrice': '0',
    'minFillPrice': '0',
    'cumLiquidateFee': '0',
    'cumRealizePnl': '0',
    'cumMatchSize': '0',
    'cumMatchValue': '0',
    'cumMatchFee': '0',
    'cumFailSize': '0',
    'cumFailValue': '0',
    'cumFailFee': '0',
    'cumApprovedSize': '0',
    'cumApprovedValue': '0',
    'cumApprovedFee': '0',
    'createdTime': '1763109850432',
    'updatedTime': '1763167046569'
  },
  {
    'id': '684129405219374036',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'side': 'BUY',
    'price': '1000.0',
    'size': '0.002',
    'clientOrderId': '33449501049498354',
    'type': 'LIMIT',
    'timeInForce': 'GOOD_TIL_CANCEL',
    'reduceOnly': false,
    'triggerPrice': '0',
    'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
    'expireTime': '1764923559747',
    'sourceKey': '',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'openTpslParentOrderId': '0',
    'isSetOpenTp': false,
    'openTp': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isSetOpenSl': false,
    'openSl': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isWithoutMatch': false,
    'withoutMatchFillSize': '0',
    'withoutMatchFillValue': '0',
    'withoutMatchPeerAccountId': '0',
    'withoutMatchPeerOrderId': '0',
    'maxLeverage': '10',
    'takerFeeRate': '0.00038',
    'makerFeeRate': '0.00012',
    'liquidateFeeRate': '0.01',
    'marketLimitPrice': '0',
    'marketLimitValue': '0',
    'l2Nonce': '2581071005',
    'l2Value': '2.000000',
    'l2Size': '0.002',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765701159747',
    'l2Signature': {
      'r': '0x0136b07c731682f4ebd59a6b60f5e80886015acd9ea0684096fbfd5308284d35',
      's': '0x03b0e5f0d2c2af5dd500c6f61f99c83771103e2d056e597614a4d7cd6bd80982',
      'v': ''
    },
    'extraType': '',
    'extraDataJson': '{"requestId":"1762741223090.SZOhWT","moid":"6k10jwJ41dOlyZqmcxUc"}',
    'status': 'CANCELED',
    'matchSequenceId': '1409056892',
    'triggerTime': '0',
    'triggerPriceTime': '0',
    'triggerPriceValue': '0',
    'cancelReason': 'USER_CANCELED',
    'cumFillSize': '0',
    'cumFillValue': '0',
    'cumFillFee': '0',
    'maxFillPrice': '0',
    'minFillPrice': '0',
    'cumLiquidateFee': '0',
    'cumRealizePnl': '0',
    'cumMatchSize': '0',
    'cumMatchValue': '0',
    'cumMatchFee': '0',
    'cumFailSize': '0',
    'cumFailValue': '0',
    'cumFailFee': '0',
    'cumApprovedSize': '0',
    'cumApprovedValue': '0',
    'cumApprovedFee': '0',
    'createdTime': '1763109160714',
    'updatedTime': '1763109776711'
  },
  {
    'id': '683841759515509716',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'side': 'SELL',
    'price': '0.0',
    'size': '0.001',
    'clientOrderId': '4818403145447534',
    'type': 'MARKET',
    'timeInForce': 'IMMEDIATE_OR_CANCEL',
    'reduceOnly': true,
    'triggerPrice': '0',
    'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
    'expireTime': '1764854977706',
    'sourceKey': '',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'openTpslParentOrderId': '0',
    'isSetOpenTp': false,
    'openTp': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isSetOpenSl': false,
    'openSl': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isWithoutMatch': false,
    'withoutMatchFillSize': '0',
    'withoutMatchFillValue': '0',
    'withoutMatchPeerAccountId': '0',
    'withoutMatchPeerOrderId': '0',
    'maxLeverage': '10',
    'takerFeeRate': '0.00038',
    'makerFeeRate': '0.00012',
    'liquidateFeeRate': '0.01',
    'marketLimitPrice': '0',
    'marketLimitValue': '102.481900',
    'l2Nonce': '2228663819',
    'l2Value': '0.000100',
    'l2Size': '0.001',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765632577706',
    'l2Signature': {
      'r': '0x079f42567a969a16068f066203aa3beee5f3cbc6722b4069a4eb36802257caae',
      's': '0x03030444545fc2ec30672d015fed70408f0ddd38138db7986188f013dd43df01',
      'v': ''
    },
    'extraType': '',
    'extraDataJson': '{"requestId":"1762741223090.SZOhWT","moid":"6k10jwJ41dOlyZqmcxUc"}',
    'status': 'FILLED',
    'matchSequenceId': '1399469195',
    'triggerTime': '0',
    'triggerPriceTime': '0',
    'triggerPriceValue': '0',
    'cancelReason': 'UNKNOWN_ORDER_CANCEL_REASON',
    'cumFillSize': '0.001',
    'cumFillValue': '102.4819',
    'cumFillFee': '0.038943',
    'maxFillPrice': '102481.9',
    'minFillPrice': '102481.9',
    'cumLiquidateFee': '0',
    'cumRealizePnl': '0.351057',
    'cumMatchSize': '0.001',
    'cumMatchValue': '102.4819',
    'cumMatchFee': '0.038943',
    'cumFailSize': '0',
    'cumFailValue': '0',
    'cumFailFee': '0',
    'cumApprovedSize': '0.001',
    'cumApprovedValue': '102.4819',
    'cumApprovedFee': '0.038943',
    'createdTime': '1763040580634',
    'updatedTime': '1763040991067'
  },
  {
    'id': '683680821340537812',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'side': 'BUY',
    'price': '0.0',
    'size': '0.001',
    'clientOrderId': '10801486523465831',
    'type': 'MARKET',
    'timeInForce': 'IMMEDIATE_OR_CANCEL',
    'reduceOnly': false,
    'triggerPrice': '0',
    'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
    'expireTime': '1764816609390',
    'sourceKey': '',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'openTpslParentOrderId': '0',
    'isSetOpenTp': false,
    'openTp': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isSetOpenSl': false,
    'openSl': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isWithoutMatch': false,
    'withoutMatchFillSize': '0',
    'withoutMatchFillValue': '0',
    'withoutMatchPeerAccountId': '0',
    'withoutMatchPeerOrderId': '0',
    'maxLeverage': '10',
    'takerFeeRate': '0.00038',
    'makerFeeRate': '0.00012',
    'liquidateFeeRate': '0.01',
    'marketLimitPrice': '0',
    'marketLimitValue': '102.091900',
    'l2Nonce': '1592239722',
    'l2Value': '1020.919000',
    'l2Size': '0.001',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765594209390',
    'l2Signature': {
      'r': '0x044e6002d7626830fcc2d60f98176fbbae3369e2d267456071baaf82830efc84',
      's': '0x04f4f9d5d6747e63ebc7a623efb073daad7f6f86c22ed8ab14f19b0e83df37e2',
      'v': ''
    },
    'extraType': '',
    'extraDataJson': '{"requestId":"1762741223090.SZOhWT","moid":"6k10jwJ41dOlyZqmcxUc"}',
    'status': 'FILLED',
    'matchSequenceId': '1394606217',
    'triggerTime': '0',
    'triggerPriceTime': '0',
    'triggerPriceValue': '0',
    'cancelReason': 'UNKNOWN_ORDER_CANCEL_REASON',
    'cumFillSize': '0.001',
    'cumFillValue': '102.0919',
    'cumFillFee': '0.038794',
    'maxFillPrice': '102091.9',
    'minFillPrice': '102091.9',
    'cumLiquidateFee': '0',
    'cumRealizePnl': '-0.038794',
    'cumMatchSize': '0.001',
    'cumMatchValue': '102.0919',
    'cumMatchFee': '0.038794',
    'cumFailSize': '0',
    'cumFailValue': '0',
    'cumFailFee': '0',
    'cumApprovedSize': '0.001',
    'cumApprovedValue': '102.0919',
    'cumApprovedFee': '0.038794',
    'createdTime': '1763002209983',
    'updatedTime': '1763002638330'
  },
  {
    'id': '683129801388590036',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000064',
    'side': 'BUY',
    'price': '0.00',
    'size': '0.10',
    'clientOrderId': '5375998767842692',
    'type': 'MARKET',
    'timeInForce': 'IMMEDIATE_OR_CANCEL',
    'reduceOnly': true,
    'triggerPrice': '0',
    'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
    'expireTime': '1764685235824',
    'sourceKey': '',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'openTpslParentOrderId': '0',
    'isSetOpenTp': false,
    'openTp': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isSetOpenSl': false,
    'openSl': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isWithoutMatch': false,
    'withoutMatchFillSize': '0',
    'withoutMatchFillValue': '0',
    'withoutMatchPeerAccountId': '0',
    'withoutMatchPeerOrderId': '0',
    'maxLeverage': '10',
    'takerFeeRate': '0.00038',
    'makerFeeRate': '0.00012',
    'liquidateFeeRate': '0.01',
    'marketLimitPrice': '1191.73',
    'marketLimitValue': '97.964000',
    'l2Nonce': '3764560285',
    'l2Value': '979.540000',
    'l2Size': '0.10',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765462835824',
    'l2Signature': {
      'r': '0x0399432ea7414bebd6f34ca63b387969ba4f726754a5093a7691501f5a86a1ed',
      's': '0x02998888b92a6a979888ac4b41cdc5eb5cd8fd39ff682a4d03162e0ab6ed208f',
      'v': ''
    },
    'extraType': '',
    'extraDataJson': '{"requestId":"1762741223090.SZOhWT","moid":"6k10jwJ41dOlyZqmcxUc"}',
    'status': 'FILLED',
    'matchSequenceId': '662152746',
    'triggerTime': '0',
    'triggerPriceTime': '0',
    'triggerPriceValue': '0',
    'cancelReason': 'UNKNOWN_ORDER_CANCEL_REASON',
    'cumFillSize': '0.10',
    'cumFillValue': '97.9640',
    'cumFillFee': '0.037226',
    'maxFillPrice': '979.64',
    'minFillPrice': '979.64',
    'cumLiquidateFee': '0',
    'cumRealizePnl': '1.956774',
    'cumMatchSize': '0.10',
    'cumMatchValue': '97.9640',
    'cumMatchFee': '0.037226',
    'cumFailSize': '0',
    'cumFailValue': '0',
    'cumFailFee': '0',
    'cumApprovedSize': '0.10',
    'cumApprovedValue': '97.9640',
    'cumApprovedFee': '0.037226',
    'createdTime': '1762870836589',
    'updatedTime': '1762871300249'
  },
  {
    'id': '682938107087029204',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000064',
    'side': 'SELL',
    'price': '0.00',
    'size': '0.10',
    'clientOrderId': '8259351840267181',
    'type': 'MARKET',
    'timeInForce': 'IMMEDIATE_OR_CANCEL',
    'reduceOnly': false,
    'triggerPrice': '0',
    'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
    'expireTime': '1764639531807',
    'sourceKey': '',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'openTpslParentOrderId': '0',
    'isSetOpenTp': false,
    'openTp': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isSetOpenSl': false,
    'openSl': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isWithoutMatch': false,
    'withoutMatchFillSize': '0',
    'withoutMatchFillValue': '0',
    'withoutMatchPeerAccountId': '0',
    'withoutMatchPeerOrderId': '0',
    'maxLeverage': '10',
    'takerFeeRate': '0.00038',
    'makerFeeRate': '0.00012',
    'liquidateFeeRate': '0.01',
    'marketLimitPrice': '0',
    'marketLimitValue': '99.958000',
    'l2Nonce': '2225646150',
    'l2Value': '0.001000',
    'l2Size': '0.10',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765417131807',
    'l2Signature': {
      'r': '0x01879eedfe5d5a559e7b14d70004f69d5b8dd945b433fd7f2c43e19a1c27451a',
      's': '0x07829c2b94e1d98b061dd200cce6b4153b5430d5844f1e1db22a361c2e613c1e',
      'v': ''
    },
    'extraType': '',
    'extraDataJson': '{"requestId":"1762741223090.SZOhWT","moid":"6k10jwJ41dOlyZqmcxUc"}',
    'status': 'FILLED',
    'matchSequenceId': '659740772',
    'triggerTime': '0',
    'triggerPriceTime': '0',
    'triggerPriceValue': '0',
    'cancelReason': 'UNKNOWN_ORDER_CANCEL_REASON',
    'cumFillSize': '0.10',
    'cumFillValue': '99.9580',
    'cumFillFee': '0.037984',
    'maxFillPrice': '999.58',
    'minFillPrice': '999.58',
    'cumLiquidateFee': '0',
    'cumRealizePnl': '-0.037984',
    'cumMatchSize': '0.10',
    'cumMatchValue': '99.9580',
    'cumMatchFee': '0.037984',
    'cumFailSize': '0',
    'cumFailValue': '0',
    'cumFailFee': '0',
    'cumApprovedSize': '0.10',
    'cumApprovedValue': '99.9580',
    'cumApprovedFee': '0.037984',
    'createdTime': '1762825133106',
    'updatedTime': '1762825594590'
  },
  {
    'id': '682672000304416724',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'side': 'SELL',
    'price': '0.0',
    'size': '0.001',
    'clientOrderId': '4198283005225212',
    'type': 'STOP_MARKET',
    'timeInForce': 'IMMEDIATE_OR_CANCEL',
    'reduceOnly': true,
    'triggerPrice': '104300.3',
    'triggerPriceType': 'LAST_PRICE',
    'expireTime': '1764576087793',
    'sourceKey': '',
    'isPositionTpsl': true,
    'isLiquidate': false,
    'isDeleverage': false,
    'openTpslParentOrderId': '682672000207946708',
    'isSetOpenTp': false,
    'openTp': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isSetOpenSl': false,
    'openSl': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isWithoutMatch': false,
    'withoutMatchFillSize': '0',
    'withoutMatchFillValue': '0',
    'withoutMatchPeerAccountId': '0',
    'withoutMatchPeerOrderId': '0',
    'maxLeverage': '10',
    'takerFeeRate': '0.00038',
    'makerFeeRate': '0.00012',
    'liquidateFeeRate': '0.01',
    'marketLimitPrice': '0',
    'marketLimitValue': '104.300000',
    'l2Nonce': '3523017106',
    'l2Value': '0.000100',
    'l2Size': '0.001',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765353687793',
    'l2Signature': {
      'r': '0x0614b11d38a941967fd9b7f176dc03ab3b517953913cbc33c45cd13fe13d5d46',
      's': '0x0437f86ee958999b27880caf39323e5909771fb19820c6d1684aabb3ad995ea8',
      'v': ''
    },
    'extraType': '',
    'extraDataJson': '',
    'status': 'FILLED',
    'matchSequenceId': '1377748628',
    'triggerTime': '1762867421257',
    'triggerPriceTime': '1762867421254',
    'triggerPriceValue': '104300.0',
    'cancelReason': 'UNKNOWN_ORDER_CANCEL_REASON',
    'cumFillSize': '0.001',
    'cumFillValue': '104.3000',
    'cumFillFee': '0.039634',
    'maxFillPrice': '104300.0',
    'minFillPrice': '104300.0',
    'cumLiquidateFee': '0',
    'cumRealizePnl': '-2.162534',
    'cumMatchSize': '0.001',
    'cumMatchValue': '104.3000',
    'cumMatchFee': '0.039634',
    'cumFailSize': '0',
    'cumFailValue': '0',
    'cumFailFee': '0',
    'cumApprovedSize': '0.001',
    'cumApprovedValue': '104.3000',
    'cumApprovedFee': '0.039634',
    'createdTime': '1762761688305',
    'updatedTime': '1762867854612'
  },
  {
    'id': '682672000304415700',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'side': 'SELL',
    'price': '0.0',
    'size': '0.001',
    'clientOrderId': '8300839957176029',
    'type': 'TAKE_PROFIT_MARKET',
    'timeInForce': 'IMMEDIATE_OR_CANCEL',
    'reduceOnly': true,
    'triggerPrice': '108663.9',
    'triggerPriceType': 'LAST_PRICE',
    'expireTime': '1764576087677',
    'sourceKey': '',
    'isPositionTpsl': true,
    'isLiquidate': false,
    'isDeleverage': false,
    'openTpslParentOrderId': '682672000207946708',
    'isSetOpenTp': false,
    'openTp': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isSetOpenSl': false,
    'openSl': {
      'side': 'UNKNOWN_ORDER_SIDE',
      'price': '',
      'size': '',
      'clientOrderId': '',
      'triggerPrice': '',
      'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
      'expireTime': '0',
      'l2Nonce': '0',
      'l2Value': '',
      'l2Size': '',
      'l2LimitFee': '',
      'l2ExpireTime': '0',
      'l2Signature': {
        'r': '',
        's': '',
        'v': ''
      }
    },
    'isWithoutMatch': false,
    'withoutMatchFillSize': '0',
    'withoutMatchFillValue': '0',
    'withoutMatchPeerAccountId': '0',
    'withoutMatchPeerOrderId': '0',
    'maxLeverage': '10',
    'takerFeeRate': '0.00038',
    'makerFeeRate': '0.00012',
    'liquidateFeeRate': '0.01',
    'marketLimitPrice': '0',
    'marketLimitValue': '0',
    'l2Nonce': '445986812',
    'l2Value': '0.000100',
    'l2Size': '0.001',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765353687677',
    'l2Signature': {
      'r': '0x06a83990d269448466a53a7a815a808885171ff21a7710d78ff142218dba7580',
      's': '0x04242322bac626a8b395b47be477a1103cb3bf5970278681a083cccf138cee7d',
      'v': ''
    },
    'extraType': '',
    'extraDataJson': '',
    'status': 'CANCELED',
    'matchSequenceId': '0',
    'triggerTime': '0',
    'triggerPriceTime': '0',
    'triggerPriceValue': '0',
    'cancelReason': 'COULD_NOT_FILL',
    'cumFillSize': '0',
    'cumFillValue': '0',
    'cumFillFee': '0',
    'maxFillPrice': '0',
    'minFillPrice': '0',
    'cumLiquidateFee': '0',
    'cumRealizePnl': '0',
    'cumMatchSize': '0',
    'cumMatchValue': '0',
    'cumMatchFee': '0',
    'cumFailSize': '0',
    'cumFailValue': '0',
    'cumFailFee': '0',
    'cumApprovedSize': '0',
    'cumApprovedValue': '0',
    'cumApprovedFee': '0',
    'createdTime': '1762761688305',
    'updatedTime': '1762867421290'
  },
  {
    'id': '682672000207946708',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'side': 'BUY',
    'price': '0.0',
    'size': '0.001',
    'clientOrderId': '37194765280037057',
    'type': 'MARKET',
    'timeInForce': 'IMMEDIATE_OR_CANCEL',
    'reduceOnly': false,
    'triggerPrice': '0',
    'triggerPriceType': 'UNKNOWN_PRICE_TYPE',
    'expireTime': '1764576087514',
    'sourceKey': '',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'openTpslParentOrderId': '0',
    'isSetOpenTp': true,
    'openTp': {
      'side': 'SELL',
      'price': '0.0',
      'size': '0.001',
      'clientOrderId': '8300839957176029',
      'triggerPrice': '108663.9',
      'triggerPriceType': 'LAST_PRICE',
      'expireTime': '1764576087677',
      'l2Nonce': '445986812',
      'l2Value': '0.000100',
      'l2Size': '0.001',
      'l2LimitFee': '1.000000',
      'l2ExpireTime': '1765353687677',
      'l2Signature': {
        'r': '0x06a83990d269448466a53a7a815a808885171ff21a7710d78ff142218dba7580',
        's': '0x04242322bac626a8b395b47be477a1103cb3bf5970278681a083cccf138cee7d',
        'v': ''
      }
    },
    'isSetOpenSl': true,
    'openSl': {
      'side': 'SELL',
      'price': '0.0',
      'size': '0.001',
      'clientOrderId': '4198283005225212',
      'triggerPrice': '104300.3',
      'triggerPriceType': 'LAST_PRICE',
      'expireTime': '1764576087793',
      'l2Nonce': '3523017106',
      'l2Value': '0.000100',
      'l2Size': '0.001',
      'l2LimitFee': '1.000000',
      'l2ExpireTime': '1765353687793',
      'l2Signature': {
        'r': '0x0614b11d38a941967fd9b7f176dc03ab3b517953913cbc33c45cd13fe13d5d46',
        's': '0x0437f86ee958999b27880caf39323e5909771fb19820c6d1684aabb3ad995ea8',
        'v': ''
      }
    },
    'isWithoutMatch': false,
    'withoutMatchFillSize': '0',
    'withoutMatchFillValue': '0',
    'withoutMatchPeerAccountId': '0',
    'withoutMatchPeerOrderId': '0',
    'maxLeverage': '10',
    'takerFeeRate': '0.00038',
    'makerFeeRate': '0.00012',
    'liquidateFeeRate': '0.01',
    'marketLimitPrice': '0',
    'marketLimitValue': '106.422900',
    'l2Nonce': '4004551075',
    'l2Value': '1064.227000',
    'l2Size': '0.001',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765353687514',
    'l2Signature': {
      'r': '0x02484c41fdad1087dc987a9b23c33830eb29b52837d89579740eb6bb75b25865',
      's': '0x05b716b4121126d85008f08272729b6c0f0f7aad41f8f81fb2d48f47f3693726',
      'v': ''
    },
    'extraType': '',
    'extraDataJson': '{"requestId":"1762741223090.SZOhWT","moid":"6k10jwJ41dOlyZqmcxUc"}',
    'status': 'FILLED',
    'matchSequenceId': '1364526406',
    'triggerTime': '0',
    'triggerPriceTime': '0',
    'triggerPriceValue': '0',
    'cancelReason': 'UNKNOWN_ORDER_CANCEL_REASON',
    'cumFillSize': '0.001',
    'cumFillValue': '106.4229',
    'cumFillFee': '0.040440',
    'maxFillPrice': '106422.9',
    'minFillPrice': '106422.9',
    'cumLiquidateFee': '0',
    'cumRealizePnl': '-0.040440',
    'cumMatchSize': '0.001',
    'cumMatchValue': '106.4229',
    'cumMatchFee': '0.040440',
    'cumFailSize': '0',
    'cumFailValue': '0',
    'cumFailFee': '0',
    'cumApprovedSize': '0.001',
    'cumApprovedValue': '106.4229',
    'cumApprovedFee': '0.040440',
    'createdTime': '1762761688282',
    'updatedTime': '1762762157481'
  }
])
const triggerPriceTypeMap = {
    LAST_PRICE:t('latestPrice'),
    TAKE_PROFIT_LIMIT:t('takeProfitLimit'),
}
const statusMap = {
  CANCELED:t('cancelled1'),
  FILLED:t('completed')
}
const typeDict = computed(()=>{
    const contractMap =  perpStore.metadata?.contractList?.reduce?.((prev,cur)=>{
      prev[cur.contractId] = cur.contractName
      return prev
    },{} as Record<string,string>) || {}
      contractMap.ALL = t('all')
      return contractMap
})

const getList = async ()=>{
  const res = await getActiveOrderPage({
    filterStatusList:'CANCELING,OPEN,PENDING',
    ...props.searchParams
  })
  listData.value = res.dataList
}

getList()
</script>

<template>
  <el-table fit :data="listData" header-row-class-name="text-12px sticky top-0 z-10 font-500" cell-class-name="color-[--main-text] text-12px" row-class-name="cursor-pointer">
      <el-table-column :width="150" :label="t('perp')" prop="contractId" >
        <template #default="{ row }">
          <span class="text-14px">{{ typeDict[row.contractId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeVolume')" prop="contractSize" >
        <template #default="{ row }">
          {{ formatNumber(row.cumMatchSize,3) }}/{{ formatNumber(row.l2Size,3) }}
        </template>
      </el-table-column>
      <el-table-column :width="100" align="right" :label="t('delegatePrice')" prop="fillPrice">
        <template #default="{ row }">
         {{ row.type.includes('MARKET') ? t('market'):formatNumber(row.price,{
            limit:20,
            decimals:2
         }) }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('triggerPrice')" prop="triggerPrice" >
        <template #default="{ row }">
          <template v-if="!row.type.includes('STOP') && !row.type.includes('TAKE_PROFIT')">
            --
          </template>
          <template v-else>
            {{row.type.includes('STOP') ? '≤':'≥'}}{{ formatNumber(row.triggerPrice,1) }} {{ triggerPriceTypeMap[row.triggerPriceType as keyof typeof triggerPriceTypeMap] }}
          </template>
        </template>
      </el-table-column>
      <el-table-column :width="80" align="right" :label="t('tradeType')" prop="side" >
        <template #default="{ row }"> 
          <span :class="row.side === 'BUY' ? 'color-[--up-color]' : 'color-[--down-color]'">{{ row.side === 'BUY' ? t('buy') : t('sell') }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="80" align="right" :label="t('orderType')" prop="orderType" >
        <template #default="{ row }"> 
          {{ row.type.includes('MARKET') ? t('market'):'' }}{{ row.type.includes('LIMIT') ? t('limit'):'' }}
        </template>
      </el-table-column>
      <el-table-column :width="80" align="right" :label="t('tradeType2')" prop="tradeType2" >
        <template #default="{ row }"> 
          {{ t('trades') }}
        </template>
      </el-table-column>
      <el-table-column :width="80" align="right" :label="t('status')" prop="status" >
        <template #default="{ row }"> 
          {{ statusMap[row.status as keyof typeof statusMap] }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('orderId')" prop="orderId" >
        <template #default="{row}">
            <div class="flex items-center justify-end gap-4px">
                {{ row.id }}<Icon v-copy="row.id" name="bxs:copy" class="color-[#5A5E64]"/>
            </div>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('orderTime')" prop="createdTime">
        <template #default="{row}">
            {{ dayjs(Number(row.createdTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
    </el-table-column>
    <el-table-column :width="80" align="right" :label="t('onlyReduce')" prop="reduceOnly">
        <template #default="{row}">
            {{ row.reduceOnly?t('yes'):t('no') }}
        </template>
    </el-table-column>
    <el-table-column align="right" :label="t('executionStrategy')" prop="reduceOnly">
        <template #default="{row}">
            <div class="flex items-center justify-end gap-4px">
              {{ row.type.includes('MARKET') ?t('immediateOrCancel'): t('validityPeriod2') }}
              <el-popover :width="200">
                <template #reference>
                  <Icon name="custom:info"/>
                </template>
                <span class="text-12px">
                  {{ row.type.includes('MARKET') ?t('immediateOrCancel2'): t('validityPeriod3') }}
                </span>
              </el-popover>
            </div>
        </template>
    </el-table-column>
    <el-table-column :width="80" align="right" :label="t('operate')">
      <template #default="{row}">
        <el-button size="small">{{ t('detail') }}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>