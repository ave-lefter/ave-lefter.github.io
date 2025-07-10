// get user favorite group
interface GetUserFavoriteGroupsResponse {
  group_id: number;
  fav_count?: number;
  type?: string;
  name: string;
  show_index?: number;
}

function getUserFavoriteGroups(address: string): Promise<GetUserFavoriteGroupsResponse[] | []> {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v3/tokens/favorite/${address}/groups`, {
    method: 'get',
  })
}

interface GetFavListResponse {
  token: string;
  chain: string;
  symbol: string;
  current_price_usd: number;
  price_change: string;
  price_change_v2: number;
  token_index: number;
  favorite_price: number;
  open_price: number;
  total: number;
  lock_amount: number;
  burn_amount: number;
  other_amount: number;
  risk_score: number;
  opening_at: number;
  logo_url: string;
  monitored: boolean;
  swap_url: string;
  is_swap_supported: number;
  tx_volume_u_24h: number;
  tx_count_24h: number;
  pool_size: number;
  remark?: string;
}

// Get user favorite tokens
function getFavoriteList(group = -1, pageNO = 1, address: string): Promise<GetFavListResponse[]> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v4/tokens/favorite', {
    method: 'get',
    query: {
      address: address,
      group: group,
      pageNO: pageNO,
      pageSize: 50
    }
  })
}


// update user favorite tokens group
function moveFavoriteGroup(tokenId: string, group: number, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/move', {
    method: 'post',
    body: {
      address: address,
      token_id: tokenId,
      group
    }
  })
}

// change user favorite tokens
function changeFavoritesIndex(token1: string, token2: string, group = 0, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/changeIndex', {
    method: 'post',
    body: {
      address: address,
      group,
      token1,
      token2
    }
  })
}

// set top favorite token
function changeFavoritesTop(token: string, group = 0, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/setTop', {
    method: 'post',
    body: {
      address: address,
      token,
      group
    }
  })
}

// edit remark
function editTokenFavRemark(tokenId: string, remark: string, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/editRemark', {
    method: 'post',
    body: {
      token: tokenId,
      remark,
      address
    }
  })
}

function changeFavoriteGroupName(name: string, group: number, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/group/update', {
    method: 'post',
    body: {
      address,
      name,
      group
    }
  })
}

function setTopFavoriteGroup(group: number, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/group/setTop', {
    method: 'post',
    body: {
      address,
      group
    }
  })
}

function changeIndexFavoriteGroup(group1: number, group2: number, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/group/changeIndex', {
    method: 'post',
    body: {
      address,
      group1,
      group2
    }
  })
}

function removeFavoriteGroup(group: number, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/group/delete', {
    method: 'post',
    body: {
      address,
      group
    }
  })
}

function addFavoriteGroup(name: string, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/group/add', {
    method: 'post',
    body: {
      address,
      name
    }
  })
}
function getFavoriteCheck(token_id: string, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/checkfavoritev2', {
    method: 'get',
    params: {
      token_id,
      address,
    },
  })
}

function addFavorite(token_id: string, address: string, group?: 0, remark?: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/add', {
    method: 'post',
    body: {
      token_id,
      address,
      group,
      remark,
    },
  })
}
function removeFavorite(
  token_id: string,
  address: string
) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/favorite/delete', {
    method: 'post',
    body: {
      token_id,
      address
    },
  })
}
function getCheckFavoriteGroup(token_id: string, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/tokens/checkfavoritegroup', {
    method: 'get',
    params: {
      token_id,
      address,
    },
  })
}

function getNewFavoriteList(query: any): Promise<GetFavListResponse[]> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v4/tokens/favorite', {
    method: 'get',
    query
  })
}

function getRemarksDetail(query: any): Promise<GetFavListResponse[]> {
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_remarks/v1/remarks_detail', {
    method: 'get',
    query
  })
}


export {
  getUserFavoriteGroups,
  getFavoriteList,
  moveFavoriteGroup,
  changeFavoritesIndex,
  changeFavoritesTop,
  editTokenFavRemark,
  changeFavoriteGroupName,
  setTopFavoriteGroup,
  changeIndexFavoriteGroup,
  removeFavoriteGroup,
  addFavoriteGroup,
  getFavoriteCheck,
  addFavorite,
  removeFavorite,
  getCheckFavoriteGroup,
  getNewFavoriteList,
  getRemarksDetail,
}
export type { GetUserFavoriteGroupsResponse, GetFavListResponse }
