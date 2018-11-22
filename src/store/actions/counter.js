import Taro from '@tarojs/taro'
import { ADD, MINUS, GET_BASE_INFO } from '../constants/counter';
import * as HTTP from '../../common/js/http'

export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}
const changeUserBaseInfo = (result) => ({ //修改数据状态
	type: GET_BASE_INFO,
	userApplyStepList: result
})
export const getUserBaseInfo = (cb) => { //异步去服务器获取数据
	return (dispatch) => {
        let _params = {
          token: Taro.getStorageSync('token')
        }
        HTTP.post('SubInfo/CheckStep', _params, true).then((res)=> {
          // 成功后
          const result = res.result;
          dispatch(changeUserBaseInfo(result))
          Taro.setStorageSync('__userApplyStep__', result) //把数据储存到本地，以便页面刷新后初始化去本地去取
          cb && cb()
         })
	}
}
// 异步的action
export function asyncAdd() {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}