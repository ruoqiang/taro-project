import Taro, { Component } from '@tarojs/taro'

import { View, ScrollView, Picker } from '@tarojs/components'
import * as HTTP from '../../common/js/http'
import { getNowDate } from '../../common/js/util'
import TipsStatus from '../../base/tipsStatus/tipsStatus'
import Loading from '../../base/loading/loading'

import './record-car.styl'

let pageSize = 10
export default class RecordCar extends Component{
    config = {
        navigationBarTitleText: '选择车辆'
    }
    constructor(props) {
        super(props)
        this.state = {
            recordList: [],
            defaultDate: getNowDate(-7),
            defaultDate2: getNowDate(),
            imgHeight: '200px'
        }
        this.btnDisable = false
        this.codeBtnDisable = false
        
        let carListInfo =  JSON.parse(Taro.getStorageSync('carListInfo'))
        this.carNo =  carListInfo && carListInfo.CarNum //"贵A566N5" //
        this.hasMore = true
        this.page = 0
    }
    // refRecordImg = (node) => this.refRecordImg = node
    componentDidMount() {
        Taro.showLoading({ title: '加载中' })
        this.loadMore(true)
        setTimeout(()=> { //dom渲染好了去计算
            this.getScrollViewHeiht()
        }, 50)
    }
    getScrollViewHeiht() {
        let that = this
        //滚动容器高度：页面容器高度 - 图片部分的高度
        Taro.getSystemInfo({
          success: function (res) {
            var query = Taro.createSelectorQuery()
            //选择id
            query.select('.record-img').boundingClientRect(function (rect) {
              let reactHeight = parseInt(rect.height)
              that.setState({
                imgHeight: (res.windowHeight - reactHeight - 10) + 'px'
              })
            }).exec()
          }
        })
      }
    loadMore(isFirst) {
        console.log(this.hasMore)
        if (isFirst) { //如果是第一项加载
            this.page = 0
            this.hasMore = true
            this.setState({recordList: []})
        }
        if (!this.hasMore) {
           return
         }
         this.page++
         console.log(this.page)
        
         var _params = {
             CarNo: this.carNo,
             outTimeBefore: this.state.defaultDate + ' 00:00:00', //this.defaultDate,
             outTimeAfter: this.state.defaultDate2 + ' 23:59:59',
             pageHelp: {
               "CurrentPage": this.page, //当前页
               "PageSize": pageSize //每页显示行数
             }
         }
         var that = this
         
         HTTP.post('Main/QueryConsumeDetailNew', _params).then((res)=> {
            if (res.issuccess) {
                   if (res.result.ConsumeDetail === null) res.result.ConsumeDetail = []
                    that.setState({recordList: that.state.recordList.concat(res.result.ConsumeDetail)})
                    that.checkMore(res.result)
                    // that.scroll.current.refresh()
                    setTimeout(() => {
                        that.setState({ajaxLoaingShow: false})
                    }, 500)
                 } else {
                    return false
                 }
         })
      }
    checkMore(data) {
        if (!data.ConsumeDetail.length || (data.pageHelp.PageSize + (data.pageHelp.CurrentPage - 1) * pageSize) >= data.pageHelp.AllCount) {
            this.hasMore = false
        }
    }
    searchListClick() {
        let validateDate = this.validateDate(this.state.defaultDate, this.state.defaultDate2)
        if (!validateDate) {
            alert('开始日期不能大于结束日期')
            return
        }
        this.loadMore(true)
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
    validateDate(date1, date2) {
        let newdate1 = new Date(date1).getTime()
        let newdate2 = new Date(date2).getTime()
        return newdate1 - newdate2 > 0 ? 0 : 1
    }
    formateDate(val) {
        return val ? val.replace('T', ' ') : ''
    }
    //滚动到底部是触发
    onScrollToLower() {
        console.log('onScrollToLower')
        setTimeout(() => {
            this.loadMore()
        }, 100)
    }
    back() {
        Taro.navigateTo({url: '/pages/index/index'})
    }
    onDateChange = e => {
        let date = e.detail.value
        if(Taro.getEnv() === 'WEB') {
            date = `${e.detail.value[0]}-${e.detail.value[1]}-${e.detail.value[2]}`
        }
        this.setState({
            defaultDate: date
        })
      }
    onDateChangeTwo = e => {
        let date = e.detail.value
        if(Taro.getEnv() === 'WEB') {
            date = `${e.detail.value[0]}-${e.detail.value[1]}-${e.detail.value[2]}`
        }
        this.setState({
            defaultDate2: date
        })
    }
    render() {
        return (
            <View id='record-car'>
                <View className='record-img' >
                <View className='record-time-span'>
                    <View className='span-title'>
                    出站时间段
                    </View>
                    <View className='time-span'>
                    <View className='time span picker'><Picker className='date' mode='date' value={this.state.defaultDate} onChange={this.onDateChange}> <View className='picker'>{this.state.defaultDate}</View></Picker></View>
                    <View className='text span'>至</View>
                    <View className='time span picker'><Picker className='date' mode='date' value={this.state.defaultDate2} onChange={this.onDateChangeTwo}> <View className='picker'>{this.state.defaultDate2}</View></Picker></View>
                    </View>
                    <View className='btn' onClick={this.searchListClick.bind(this)}>
                        <View className='buttonBox' style={{marginTop: '25px'}}>
                                <View className={'button ' + (this.state.btnDisable ? 'disable': '')}>
                                    查询
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className='record-list-box-wrap' ref={this.recordListBoxWrap} style={{height:this.state.imgHeight}} >
                <View id='record-list'>
                        <View className='h20'></View>
                        <ScrollView className='ScrollView' scrollY onScrollToLower={this.onScrollToLower.bind(this)} lowerThreshold={20}>
                            <View className='record-list-box hasBj'>
                            {this.state.recordList.map((item,index)=> {
                                return (
                                    <View className='record-list' key={index}>
                                        <View className='record-list-title'>
                                            <View className='div'>通行费用  </View>
                                            <View className='div cost'>￥{item.consumeMoney}</View>
                                        </View>
                                        <View className='record-list-info'>
                                        <View className='in-out-list'>
                                            <View className='go-site'>进站名：<View className='span'>{item.inStation}</View> </View>
                                            <View className='go-time'>{this.formateDate(item.inTime)}</View>
                                        </View>
                                        <View className='in-out-list'>
                                            <View className='go-site'>出站名：<View className='span'>{item.outStation}</View> </View>
                                            <View className='go-time'>{this.formateDate(item.outTime)}</View>
                                        </View>
                                        </View>
                                    </View>
                                ) 
                            })}
                            {/*  注意这里可以依赖 this.hasMore对view层进行状态显示的更新 是因为this.hasMore发生变化的时候
                            还有其他this.state.xx数据发生变动 导致的数据更新触发的view成更新-----this.hasMore沾光了*/}
                           {
                               (this.hasMore && this.state.recordList.length > 0) ?(
                                <View className='dataTipsBtnBox'>
                                    <View className='seeMore'>
                                        <View className='span'>
                                            <View className='loadingBox'>
                                            {this.hasMore && (<Loading title='' size='20'></Loading>)}
                                            </View>
                                            加载更多记录
                                        </View>
                                    </View>
                                </View>
                               ):null
                           }
                           {
                               (!this.hasMore && this.state.recordList.length > 0) ? (
                                <View className='dataTipsBtnBox' >
                                <View className='seeMore noMore' v-show='!hasMore'>
                                <View className='span'>没有更多记录了</View>
                                </View>
                            </View>
                               ): null
                           }
                            {(this.state.recordList.length ===0) ? (
                                <View className='tipsStatusBox1' >
                                    <TipsStatus buttonHide title='没有记录'></TipsStatus>
                                </View>
                            ):null}
                        </View>
                    </ScrollView>
                    </View>
                    {
                        this.state.mask ? (
                            <View className='ajaxLoaing' >
                                {/* <Loading  title='加载中。。。。'></Loading> */}
                            </View> 
                        ): null
                    }
                    <View className='ajaxLoaing' style={{display: this.state.ajaxLoaingShow? 'block': 'none'}}>
                        <Loading title=''></Loading>
                    </View>
                </View>
                {
                    this.state.backTopShow ? (<View className='icon-top' onClick={this.backTop}></View>) : null
                }
                
                {
                    this.state.mask ? (<View className='mask'></View>) : null
                }
            </View>
        )
    } 
}