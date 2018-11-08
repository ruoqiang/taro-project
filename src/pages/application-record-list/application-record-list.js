import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import * as HTTP from '../../common/js/http'
import './application-record-list.styl'

export default class ApplicationRecordList extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props)
    this.state = {
      ApplyInfoList: []
    }
  }
  componentDidMount() {
    this.getUserApplyInfo()
  }
  getUserApplyInfo() {
    Taro.showLoading({ title: '加载中' })
    let params = {token: Taro.getStorageSync('token') || '1111'}
    HTTP.post('SubInfo/QueryApply', params, true).then((res)=> {
      console.log('res', res);
      this.setState({ApplyInfoList: res.result})
      Taro.hideLoading()
    })
  }
  formCheckStatus(val) {
    if (val === "-1") {
      return '待申请'
    }
    if (val === "0") return '审核中'
    if (val === "1") return '审核成功'
    if (val === "2") return '审核失败'
    if (val === "3") return '审核中' //人工介入中 -->审核中
    if (val === "4") return '已注销'
  }
  calStatusBtn (val) {
    if (val === "1" || val === "3") {
      return 'success'
    }
    if (val === "-1" || val === "2" || val === "4") {
      return 'fail'
    }
  }
  render() {
      return (
          <View className='userUpload'>
              <ScrollView ref={this.scroll}>
                <View >
                    {this.state.ApplyInfoList.map((item,index)=>{
                        return (
                            <View className='list-box-wrap' key={index}>
                                <View className='list-box'>
                                <View className='list-car-info'>
                                    <View className='p'><Text className='span'>申请人 </Text><Text>{(item.Name).slice(0,13)}</Text></View>
                                    <View className='p'><Text className='span'>车牌号</Text><Text>{item.CarNum}</Text></View>
                                    <View className='p'><Text className='span'>车牌颜色</Text><Text>{item.CarColor}</Text>{item.CarColor.length > 1 ? null : <Text>牌</Text>}</View>
                                
                                </View>
                                <View className={'status-btn '+ this.calStatusBtn(item.CheckStatus)}>
                                    {this.formCheckStatus(item.CheckStatus)}
                                </View>
                                </View>
                            </View>
                        )
                    })}
                   
                    <View className='h15'></View>
                </View>
                </ScrollView>
          </View>
      )
  }
}