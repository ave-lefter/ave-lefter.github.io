export interface IResponseHotTwitterList<T> {
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

function getHotTwitterList(query:{
     cursor?:string
    keyword?:string
    tags?:string
}):Promise<IResponseHotTwitterList<{following_at:  string;}>> {
    const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/hot', {
        method: 'get',
        query
      })
}

function getFollowList(query:{
    cursor?:string
    keyword?:string
    tags?:string
}):Promise<IResponseHotTwitterList<{follow_status:0|1}>>{
    const {$api}  = useNuxtApp()
    return $api('/v2api/twitter/v1/kol/follow/list', {
        method: 'get',
        query
      })
}

function getTwitterList(query:{
    cursor_time:string
    cursor_tweet_id:string
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

export {
    getHotTwitterList,
    followKol,
    unfollowKol,
    unfollowAll,
    getFollowList,
    getTwitterList
}