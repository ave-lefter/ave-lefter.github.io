import { getNews} from '~/api/twitter'
export default function useNews(props:{newsAudio:any,activeParentTab:any,isPaused:any}) {
  const walletStore = useWalletStore()
  const {lang,audioSettings} = storeToRefs(useGlobalStore())
  const trackerStore = useTwitterTrackerStore()
  // const globalStore = useGlobalStore()
  const dataSource=shallowRef([] as Array<any>)
  let Timer:null|ReturnType<typeof setTimeout>=null
  let originDataSource:Array<any>=[]
  let firstId=''
  let needUpdate = false
  const paginationParams= shallowRef({pageNO: 1,pageSize: 15})

  watch(
    () => props.activeParentTab.value,
    (val) => {
      if(val===2){
        if(!props.isPaused.value){
          paginationParams.value.pageNO = 1
          needUpdate=false
          getList()
        }
      }
    }
  )
  watch(
    () => props.isPaused.value,
    (val) => {
      if(!val){
        if(needUpdate&& (props.activeParentTab.value===2)){
          paginationParams.value.pageNO = 1
          needUpdate=false
          getList()
        }
      }
    }
  )
  onMounted(() => {
    getList()
    if(Timer){
      clearInterval(Timer)
      Timer=null
    }else{
      Timer=setInterval(() => {
        getList(true)
      },5*1000*60)
      // },5*1000)
    }
  })
  onUnmounted(() => {
    if(Timer){
      clearInterval(Timer)
      Timer=null
    }
  })
  useVisibilityChange(() => {
    getList()
  })
  watch(() => lang.value.includes('zh'), () => {
    paginationParams.value.pageNO = 1
    getList()
  })
  function play() {
    if (props.newsAudio.value && audioSettings.value.audio.news) {
      props.newsAudio.value.play()
    }
  }
  const groupByDay = (timestamps: any[], key: string = 'created_at') => {
    console.log('groupByDay', key)
    const grouped = timestamps.reduce((acc: Record<string, number[]>, i: any, index) => {
      const timestamp = i[key]
      // 将时间戳转换为日期对象
      const date = new Date(timestamp * 1000) // 时间戳是秒，转换为毫秒
      // const dateString = date.toString().split('T')[0]; // 获取 YYYY-MM-DD 格式的日期字符串
      const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      // 使用本地时区格式化日期
      const dateString = date.toLocaleString('sv-SE', { timeZone: localTimeZone }).split(' ')[0]
      const formattedDate = dateString.replace(/-/g, '/')
      // 如果日期字符串不存在于累加器中，则初始化一个数组
      if (!acc[formattedDate]) {
        acc[formattedDate] = []
      }
      // 将时间戳添加到对应日期的数组中
      acc[formattedDate].push(i)
      return acc
    }, {})
    // return Object.keys(grouped).map(date => ({
    //   time: date,
    //   arr: grouped[date]
    // }));
    const result = []
    for (const date in grouped) {
      result.push(date, ...grouped[date])
    }
    return result
  }
  const getList= async (needCheck:boolean=false) => {
    if(trackerStore.loading2 || trackerStore.finished2) return
    trackerStore.loading2 = true
    const lang1=lang.value.includes('zh')?'zh':'en'
    try {
      const res = await getNews({
        userAddress:walletStore.address,
        lang:lang1,
        ...paginationParams.value,
        ...(needCheck?{pageNO:1}:{})
      })
      const list = res?.list || []
      if (Array.isArray(list) && list?.length > 0) {
        const formatList = list.filter(item => item?.content?.items?.[0]?.legacy&&item?.content?.items?.[0]?.legacy?.title).map(item => {
            return {
              id:item.id,
              created_at:item.created_at,
              source:item.source,
              url:item.url,
              title:item?.content?.items?.[0]?.legacy?.title,
              full_text:item?.content?.items?.[0]?.legacy?.full_text
            }
          }).sort((a,b) => b.created_at - a.created_at)
        if(needCheck){
          if(firstId && formatList?.[0]?.id !== firstId){
            play()
            if(props.isPaused.value || (props.activeParentTab.value!==2)){
              needUpdate = true
            }else{
              needUpdate = false
              originDataSource= [...formatList]
              dataSource.value=groupByDay(originDataSource)
              trackerStore.finished2 = list?.length < paginationParams.value.pageSize
              trackerStore.loading2 = false
              if (!trackerStore.finished2) {
                paginationParams.value.pageNO++
              }
            }
          }
          firstId = formatList?.[0]?.id
        }else{
          if(paginationParams.value.pageNO === 1){
            originDataSource= [...formatList]
            dataSource.value=groupByDay(originDataSource)
            firstId= formatList?.[0]?.id
          }else{
            originDataSource.push(...formatList)
            dataSource.value=groupByDay(Array.from(new Set(originDataSource.map(item => item.id)))
              .map(id => originDataSource.find(item => item.id === id)).sort((a,b) => b.created_at - a.created_at))
          }
          trackerStore.finished2 = list?.length < paginationParams.value.pageSize
          trackerStore.loading2 = false
          if (!trackerStore.finished2) {
            paginationParams.value.pageNO++
          }
        }
      } else{
        if(paginationParams.value.pageNO  === 1) {
          dataSource.value = []
        }
        trackerStore.finished2 = true
      }
      console.log('trackerStore.finished2', needUpdate)
      // trackerStore.finished2 = list.length < 10
    } catch (error) {
      console.error('Error fetching Twitter2 tracker list:', error)
    } finally {
      trackerStore.loading2 = false
    }
  }

  return { dataSource, getList }
}
