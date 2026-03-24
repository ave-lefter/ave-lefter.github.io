import { getTextWidth } from '~/utils/index'

export function getGainOptions(t: ReturnType<typeof useI18n>['t']) {
  return [
    {
      title: t('basicInfo'),
      list: [
        // 'headline',
        'priceContent',
        'mCapContent',
        'liquidityContent',
        'holdersContent',
        'top10PositionsContent',
        'securityContent',
      ],
    },
    {
      title: t('transactionInfo'),
      list: [
        'dynamicVolAndTxs',
        'dynamicMarkers',
        'priceChange1mContent',
        'priceChangeDynamicContent',
        'priceChange24hContent',
        'smarterContent',
      ],
    },
    {
      title: t('securityInfo'),
      list: [
        'snipersContent',
        'dexContent',
      ],
    },
  ]
}

export function getGainDefaultColumns(t: ReturnType<typeof useI18n>['t']) {
  return [
    {
      title: t('poolPair'),
      key: 'poolPair',
      isVisible: true,
      fixed: 'left',
      render: 'poolPairContent',
      minWidth: 320
    },
    // {
    //   title:t('trendChart'),
    //   isVisible: true,
    //   key:'trendChart',
    //   render:'trendChart',
    //   minWidth:232,
    // },
    {
      title: t('smarter1'),
      key: 'smart_money_buy_volume_24h',
      isVisible: true,
      render: 'smarterContent',
      minWidth: 110,
      align: 'right'
    },
    {
      title: t('mCap'),
      isVisible: true,
      key: 'mCap',
      render: 'mCapContent',
      minWidth: 140,
      align: 'right'
    },
    {
      title: t('liquidity1') + '/' + t('initial'),
      key: 'tvl',
      isVisible: true,
      render: 'liquidityContent',
      minWidth: 160,
      align: 'right'
    },
    {
      title: t('price'),
      key: 'current_price_usd',
      isVisible: true,
      render: 'priceContent',
      minWidth: 130,
      align: 'right'
    },
    {
      title: '1m%',
      key: 'price_change_1m',
      isVisible: false,
      render: 'priceChange1mContent',
      minWidth: 110,
      align: 'right',
      activeInterval: '1m'
    },
    {
      title: '15m%',
      key: 'price_change_15m',
      isVisible: false,
      render: 'priceChange15mContent',
      minWidth: 110,
      align: 'right',
      activeInterval: '15m'
    },
    {
      title: t('specifiedTimeInterval'),
      key: 'price_change_dynamic',
      isVisible: true,
      render: 'priceChangeDynamicContent',
      minWidth: 110,
      align: 'right'
    },
    {
      title: '24h%',
      key: 'price_change_24h',
      isVisible: true,
      render: 'priceChange24hContent',
      minWidth: 110,
      align: 'right',
      activeInterval: '24h'
    },
    {
      title: t('volume4') + '/' + t('txns'),
      key: 'dynamicVolAndTxs',
      isVisible: true,
      render: 'dynamicVolAndTxs',
      minWidth: getTextWidth('VolTxns') + 120,
      align: 'right'
    },
    {
      title: t('markers'),
      key: 'markers_dynamic',
      isVisible: false,
      render: 'dynamicMarkers',
      minWidth: getTextWidth(t('markers'), 50) + 80,
      align: 'right'
    },
    {
      title: t('holders'),
      key: 'holders',
      isVisible: true,
      render: 'holdersContent',
      minWidth: getTextWidth(t('holders'), 50) + 50,
      align: 'right'
    },
    {
      title: t('tokenInfoSecurity'),
      key: 'security',
      isVisible: true,
      render: 'securityContent',
      children: [
        { title: t('tokenInfoSecurity'), isVisible: true, render: 'securityContent' },
        { title: t('runPull'), isVisible: true, render: 'runPullContent' },
      ],
      minWidth: getTextWidth(t('security'), 50) + 55,
      align: 'right'
    },
    {
      title: t('top10'),
      key: 'holders_top10_ratio',
      isVisible: false,
      render: 'top10PositionsContent',
      minWidth: getTextWidth(t('top10'), 50) + 40,
      align: 'right'
    },
    {
      title: t('snipers'),
      key: 'sniper_tx_count',
      isVisible: false,
      render: 'snipersContent',
      minWidth: getTextWidth(t('snipers')) + 68,
      align: 'right'
    },
    {
      title: 'DEX',
      key: 'dex',
      isVisible: false,
      render: 'dexContent',
      minWidth: 70,
      align: 'center'
    },
    {
      title: t('quick'),
      key: 'quick',
      isVisible: true,
      fixed: 'right',
      render: 'quickContent',
      minWidth: 100,
      align: 'right'
    },
  ]
}

export function getOpenTimeList(allText: string) {
  return [
    { text: allText, value: '' },
    { text: '≤30min', value: String(0.5) },
    { text: '≤1H', value: String(1) },
    { text: '≤6H', value: String(6) },
    { text: '≤12H', value: String(12) },
    { text: '≤24H', value: String(24) },
    { text: '≤1W', value: String(24 * 7) },
    { text: '≤30D', value: String(24 * 30) }
  ]
}
