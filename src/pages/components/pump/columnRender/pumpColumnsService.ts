export function getPumpOptions(t: ReturnType<typeof useI18n>['t']) {
    return [
      {
        title: t('basicInfo'),
        list: [
          'mCapContent',
          'liquidityContent',
          'holdersContent',
          'top10PositionsContent',
          'devContent'
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
          'lastTradeAtContent'
        ],
      },
      {
        title: t('securityInfo'),
        list: [
          'progress',
          'runTime1',
          'runTime2',
          'snipersContent',
          'snipers1mContent',
          'securityContent',
          'insidersContent',
        ],
      },
    ]
  }
  
  export function getPumpDefault(t: ReturnType<typeof useI18n>['t']) {
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
        title: t('mCap'),
        isVisible: true,
        key:'mCap',
        render: 'mCapContent',
        minWidth:140,
        align:'right'
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
        title: t('progress'),
        key: 'progress',
        isVisible: true,
        render: 'progress',
        minWidth:105,
        align:'right'
      },
      {
        title: t('runTime1'),
        key: 'first_half_elapsed_time',
        isVisible: true,
        render: 'runTime1',
        minWidth:getTextWidth(t('runTime1'),50)+60,
        align:'right'
      },
      {
        title: t('runTime2'),
        key: 'second_half_elapsed_time',
        isVisible: true,
        render: 'runTime2',
        minWidth:getTextWidth(t('runTime2'),50)+60,
        align:'right'
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
        title: t('top10'),
        key: 'holders_top10_ratio',
        isVisible: false,
        render: 'top10PositionsContent',
        minWidth:getTextWidth(t('top10'), 50) + 40,
        align:'right'
      },
      {
        title:'DEV%',
        key:'dev_balance_ratio_cur',
        isVisible:false,
        render:'devContent',
        minWidth:78,
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
        title: t('snipers'),
        key: 'sniper_tx_count',
        isVisible: false,
        render: 'snipersContent',
        minWidth:getTextWidth(t('snipers')) + 68,
        align:'right'
      },
      {
        title: t('snipers_1m'),
        key: 'rusher_tx_count',
        isVisible: false,
        render: 'snipers1mContent',
        minWidth:getTextWidth(t('snipers_1m'), 50) + 50,
        align:'right'
      },
      {
        title: t('lastTxsTime1'),
        key: 'last_trade_at',
        isVisible: true,
        render: 'lastTradeAtContent',
        minWidth:getTextWidth(t('lastTxsTime1'), 50) + 50,
        align:'right'
      },
      {
        title: t('security'),
        key: 'security',
        isVisible: true,
        render: 'securityContent',
        children:[
          {title:t('security'),isVisible:true,render:'securityContent'},
          {title:t('runPull'),isVisible:true,render:'runPullContent'},
        ],
        minWidth:getTextWidth(t('security'), 50) + 55,
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