export function getHotOptions(t: ReturnType<typeof useI18n>['t']) {
  return [
    {
      label: t('basicInfo'),
      list: [
        // "openTimeContent",
        'priceContent',
        'mCapContent',
        'liquidityContent',
        'holdersContent',
        'top10PositionsContent',
      ],
    },
    {
      label: t('transactionInfo'),
      list: [
        'volumeContent',
        'txnsContent',
        'markersContent',
        'priceChange1mContent',
        'priceChangeDynamicContent',
        // "priceChange5mContent",
        'priceChange24hContent',
        'smarterContent',
      ],
    },
    {
      label: t('securityInfo'),
      list: [
        'rugPullContent',
        'snipersContent',
        'securityContent',
        'dexContent',
        'insidersContent',
      ],
    },
  ]
}

export function getDefaultColumns(t: ReturnType<typeof useI18n>['t']) {
  return [
    {
      label: t('poolPair'),
      field: 'poolPair',
      isHide: true,
      fixed: 'left',
      render: 'poolPairContent',
    },
    {
      label:t('AI叙事'),
      isHide: true,
      field:'headline',
      render:'headline'
    },
    // {
    //   label: t("openTime"),
    //   isHide: true,
    //   render: "openTimeContent",
    // },
    {
      label: t('price'),
      field: 'current_price_usd',
      isHide: true,
      render: 'priceContent',
    },
    {
      label: t('mCap'),
      isHide: true,
      render: 'mCapContent',
    },
    // {
    //   label: t('listTime'),
    //   field: "listing_at",
    //   isHide: true,
    //   render: "listTimeContent",
    // },

    // {
    //   label: t('mCap'),
    //   field: "market_cap",
    //   isHide: true,
    //   render: "marketCapContent",
    // },
    {
      label: t('liquidity1') + '/' + t('initial'),
      field: 'tvl',
      isHide: true,
      render: 'liquidityContent',
    },
    {
      label: t('flag_rug_pull'),
      field: 'rug_rate',
      isHide: true,
      render: 'rugPullContent',
    },
    {
      label: t('smarter1'),
      field: 'smart_money_buy_volume_24h',
      isHide: true,
      render: 'smarterContent',
    },
    {
      label: t('volume4'),
      field: 'volume_u_dynamic',
      isHide: true,
      render: 'volumeContent',
    },
    {
      label: t('txns'),
      field: 'tx_dynamic_count',
      isHide: false,
      render: 'txnsContent',
    },
    {
      label: t('markers'),
      field: 'makers_dynamic',
      isHide: true,
      render: 'markersContent',
    },
    {
      label: t('holders'),
      field: 'holders',
      isHide: true,
      render: 'holdersContent',
    },
    {
      label: '1m%',
      field: 'price_change_1m',
      isHide: true,
      render: 'priceChange1mContent',
    },
    {
      label: t('specifiedTimeInterval'),
      field: 'price_change_dynamic',
      isHide: true,
      render: 'priceChangeDynamicContent',
    },
    // {
    //   label: "5m%",
    //   field: "price_change_5m",
    //   isHide: true,
    //   render: "priceChange5mContent",
    // },
    {
      label: '24h%',
      field: 'price_change_24h',
      isHide: true,
      render: 'priceChange24hContent',
    },
    {
      label: t('snipers'),
      field: 'sniper_tx_count',
      isHide: false,
      render: 'snipersContent',
    },
    {
      label: t('top10'),
      field: 'holders_top10_ratio',
      isHide: true,
      render: 'top10PositionsContent',
    },
    // {
    //   label: "DEV%",
    //   field: "dev_balance_ratio_cur",
    //   isHide: true,
    //   render: "devContent",
    // },
    {
      label: t('insiders'),
      field: 'insider_balance_ratio_cur',
      isHide: false,
      render: 'insidersContent',
    },
    {
      label: t('security'),
      field: 'security',
      isHide: true,
      render: 'securityContent',
    },
    {
      label: 'DEX',
      field: 'dev',
      isHide: false,
      render: 'dexContent',
    },
    {
      label: t('quick'),
      isHide: true,
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