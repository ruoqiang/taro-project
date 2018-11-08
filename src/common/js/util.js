import Taro from '@tarojs/taro'

export function shuffle(arr) {
 let _arr = arr.slice()
 for (let i = 0; i < _arr.length; i++) {
   let j = getRandomIn(0, i)
   let t = _arr[i]
   _arr[i] = _arr[j]
   _arr[j] = t
 }
 return _arr
}

function getRandomIn(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
//throttle的作用是在用户动作时没隔一定时间（如200ms）执行一次回调。   或者 当持续触发事件时，保证隔间时间触发一次事件
//debounce的作用是在让在用户动作停止后延迟x ms再执行回调。 或者 当持续触发事件时，debounce会合并事件且不会去触发事件，当一定时间内没有触发再这个事件时，才真正去触发事件～
//总结
// 他们两个的共同点就是将多次回调的触发合并成一次执行。这就大大避免了过于频繁的事件回调操作  
//或者 。两者间的核心区别就在于持续触发事件时，前者合并事件并在最后时间去触发事件，而后者则是隔间时间触发一次～
//使用场景
//debounce用在keydown事件上验证用户名最好。而throttle用在resize改变布局上

export function debounce(fn, delay) { //每次执行的时候判断timer是否有值，有值则clearTimeout清空定时器，并且重新开启定时器，直到delay时间内没有触发事件时才会真正执行事件的回调。
  let timer
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
export function getNowDate(addDayCount) {
  var AddDayCount = addDayCount || 0
  var nowDate = new Date()
  // var newDate = new Date()
  nowDate.setDate(nowDate.getDate() + AddDayCount)
  var year = nowDate.getFullYear()
  var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
   : nowDate.getMonth() + 1
  var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
   .getDate()
  var dateStr = year + "-" + month + "-" + day
  console.log(dateStr)
  return dateStr
}
export function myAlert(msg) {
  if(Taro.getEnv() === 'WEB') { //WEB：h5环境 WEAPP：微信环境
    alert(msg)
  } else {
    console.log(msg)
  }
}
export function showTips (msg) {
  Taro.showModal({
      showCancel: false,
      title: '提示',
      content: msg
  })
}