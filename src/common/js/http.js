import Taro from '@tarojs/taro'
import { url } from './config'
import { showTips } from './util'

export function get(intefaceName) {
    return new Promise((resolve, reject) => {
      Taro.request({
        url: url + intefaceName
      }).then(res => {
        Taro.hideLoading()
        if (res.data.success) {
          resolve(res.data)
        } else {
          reject()
        }
      })
    })
}
/**
 * @param {接口名称} intefaceName 
 * @param {参数对象} data 
 * @param {是否只传递默认data数据} pure 
 */
export function post(intefaceName, data, pure) {
  return new Promise ((resolve,reject) => {
    data = pure ? data : {data: data,token: Taro.getStorageSync('token') || '1111'}
    Taro.request({
      url: url + intefaceName,
      method: 'POST',
      data,
      header: {
          'content-type': 'application/json'
        }
    }).then(res => {
      Taro.hideLoading()
      if (res.data.issuccess) {
        res.data.result && res.data.result.Token && Taro.setStorageSync('token', res.data.result.Token)
        resolve(res.data)
      } else {
        //所有失败的情况
        if(res.data.statuscode == 403) { //请求TOKEN校验失效
          Taro.navigateTo({url: '../../pages/login/login'})
        } else {
          showTips(res.data.message)
        }
        reject()
      }
    })
  })
  
}