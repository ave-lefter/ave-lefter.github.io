interface IHotTwitterItem {
    author:     string;
    username:   string;
    content:    string;
    content_en: string;
    url:        string;
    media:      string;
    portrait:   string;
    created_at: string;
}

function getHotTwitterList(query:{
    cursor_time:Date
    cursor_tweet_id:number|string
}):Promise<{list:IHotTwitterItem[]}> {
    const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/homepage', {
        method: 'get',
        query
      })
}

export type {
    IHotTwitterItem
}

export {
    getHotTwitterList
}