import Taro, { Component } from '@tarojs/taro'

import { View, Image, ScrollView } from '@tarojs/components'
import * as HTTP from '../../common/js/http'
import TipsStatus from '../../base/tipsStatus/tipsStatus'
import '../select-car/select-car.styl'

export default class Bill extends Component{
    config = {
        navigationBarTitleText: '选择车辆'
    }
    constructor(props) {
        super(props)
        this.state = {
            carInfoList: []
        }
        this.btnDisable = false
        this.codeBtnDisable = false
    }
    componentDidShow() {
        console.log('this.$router.params', this.$router)
        console.log('this', this)
        this.$router.params
        Taro.showLoading({ title: '加载中' })
        let params = {
            token: Taro.getStorageSync('token')
        }
        HTTP.post('SubInfo/QueryWirteCard', params, true).then((res)=> {
            // 成功后
            Taro.hideLoading()
            this.setState({
                carInfoList: res.result
            })
        })
    }
    selectCarGotoPage(item) {
        let _type = this.$router.params.type
        Taro.setStorageSync('carListInfo', JSON.stringify(item))
        //还款记录
        if (_type === '1') {
            Taro.navigateTo({url: '/pages/bill/bill'})
        }
        //通行记录 
        if (_type === '2') {
          Taro.navigateTo({url: '/pages/recordCar/recordCar'})
        }
      }
    back() {
        Taro.navigateTo({url: '/pages/index/index'})
    }
    render() {
        return (
            <View id='select-car'>
                <View className='tipsStatusBox1' style={{paddingTop: '0px'}}>
                        <TipsStatus buttonHide title='没有账单记录'></TipsStatus>
                </View>
            </View>
        )
    } 
}