import Taro from '@tarojs/taro'
import { ADD, MINUS, GET_BASE_INFO } from '../constants/counter';

const INITIAL_STATE = {
  num: 0,
  userApplyStepList: Taro.getStorageSync('__userApplyStep__') || {}
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        num: state.num + 1
      };
    case MINUS:
      return {
        ...state,
        num: state.num - 1
      };
    case GET_BASE_INFO:
      return {
        ...state,
        userApplyStepList: action.userApplyStepList
      };
    default:
      return state;
  }
}