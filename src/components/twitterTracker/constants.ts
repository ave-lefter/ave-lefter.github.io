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
            [typeEnum.tweet]: t('tweet'),
            [typeEnum.retweet]: t('retweet'),
            [typeEnum.quote]: t('quote'),
            [typeEnum.reply]: t('reply'),
        }))
    }
}