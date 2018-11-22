import React, { Component } from "react"
import Scroll from 'base/scroll/scroll'
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux'
import { actionCreators } from '../home/store';
import axios from 'common/js/http'
import Confirm from 'base/confirm/confirm'
import { url } from 'common/js/config'
import HeadStep from 'base/head-step/head-step'
import { toObject, toJS } from 'immutable'
import AreaPicker from 'base/area-picker/area-picker'
import TipsStatus from 'base/tipsStatus/tipsStatus'
import '../user-baseinfo/userInfo.styl'
class UserAddAdress extends Component {
    constructor() {
        super()
        this.state = {
            btnDisable: false,
            tipsStatusFlag: false
        }
        this.nextPage = this.nextPage.bind(this)
        this.endOneLoop = this.endOneLoop.bind(this)
        this.back = this.back.bind(this)
    }
    componentWillMount () {
        console.log('componentWillMount');
        
    }
    componentDidUpdate(prevProps, prevState) {
        // console.log('componentDidUpdate prevProps' + JSON.stringify(prevProps));
        // console.log('componentDidUpdate prevState' + prevState);
    }
    componentDidMount () {
        console.log('componentDidMount');
        this.props.getUserBaseInfo()
        this.newApply = this.props.apply && (this.props.apply).toObject()
        if (this.newApply) {
            this.setState({isSelf: this.newApply.IsOwnerApply})
            this.setState({sex: this.newApply.Sex})
            this.isSelf = this.newApply['IsOwnerApply']
            this.sex = this.newApply['Sex']
        }
    }
    nextPage() {
        if (this.ConName.value === '') {
          this.setState({tipsText:'请输入收货人姓名'})
          this.refs.confirm.show()
          return false
        }
        if (this.ConPhone.value === '') {
          this.setState({tipsText:'请输入手机号码'})
          this.refs.confirm.show()
          return false
        }
        if (!/1[3|4|5|7|8]\d{9}/.test(this.ConPhone.value)) {
          this.setState({tipsText:'请输入正确手机号码'})
          this.refs.confirm.show()
          return false
        }
        if (!this.DetailAddress.value) {
          this.setState({tipsText:'请输入详细地址'})
          this.refs.confirm.show()
          return false
        }
        this.btnDisable = true
        var _params = {
          Step: 4,
          CCustomerAddr: {
            "ConName": this.ConName.value,
            "ConPhone": this.ConPhone.value,
            "AllAddress": this.defaultArea,
            "DetailAddress": this.DetailAddress.value,
            "Relation": "11111"
          }
        }
        var that = this
        this.tipsText = ''
        axios({ method: 'post',
                url: url + 'SubInfo/UserAndCar',
                data: _params
                })
                .then(function (res) {
                    if (res.data.issuccess) {
                      that.endOneLoop()
                      that.btnDisable = false
                    } else {
                       that.setState({tipsText: res.data.message})
                       that.refs.confirm.show()
                       that.btnDisable = false
                       return false
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
      }
      endOneLoop() { //结束一轮操作清空数据
        var that = this
        var _params = {
          Relation: this.props.apply && this.props.apply.get('Relation')
        }
        axios({
            method: 'post',
            url: url + 'SubInfo/CompSub',
            data: _params
          })
          .then(function(res) {
            if (res.data.issuccess) {
            //   that.tipsStatusFlag = true
              that.setState({tipsStatusFlag: true})
              that.props.getUserBaseInfo()
              that.btnDisable = false
            } else {
              alert(res.data.message)
              that.btnDisable = false
              return false
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      }
      selectedAreaFnParent(val) {
        console.log('selectedAreaFnParent---', val);
        this.defaultArea = val
      }
      back() {
        this.props.history.push('/')
        this.setState({tipsStatusFlag: false})
      }
    render(){
        this.newApply = this.props.apply && (this.props.apply).toObject()
        this.address = this.props.address && (this.props.address).toObject()
        this.defaultArea = (this.address && (`${this.address['Province']} ${this.address['City']} ${this.address['Town']}`))
            return(

                <div id="user-baseinfo">
                <Scroll ref={this.scroll}>
                    <div className="wrapper">
                        <HeadStep step={4}></HeadStep>
                        <div className="form-box">
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2">
                                    <h2>收货地址</h2>
                                </div>
                            </div>
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2">
                                    <label>收货人</label>
                                    <input type="text" name="" placeholder="请输入发动机号" 
                                    defaultValue={this.address && this.address['ConName']}
                                     maxLength="18" ref={(input) => {this.ConName = input}}/>
                                </div>
                            </div>
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2">
                                    <label>手机号</label>
                                    <input type="text" name="" placeholder="请输入发动机号" defaultValue={this.address && this.address['ConPhone']} maxLength="11" ref={(input) => {this.ConPhone = input}}/>
                                    
                                </div>
                            </div>
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2">
                                    <label>所在地区</label>
                                    {/* <input type="text" defaultValue={(this.newApply && this.newApply['CarColor']) || this.info.carColor}  ref={this.selectColorInput} readOnly="readOnly"/> */}
                                    <div className="selectedAreaWrap">
                                        <AreaPicker defaultArea={this.defaultArea} selectedAreaFn={this.selectedAreaFnParent.bind(this)}></AreaPicker>
                                    </div>
                                     <div className="icon-more"></div>
                                </div>
                            </div>
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2">
                                    <label>详细地址</label>
                                    <input type="text" name="" placeholder="请输入发动机号" defaultValue={this.address && this.address['DetailAddress']} maxLength="18" ref={(input) => {this.DetailAddress = input}}/>
                                </div>
                            </div>
                        </div>
                        <div className="h10"></div>
                        <div className="buttonBox">
                            <div className={'button ' + (this.state.btnDisable ? "disable": "")} onClick={this.nextPage}>
                                    下一步
                            </div>
                        </div>
                        <div style={{height: '40px'}}></div>
                    </div>
                </Scroll>
                <Confirm text={this.state.tipsText} confirmType='2' ref="confirm"></Confirm>
                {
                    this.state.tipsStatusFlag ? (
                        <div className="tips-status-box">
                            <div className="ptc">
                                <TipsStatus text="返回首页" btnClick={this.back}></TipsStatus>
                            </div>
                        </div>
                    ) : null
                }
                
            </div>
            )
    }
}
const mapState = (state) => ({
    userApplyStepList: (state.getIn(['home', 'userApplyStepList'])),
    apply: (state.getIn(['home', 'userApplyStepList', 'apply'])),
    address:(state.getIn(['home', 'userApplyStepList', 'address']))
})

const mapDispatch = (dispatch) => ({
	changeHomeData() {
		dispatch(actionCreators.getHomeInfo())
    },
    getUserBaseInfo() {
		dispatch(actionCreators.getUserBaseInfo())
	}
})
export default withRouter(connect(mapState, mapDispatch)(UserAddAdress))
