export function _getConversationId(data: {
  chain_id: number
  contract_address: string
}): Promise<{ data: { cid: string } }> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v1/ave_proxy/debox/openapi/chatwidget/conversation/id', {
    method: 'post',
    body: data,
  })
}
