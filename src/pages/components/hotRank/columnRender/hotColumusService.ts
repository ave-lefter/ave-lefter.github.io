export function getHotOptions(t: ReturnType<typeof useI18n>['t']) {
  return [
    {
      title: t('basicInfo'),
      list: [
        'headline',
        'priceContent',
        'mCapContent',
        'liquidityContent',
        'holdersContent',
        'top10PositionsContent',
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
        'securityContent',
        // 'runPullContent',
        'dexContent',
        'insidersContent',
      ],
    },
  ]
}

export function getDefaultColumns(t: ReturnType<typeof useI18n>['t']) {
  return [
    {
      title: t('poolPair'),
      key: 'poolPair',
      isVisible: true,
      fixed: 'left',
      render: 'poolPairContent'
    },
    {
      title:t('aiSummary'),
      isVisible: true,
      key:'headline',
      render:'headline'
    },
    // {
    //   title: t("openTime"),
    //   isVisible: true,
    //   render: "openTimeContent",
    // },
    {
      title: t('price'),
      key: 'current_price_usd',
      isVisible: true,
      render: 'priceContent',
    },
    {
      title: t('mCap'),
      isVisible: true,
      render: 'mCapContent',
    },
    // {
    //   title: t('listTime'),
    //   key: "listing_at",
    //   isVisible: true,
    //   render: "listTimeContent",
    // },

    // {
    //   title: t('mCap'),
    //   key: "market_cap",
    //   isVisible: true,
    //   render: "marketCapContent",
    // },
    {
      title: t('liquidity1') + '/' + t('initial'),
      key: 'tvl',
      isVisible: true,
      render: 'liquidityContent',
    },
    {
      title: t('smarter1'),
      key: 'smart_money_buy_volume_24h',
      isVisible: true,
      render: 'smarterContent',
    },
    {
      title: t('volume4')+'/'+t('txns'),
      key: 'dynamicVolAndTxs',
      isVisible: true,
      render: 'dynamicVolAndTxs',
    },
    // {
    //   title: t('txns'),
    //   key: 'tx_dynamic_count',
    //   isVisible: false,
    //   render: 'txnsContent',
    // },
    {
      title: t('markers'),
      key: 'markers_dynamic',
      isVisible: true,
      render: 'dynamicMarkers',
    },
    {
      title: t('holders'),
      key: 'holders',
      isVisible: true,
      render: 'holdersContent',
    },
    {
      title: '1m%',
      key: 'price_change_1m',
      isVisible: true,
      render: 'priceChange1mContent',
    },
    {
      title: t('specifiedTimeInterval'),
      key: 'price_change_dynamic',
      isVisible: true,
      render: 'priceChangeDynamicContent',
    },
    // {
    //   title: "5m%",
    //   key: "price_change_5m",
    //   isVisible: true,
    //   render: "priceChange5mContent",
    // },
    {
      title: '24h%',
      key: 'price_change_24h',
      isVisible: true,
      render: 'priceChange24hContent',
    },
    {
      title: t('snipers'),
      key: 'sniper_tx_count',
      isVisible: false,
      render: 'snipersContent',
    },
    {
      title: t('top10'),
      key: 'holders_top10_ratio',
      isVisible: true,
      render: 'top10PositionsContent',
    },
    // {
    //   title: "DEV%",
    //   key: "dev_balance_ratio_cur",
    //   isVisible: true,
    //   render: "devContent",
    // },
    {
      title: t('insiders'),
      key: 'insider_balance_ratio_cur',
      isVisible: false,
      render: 'insidersContent',
    },
    {
      title: t('security'),
      key: 'security',
      isVisible: true,
      render: 'securityContent',
      children:[
        {title:t('security'),isVisible:true,render:'securityContent'},
        {title:t('runPull'),isVisible:true,render:'runPullContent'},
      ]
    },
    {
      title: 'DEX',
      key: 'dev',
      isVisible: false,
      render: 'dexContent',
    },
    {
      title: t('quick'),
      isVisible: true,
      fixed: 'right',
      render: 'quickContent',
    },
  ]
}

export function getOpenTimeList(allText:string) {
  return [
    { text: allText, value: '' },
    { text: '≤30min', value: String(0.5) },
    { text: '≤1H', value: String(1) },
    { text: '≤6H', value: String(6) },
    { text: '≤12H', value: String(12) },
    { text: '≤24H', value: String(24) },
    { text: '≤1W', value: String(24*7)},
    { text: '≤30D', value: String(24 * 30) }
  ]
}