const waring = new Set()

export default {
  legacy: false,
  fallbackLocale: 'en',
  // messages 是可选的，因为启用了 lazy
  missing(locale,key,vm,values){
    waring.add(key)
    setTimeout(()=>{
      console.log(waring,"warning",[...waring].join(" "))
    },1000)
  }
}
