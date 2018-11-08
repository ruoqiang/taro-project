import React, { Component } from 'react'
import Scroll from 'base/scroll/scroll'
import axios from 'common/js/http'
import { url } from 'common/js/config'
import Loading from 'base/loading/loading'
import TipsStatus from 'base/tipsStatus/tipsStatus'
import './application-record-list.styl'
class ApplicationRecordList extends Component {
    constructor() {
        super()
        this.state = {
            loadingHide: false,
            ApplyInfoList: []
        }
        this._btnClick = this._btnClick.bind(this)
        this.scroll = React.createRef()
        this.loading = React.createRef()
        this.formCheckStatus = this.formCheckStatus.bind(this)
        this.calStatusBtn = this.calStatusBtn.bind(this)
        this.back = this.back.bind(this)
    }
    _btnClick() {}
    componentDidMount() {
       this.getUserApplyInfo()
    }
    getUserApplyInfo() {
        ///SubInfo/CheckStep
        var _params = {
          data: {}
        }
        var that = this
        axios({ method: 'post',
                url: url + 'SubInfo/QueryApply', //代理跨域之后可以/Test/PostToken或者http://localhost:8080/Test/PostToken
                data: _params
                })
                .then(function (res) {
                    console.log('response2223:', res)
                    if (res.data.issuccess) {
                        that.setState({ApplyInfoList: res.data.result})
                    //   that.ApplyInfoList = res.data.result //[]
                   that.setState({loadingHide: true})
                    that.scroll.current.refresh()
                      console.log(that.ApplyInfoList.length)
                    } else {
                       // alert(res.data.message)
                       return false
                    }
                })
                .catch(function (error) {
                    console.log(error)
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
      back() {
        this.props.history.push('/userBaseInfo')
      }
      destroy() {
        this.$refs.scroll.destroy()
        // console.log('destroy')
      }
    render() {
        return(
            <div id="userUpload">
            <div className="userUploadContent" ref="userUploadContent">
                <Scroll v-show="ApplyInfoList.length>0" ref={this.scroll}>
                <div >
                    {this.state.ApplyInfoList.map((item,index)=>{
                        return (
                            <div className="list-box-wrap" key={index}>
                                <div className="list-box">
                                <div className="list-car-info">
                                    <p><span>申请人 </span><span>{(item.Name).slice(0,13)}</span></p>
                                
                                    {/* .slice(0,13) */}
                                    <p><span>车牌号</span><span>{item.CarNum}</span></p>
                                    <p><span>车牌颜色</span><span>{item.CarColor}</span><span v-show="item.CarColor.length===1">牌</span></p>
                                
                                </div>
                                <div className={"status-btn "+ this.calStatusBtn(item.CheckStatus)}>
                                    {this.formCheckStatus(item.CheckStatus)}
                                </div>
                                </div>
                            </div>
                        )
                    })}
                   
                    <div className="h15"></div>
                </div>
                </Scroll>
            </div>
            {
                this.state.ApplyInfoList.length <= 0 && (
                    <div className="tips-status-box">
                        <div className="ptc">
                        <TipsStatus statusClass="no-record" title="暂时还没有申请记录" text="办理ETC" btnClick={this.back}></TipsStatus>
                        </div>
                    </div>
                )
            }
            <div className="loading-box" style={{display: this.state.loadingHide ? 'none': 'block'}}>
                 <Loading title="数据加载中..." ref={this.loading}></Loading>
            </div>
            
         </div>
            )
    }
}
export default ApplicationRecordList