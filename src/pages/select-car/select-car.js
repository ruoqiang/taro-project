import Taro, { Component } from '@tarojs/taro'

import { View, Image, ScrollView } from '@tarojs/components'
import * as HTTP from '../../common/js/http'
import TipsStatus from '../../base/tipsStatus/tipsStatus'
import './select-car.styl'

export default class selectCar extends Component{
    config = {
        navigationBarTitleText: '选择车辆'
    }
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            carInfoList: []
        }
        this.btnDisable = false
        this.codeBtnDisable = false
    }
    componentDidMount() {
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
            this.setState({
                isLoading: false
            })
        })
    }
    selectCarGotoPage(item) {
        let _type = this.type
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
                {
                    this.state.carInfoList.length > 0 && (<View>
                        <View className='select-car-title'>请先选择要查询的车辆 </View>
                            <View className='h80'></View>
                            <View className='form-box' ref={this.formBox}>
                                <ScrollView ref={this.scroll}>
                                    <View className=''>
                                    {
                                        this.state.carInfoList.map((item,idx) => {
                                            return (
                                                <View className='car-list' key={idx} onClick={this.selectCarGotoPage.bind(this,item)}>
                                                    <View className='car-img'>
                                                        <Image className='img' src={require('./img01.png')} alt='' />
                                                    </View>
                                                    <View className='car-number'>{item.CarNum}</View>
                                                    <View className='icon-more'>&gt;</View>
                                                </View>
                                            )
                                        })
                                    }
                                    </View>
                                </ScrollView>
                            </View>
                    </View>)
                }
                    
                { 
                    (this.state.carInfoList.length <= 0 && !this.state.isLoading ) && (
                        <View className='tips-status-box'>
                            <View className='ptc'>
                                <TipsStatus statusClass='no-record' title='您暂时还没有办理ETC的车辆哦~' text='办理ETC' onBtnClick={this.back.bind(this)}></TipsStatus>
                            </View>
                        </View>
                    )
                }
            </View>
        )
    } 
}