import React, { Component } from 'react'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import TipsStatus from 'base/tipsStatus/tipsStatus'
import axios from 'common/js/http'
import { url } from 'common/js/config'
import { getNowDate } from 'common/js/util'
import DatePicker from 'base/date-picker/date-picker'
import './record-car.styl'
let pageSize = 10
class RecordCar extends Component {
    constructor() {
        super()
        this.state = {
            btnDisable: false,
            mask: false,
            backTopShow: false,
            ajaxLoaingShow: true,
            recordList: []
        }
        this._btnClick = this._btnClick.bind(this)
        this.scroll = React.createRef()
        this.recordListBoxWrap = React.createRef()
        this.recordImg = React.createRef()
        this.backTop = this.backTop.bind(this)
        this.onScroll = this.onScroll.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this._checkMore = this._checkMore.bind(this)
        this.onPullup = this.onPullup.bind(this)
        this.formateDate = this.formateDate.bind(this)
        
        let carListInfo = JSON.parse(localStorage.getItem('carListInfo'))
        this.carNo =  carListInfo && carListInfo.CarNum //"贵A566N5" //
        this.hasMore = true
        this.page = 0
        /*date-picker*/
        this.selectedDateFn = this.selectedDateFn.bind(this)
        this.selectedDateFnStart = this.selectedDateFnStart.bind(this)
        this.selectedDateFnEnd = this.selectedDateFnEnd.bind(this)
        
        this.defaultDate = getNowDate(-30)
        this.defaultDate2 = getNowDate()
    }
    componentDidMount() {
        var _height = this.recordImg.current.clientHeight
        var _boxHeight = window.innerHeight
        this.recordListBoxWrap.current.style.height = `${_boxHeight - _height}px`
        this.recordListBoxWrap.current.style.marginTop = `15px`
        this.loadMore(true)
    }
    onPullup() {
        console.log('onPullup');
        this.loadMore()
    }

    _btnClick (){
    let validateDate = this.validateDate(this.defaultDate, this.defaultDate2)
      if (!validateDate) {
        // this.$refs.topTips.show()
        alert('开始日期不能大于结束日期')
        return
      }
      this.loadMore(true)
      this.setState({ajaxLoaingShow: true})
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
             outTimeBefore: this.defaultDate + ' 00:00:00', //this.defaultDate,
             outTimeAfter: this.defaultDate2 + ' 23:59:59',
             pageHelp: {
               "CurrentPage": this.page, //当前页
               "PageSize": pageSize //每页显示行数
             }
         }
         var that = this
         axios({ method: 'post',
                 url: url + 'Main/QueryConsumeDetailNew',
                 data: _params
                 })
                 .then(function (res) {
                     if (res.data.issuccess) {
                    //    that.recordList = that.recordList.concat(res.data.result.ConsumeDetail)
                       if (res.data.result.ConsumeDetail ===null) res.data.result.ConsumeDetail = []
                       that.setState({recordList: that.state.recordList.concat(res.data.result.ConsumeDetail)})
                       that._checkMore(res.data.result)
                       that.scroll.current.refresh()
                       setTimeout(() => {
                        that.setState({ajaxLoaingShow: false})
                      }, 500)
                     } else {
                        return false
                     }
                 })
                 .catch(function (error) {
                     console.log(error)
                 })
      }
      _checkMore(data) {
          if (!data.ConsumeDetail.length || (data.pageHelp.PageSize + (data.pageHelp.CurrentPage - 1) * pageSize) >= data.pageHelp.AllCount) {
            this.hasMore = false
          }
        }
    onScroll (pos) {
        // console.log(pos)
        if (pos.y < -160) {
            this.setState({backTopShow: true})
          } else {
            this.setState({backTopShow: false})
          }
    }
    backTop() {
        // this.refs.scroll.scrollTo(0, 0, 500) //ref="scroll"
        this.scroll.current.scrollTo(0, 0, 500) //ref={this.scroll}
    }
    validateDate(date1, date2) {
        let newdate1 = new Date(date1).getTime()
        let newdate2 = new Date(date2).getTime()
        return newdate1 - newdate2 > 0 ? 0 : 1
      }
      formateDate(val) {
        return val ? val.replace('T', ' ') : ''
      }
      selectedDateFn(val) {
        console.log(val);
        
      }
      selectedDateFnStart (val) {
        this.defaultDate = val
        console.log(this.defaultDate);
        // this.setState({defaultDate: val})
      }
      selectedDateFnEnd (val) {
        this.defaultDate2 = val
        console.log(this.defaultDate2);
      }
    render(){
        return(
            <div id="record-car">
                <div className="record-img" ref={this.recordImg}>
                <div className="record-time-span">
                    <div className="span-title">
                    出站时间段
                    </div>
                    <div className="time-span">
                    <span className="time"><DatePicker defaultDate={this.defaultDate} selectedDateFn={this.selectedDateFnStart}></DatePicker></span>
                    <span className="text">至</span>
                    <span className="time"><DatePicker defaultDate={this.defaultDate2} selectedDateFn={this.selectedDateFnEnd}></DatePicker></span>
                    </div>
                    <div className="btn" onClick={this._btnClick}>
                        <div className="buttonBox" style={{marginTop: '25px'}}>
                                <div className={'button ' + (this.state.btnDisable ? "disable": "")}>
                                    查询
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="record-list-box-wrap" ref={this.recordListBoxWrap} style={{height: '360px'}}>
                <div id="record-list">
                        <Scroll ref={this.scroll} isOverflowHidden probeType={3} listenScroll={true} onScroll={this.onScroll} pullup={true} onPullup={this.onPullup}>
                            <div className="record-list-box hasBj">
                            {this.state.recordList.map((item,index)=> {
                                return (
                                    <div className="record-list" key={index}>
                                        <div className="record-list-title">
                                        <div className="">通行费用  </div>
                                        <div className="cost">￥{item.consumeMoney}</div>
                                        </div>
                                        <div className="record-list-info">
                                        <div className="in-out-list">
                                            <div className="go-site">进站名：<span>{item.inStation}</span> </div>
                                            <div className="go-time">{this.formateDate(item.inTime)}</div>
                                        </div>
                                        <div className="in-out-list">
                                            <div className="go-site">出站名：<span>{item.outStation}</span> </div>
                                            <div className="go-time">{this.formateDate(item.outTime)}</div>
                                        </div>
                                        </div>
                                    </div>
                                ) 
                            })}
                            {/*  注意这里可以依赖 this.hasMore对view层进行状态显示的更新 是因为this.hasMore发生变化的时候
                            还有其他this.state.xx数据发生变动 导致的数据更新触发的view成更新-----this.hasMore沾光了*/}
                           {
                               (this.hasMore && this.state.recordList.length > 0) ?(
                                <div className="dataTipsBtnBox">
                                    <div className="seeMore">
                                    <span>
                                        <div className="loadingBox">
                                        <Loading v-show="hasMore" title="" size="20"></Loading>
                                    </div>
                                    加载更多记录</span>
                                    </div>
                                </div>
                               ):null
                           }
                           {
                               (!this.hasMore && this.state.recordList.length > 0) ? (
                                <div className="dataTipsBtnBox" >
                                <div className="seeMore noMore" v-show="!hasMore">
                                <span>没有更多记录了</span>
                                </div>
                            </div>
                               ): null
                           }
                            <div style={{height:'16px'}}></div>
                            {(this.state.recordList.length ===0) ? (
                                <div className="tipsStatusBox1" >
                                    <TipsStatus buttonHide title={'没有记录'}></TipsStatus>
                                </div>
                            ):null}
                        </div>
                    </Scroll>
                    </div>
                    {
                        this.state.mask ? (
                            <div className="ajaxLoaing" >
                                <Loading  title="加载中。。。。"></Loading>
                            </div> 
                        ): null
                    }
                    <div className="ajaxLoaing" style={{display: this.state.ajaxLoaingShow? 'block': 'none'}}>
                        <Loading title=""></Loading>
                    </div>
                </div>
                {
                    this.state.backTopShow ? (<div className="icon-top" onClick={this.backTop}></div>) : null
                }
                
                {
                    this.state.mask ? (<div className="mask" ref="mask"></div>) : null
                }
                
            </div>
        )
    }
}
export default RecordCar