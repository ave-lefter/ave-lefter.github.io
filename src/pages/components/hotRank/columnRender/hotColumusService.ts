export function getHotOptions(t: ReturnType<typeof useI18n>['t']) {
  return [
    {
      title: t('basicInfo'),
      list: [
        // 'headline',
        'trendChart',
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
        // 'txnsContent',
        'dynamicMarkers',
        'priceChange1mContent',
        'priceChangeDynamicContent',
        // "priceChange5mContent",
        'priceChange24hContent',
        'smarterContent',
      ],
    },
    {
      title: t('securityInfo'),
      list: [
        'snipersContent',
        'dexContent',
        'insidersContent',
      ],
    },
  ]
}

export function getHotDefaultColumns(t: ReturnType<typeof useI18n>['t']) {
  return [
    {
      title: t('poolPair'),
      key: 'poolPair',
      isVisible: true,
      fixed: 'left',
      render: 'poolPairContent',
      minWidth:320
    },
    {
      title:t('trendChart'),
      isVisible: true,
      key:'trendChart',
      render:'trendChart',
      minWidth:232,
    },
    {
      title: t('smarter1'),
      key: 'smart_money_buy_volume_24h',
      isVisible: true,
      render: 'smarterContent',
      minWidth:110,
      align:'right'
    },
    {
      title: t('mCap'),
      isVisible: true,
      key:'mCap',
      render: 'mCapContent',
      minWidth:140,
      align:'right'
    },
    {
      title: t('price'),
      key: 'current_price_usd',
      isVisible: true,
      render: 'priceContent',
      minWidth:130,
      align:'right'
    },
    {
      title: '1m%',
      key: 'price_change_1m',
      isVisible: false,
      render: 'priceChange1mContent',
      minWidth:110,
      align:'right',
      activeInterval:'1m'
    },
    {
      title: t('specifiedTimeInterval'),
      key: 'price_change_dynamic',
      isVisible: true,
      render: 'priceChangeDynamicContent',
      minWidth:110,
      align:'right'
    },
    {
      title: '24h%',
      key: 'price_change_24h',
      isVisible: true,
      render: 'priceChange24hContent',
      minWidth:110,
      align:'right',
      activeInterval:'24h'
    },
    {
      title: t('liquidity1') + '/' + t('initial'),
      key: 'tvl',
      isVisible: true,
      render: 'liquidityContent',
      minWidth:160,
      align:'right'
    },
    {
      title: t('volume4')+'/'+t('txns'),
      key: 'dynamicVolAndTxs',
      isVisible: true,
      render: 'dynamicVolAndTxs',
      minWidth:getTextWidth('VolTxns')+120,
      align:'right'
    },
    {
      title: t('markers'),
      key: 'markers_dynamic',
      isVisible: false,
      render: 'dynamicMarkers',
      minWidth:getTextWidth(t('markers'), 50) + 80,
      align:'right'
    },
    {
      title: t('holders'),
      key: 'holders',
      isVisible: true,
      render: 'holdersContent',
      minWidth:getTextWidth(t('holders'), 50) + 50,
      align:'right'
    },
    {
      title: 'DEX',
      key: 'dex',
      isVisible: false,
      render: 'dexContent',
      minWidth:70,
      align:'center'
    },
    {
      title: t('tokenInfoSecurity'),
      key: 'security',
      isVisible: true,
      render: 'securityContent',
      children:[
        {title:t('tokenInfoSecurity'),isVisible:true,render:'securityContent'},
      ],
      minWidth:250,
      align:'right'
    },
    {
      title: t('top10'),
      key: 'holders_top10_ratio',
      isVisible: false,
      render: 'top10PositionsContent',
      minWidth:getTextWidth(t('top10'), 50) + 40,
      align:'right'
    },
    {
      title: t('snipers'),
      key: 'sniper_tx_count',
      isVisible: false,
      render: 'snipersContent',
      minWidth:getTextWidth(t('snipers')) + 68,
      align:'right'
    },
    {
      title: t('insiders'),
      key: 'insider_balance_ratio_cur',
      isVisible: false,
      render: 'insidersContent',
      minWidth:110,
      align:'right'
    },
    {
      title: t('quick'),
      key: 'quick',
      isVisible: true,
      fixed: 'right',
      render: 'quickContent',
      minWidth:100,
      align:'right'
    },
  ]
}

export function getOpenTimeList(allText:string) {
  return [
    { text: allText, value: '' },
    { text: '≤30min', value: String(30) },
    { text: '≤1H', value: String(60) },
    { text: '≤6H', value: String(360) },
    { text: '≤12H', value: String(720) },
    { text: '≤24H', value: String(1440) },
    { text: '≤1W', value: String(10080) },
    { text: '≤30D', value: String(43200) }
  ]
}
