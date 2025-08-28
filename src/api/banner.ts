export interface Banner {
  picture_link: string
  render_link: string
}
export function _getBannersAll(): Promise<Banner[]> {
  const { $api } = useNuxtApp()
  return $api('/v2api/banner/v1/all', {
    method: 'get',
    headers: { 'Ave-Platform': 'web' },
  })
}
