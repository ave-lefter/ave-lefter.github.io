const typeEnum={
    tweet: 1,
    retweet: 3,
    quote: 2,
    reply: 4,
}
export const useTrackerTypes = ()=>{
    const { t } = useI18n()
    return {
        arr: computed(()=>[
            { label: t('tweet'), value: typeEnum.tweet },
            { label: t('retweet'), value: typeEnum.retweet },
            { label: t('quote'), value: typeEnum.quote },
            { label: t('reply'), value: typeEnum.reply },
        ]),
        map: computed(()=>({
            [typeEnum.tweet]: {
                label: t('tweet'),
                bg:'#13C2C21A',
                color:'#13C2C2'
            },
            [typeEnum.retweet]: {
                label:t('retweet'),
                bg:'rgba(255, 166, 34, 0.10)',
                color:'#FFA622'
            },
            [typeEnum.quote]: {
                label:t('quote'),
                bg:'rgba(129, 64, 241, 0.10)',
                color:'#8140F1'
            },
            [typeEnum.reply]: {
                label:t('reply'),
                bg:'rgba(0, 197, 128, 0.10)',
                color:'#00C580'
            },
        }))
    }
}