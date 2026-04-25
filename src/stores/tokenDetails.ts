export const useTokenDetailsStore = defineStore('tokenDetailsStore', () => {
  const drawerVisible = ref(false)
  const tokenInfo = ref<{
    id: string;
    symbol: string;
    logo_url: string;
    chain: string;
    address: string;
    remark: string;
    total: string;
    lock_amount_dec: string;
    other_amount_dec: string;
    burn_amount_dec: string;
  }>()
  const pairInfo = ref<{
    target_token: string;
    token0_address: string;
    token0_symbol: string;
    token1_symbol: string;
    pairAddress: string;
  }>()
  const user_address = ref('')
  
  return {
    drawerVisible,
    tokenInfo,
    pairInfo,
    user_address
  }
})
