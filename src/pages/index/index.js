import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, ScrollView, Swiper, SwiperItem, Image } from '@tarojs/components'
import * as HTTP from '../../common/js/http'

import { add, minus, asyncAdd, getUserBaseInfo } from '../../store/actions/counter'

import './index.styl'

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  },
  getUserBaseInfo(cb) { //注意这个 如果下面需要使用回调函数的话，必须这里也要传递一下 跟原生react的redux，react-redux不一样
		dispatch(getUserBaseInfo(cb)) 
	}
}))

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props)
  }
  tokenCheck() {
    let params = {
      token: Taro.getStorageSync('token') || '1111'
    }
    HTTP.post('SubInfo/CheckStep', params, true).then(()=> {
      Taro.hideLoading()
    }).catch((err)=> {
      console.log('catch', err);
    })
  }
  goToNext(url) {
    this.props.getUserBaseInfo(function(){ /* eslint-disable-line */
      Taro.navigateTo({url: url})
    })
  }
  render () {
    return (
      <View className='index'>
      <View className='slider-wrapper'>
        <Swiper
          className='slider-wrapper'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          interval='3000'
          autoplay
           >
            <SwiperItem classNam='slider-item'>
            <Image src={require('../../common/image/banner.png')} alt='' style={{width: '100%'}} />
            </SwiperItem>
            <SwiperItem classNam='slider-item'>
            <Image src={require('../../common/image/banner2.png')} alt='' style={{width: '100%'}} />
            </SwiperItem>
            <SwiperItem classNam='slider-item'>
            <Image src={require('../../common/image/banner3.png')} alt='' style={{width: '100%'}} />
            </SwiperItem>
        </Swiper>
        
      </View>
      <View className='card-box-wrap'>
            <View className='card-box'>
                <View className='card-item'>
                    <Image className='img' src={require('../../common/image/icon-ETC.png')} alt='' onClick={this.goToNext.bind(this,'/pages/user-baseinfo/user-baseinfo')} />
                    <View className='p'>办理ETC</View>
                </View>
                <View className='card-item'>
                    <Image className='img' src={require('../../common/image/icon-applyRecord.png')} alt='' onClick={this.goToNext.bind(this,'/pages/application-record-list/application-record-list')} />
                    <View className='p'>申请记录</View>
                </View>
                <View className='card-item'>
                    <Image className='img' src={require('../../common/image/icon-bill.png')} alt='' onClick={this.goToNext.bind(this,'/pages/select-car/select-car?type=1')} />
                    <View className='p'>账单查询</View>
                </View>
                <View className='card-item'>
                    <Image className='img' src={require('../../common/image/icon-applyRecord.png')} alt='' onClick={this.goToNext.bind(this,'/pages/select-car/select-car?type=2')} />
                    <View className='p'>申请记录</View>
                </View>
            </View>
        </View>
        <View className='lineSplit'></View>
        <View className='h2'>新闻资讯{this.props.counter.num}</View> 
        <ScrollView
          className='scrollview'
          scrollX
          scrollWithAnimation
          scrollTop='0'
          style='height: 150px;'
          lowerThreshold='20'
          upperThreshold='20'
           >
          <View style={{display: 'flex'}}>
            <View className='actionSlide' ref={this.actionSlideCon}>
                <View className='p'><Image className='img' src={require('../../common/image/action001.png')} alt='' onClick={this.props.add} /></View>
                <View className='p no-padding' ><Image className='img' src={require('../../common/image/action002.png')} alt='' onClick={this.props.getUserBaseInfo} /></View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

