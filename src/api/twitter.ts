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

export {
    getHotKolList,
    followKol,
    unfollowKol,
    unfollowAll,
    getFollowKolList,
    getTwitterList,
    getKolFilters,
    getTwitterById,
    getAllFollowIds
}