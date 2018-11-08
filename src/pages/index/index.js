import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Swiper, SwiperItem, Image } from '@tarojs/components'
import * as HTTP from '../../common/js/http'
import './index.styl'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      list: []
    }
  }
  componentWillMount () { }

  componentDidMount () { 
    // this.tokenCheck()
  }
  tokenCheck() {
    // Taro.showLoading({ title: '加载中' })
    let params = {
      token: Taro.getStorageSync('token') || '1111'
    }
    HTTP.post('SubInfo/CheckStep', params, true).then(()=> {
      // Taro.navigateTo({url: '/pages/index/index'})
      Taro.hideLoading()
    })
  }
  goToNext(url) {
    Taro.navigateTo({url: url})
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  onScroll (event) {
    // console.log(event );
    
  }
  onScrollToLower() {
      console.log('onScrolltoupper');
      
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
                    <Image className='img' src={require('../../common/image/icon-ETC.png')} alt='' onClick={this.goToNext.bind(this,'/pages/login/login')} />
                    <View className='p'>办理ETC</View>
                </View>
                <View className='card-item'>
                    <Image className='img' src={require('../../common/image/icon-applyRecord.png')} alt='' onClick={this.goToNext.bind(this,'/pages/application-record-list/application-record-list')} />
                    <View className='p'>申请记录</View>
                </View>
                <View className='card-item'>
                    <Image className='img' src={require('../../common/image/icon-bill.png')} alt='' onClick={this.goToNext.bind(this,'/pages/select-car/select-car')} />
                    <View className='p'>账单查询</View>
                </View>
                <View className='card-item'>
                    <Image className='img' src={require('../../common/image/icon-applyRecord.png')} alt='' />
                    <View className='p'>申请记录</View>
                </View>
            </View>
        </View>
        <View className='lineSplit'></View>
        <View className='h2'>新闻资讯</View> 
        <ScrollView
          className='scrollview'
          scrollX
          scrollWithAnimation
          scrollTop='0'
          style='height: 150px;'
          lowerThreshold='20'
          upperThreshold='20'
          onScrollToLower={this.onScrollToLower.bind(this)}
          onScroll={this.onScroll.bind(this)} >
          <View style={{display: 'flex'}}>
            <View className='actionSlide' ref={this.actionSlideCon}>
                <View className='p'><Image className='img' src={require('../../common/image/action001.png')} alt='' /></View>
                <View className='p no-padding' ><Image className='img' src={require('../../common/image/action002.png')} alt='' /></View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

