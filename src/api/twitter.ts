export interface IKolList<T> {
    authors: (Author & T)[];
    cursor:  string;
}

export interface Author {
    author_id:     number;
    blue_verified: string;
    chain:         string;
    name:          string;
    profile_pic:   string;
    tags:          string[];
    twitter_url:   string;
    username:      string;
    verified:      string;
}

function getHotKolList(query:{
     page_token?:string
    keyword?:string
    tags?:string
}):Promise<IKolList<{following_at:  string;}>> {
    const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/hot', {
        method: 'get',
        query
      })
}

function getFollowKolList(query:{
    page_token?:string
    keyword?:string
    tags?:string
}):Promise<IKolList<{follow_status:0|1}>>{
    const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/follow/list', {
        method: 'get',
        query
      })
}

export interface ITwitterList {
    author:     TwitterAuthor;
    content:    string;
    content_en: string;
    url:        string;
    media:      string;
    created_at: string;
    type:       string;
}

export interface TwitterAuthor {
    author_id:     string;
    name:          string;
    username:      string;
    profile_pic:   string;
    twitter_url:   string;
    verified:      boolean;
    blue_verified: boolean;
    follow_status: number;
}

function getTwitterList(query:{
    follow_only?:boolean
    page_token?:string
    types?:string
    token_keyword?:string
}) {
   const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/homepage', {
        method: 'get',
        query
      }) 
}

function followKol(author_id:number) {
    const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/follow', {
        method: 'post',
        body:{
            author_id
        }
      })
}

function unfollowKol(author_id:number) {
    const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/unfollow', {
        method: 'post',
        body:{
            author_id
        }
      })
}

function unfollowAll() {
    const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/unfollow/all', {
        method: 'post',
        body:{}
      })
}

function getKolFilters(){
     const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/config', {
        method: 'get',
        query:{}
      })
}

function getTwitterById(tweet_id:string){
    const {$api}  = useNuxtApp()
   return $api('/v2api/twitter/v1/kol/tweet', {
       method: 'get',
       query:{
        tweet_id
       }
     })
}

function getAllFollowIds(){
    const {$api}  = useNuxtApp()
   return $api('/v2api/twitter/v1/kol/follow/ids', {
       method: 'get',
     })
}

// 获取作者详细资料
export interface ITwitterProfile {
    author_id:          string;
    ave_follower_count: number;
    bio:                string;
    blue_verified:      string;
    chain:              string;
    follow_status:      number;
    follower_count:     string;
    following_count:    string;
    name:               string;
    profile_pic:        string;
    source:             string;
    tags:               string[];
    twitter_url:        string;
    username:           string;
    verified:           string;
}
function getKolProfile(author_id:number):Promise<ITwitterProfile>{
     const {$api}  = useNuxtApp()
   return $api('/v2api/twitter/v1/kol/profile', {
       method: 'get',
       query:{
        author_id
       }
     })
}  

function getTwitterByAuthor(author_id:number,page_token?:number) {
    const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/profile/tweets', {
        method: 'get',
        query:{
            author_id,
            page_token
        }
      })
}


function getNews(params:{lang?:string,userAddress?:string,pageNO?:number,pageSize?:number}){ 
    const { $api } = useNuxtApp()
    return $api('/v1api/v2/discover/news', {
        method: 'get',
        query: {
            lang: params.lang,
            userAddress: params.userAddress,
            pageNO: params.pageNO||1,
            pageSize: params.pageSize||30
        }
    })
}
export {
    getHotKolList,
    followKol,
    unfollowKol,
    unfollowAll,
    getFollowKolList,
    getTwitterList,
    getKolFilters,
    getTwitterById,
    getAllFollowIds,
    getKolProfile,
    getTwitterByAuthor,
    getNews
}