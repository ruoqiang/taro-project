import React, { Component} from 'react'
import Scroll from 'base/scroll/scroll'
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux'
import { actionCreators } from '../home/store';
import axios from 'common/js/http'
import Confirm from 'base/confirm/confirm'
import { url } from 'common/js/config'
import HeadStep from 'base/head-step/head-step'
import { toObject } from 'immutable'
import { setToken } from 'common/js/cache'
import './userInfo.styl'

class userBaseInfo extends Component{
    constructor() {
        super()
        this.state = {
            isSelf: true,
            sex: '1',
            btnDisable: false
        }
        this.scroll = React.createRef()
        this.confirm = React.createRef()
        this.submitInfo= this.submitInfo.bind(this)
        this.switchSelf = this.switchSelf.bind(this)
        this.switchSex = this.switchSex.bind(this)
        
    }
    componentWillMount () {
        console.log('componentWillMount');
        // this.props.getUserBaseInfo()
    }
    componentDidMount () {
        console.log('componentDidMount');
        this.props.getUserBaseInfo()
        
        // console.log('componentDidMount--' ,(this.props.apply).toObject());
        // this.newApply = this.props.apply && (this.props.apply).toObject()
        // if (this.newApply) {
        //     this.setState({isSelf: this.newApply.IsOwnerApply})
        //     this.setState({sex: this.newApply.Sex})
        //     this.isSelf = this.newApply['IsOwnerApply']
        //     this.sex = this.newApply['Sex']
        // }
    }
    shouldComponentUpdate (nextProps, nextState) {
        console.log(nextProps);
        let _apply = nextProps.apply
        console.log(_apply.get('Name'));
        this.scroll.current.refresh()
        this.newApply = this.props.apply && (this.props.apply).toObject()
        if (this.newApply) {
            // this.setState({isSelf: this.newApply.IsOwnerApply})
            // this.setState({sex: this.newApply.Sex})
            this.isSelf = this.newApply['IsOwnerApply']
            this.sex = this.newApply['Sex']
        }
        console.log(this.isSelf);
        // if (nextState.isSelf !==this.state.isSelf) {
        //     return true
        // } else {
        //     return false
        // }
        return true
    }
    submitInfo () {
        let param = {
            Name: this.name.value,
            IDNumber: this.iDNumber.value,
            Phone: this.moblie.value,
            Inviter: this.inviteMoblie.value,
            CarOwnerName: (this.carOwnerName && this.carOwnerName.value) || '',
            CarOwnerIDNum: (this.carOwnerIDNum && this.carOwnerIDNum.value) || '',
            CarOwnerPhone: (this.carOwnerPhone && this.carOwnerPhone.value) || '',
            isSelf :this.isSelf,
            Sex: this.sex
        }
        
        if (param.Name === '') {
            this.setState({tipsText:'请输入姓名'})
            this.refs.confirm.show()
            return
          }
          if (param.IDNumber === '') {
            this.setState({tipsText:'请输入身份证号码'})
            this.refs.confirm.show()
            return
          }
          var iDNumberReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          if (!iDNumberReg.test(param.IDNumber)) {
            this.setState({tipsText:'请输入正确格式的身份证号码'})
            this.refs.confirm.show()
            return
          }
          if (param.Phone === '') {
            this.setState({tipsText:'请输入手机号码'})
            this.refs.confirm.show()
            return
          }
          if (!/1[3|4|5|7|8]\d{9}/.test(param.Phone)) {
            this.setState({tipsText:'请输入正确手机号码'})
            this.refs.confirm.show()
            return
          }
          console.log(param)
          
        if (!param.isSelf) {
            if (!param.CarOwnerName) {
                this.setState({tipsText:'请输入车主姓名'})
                this.refs.confirm.show()
                return
            }
            if (!param.CarOwnerIDNum) {
                this.setState({tipsText:'请输入车主身份证号'})
                this.refs.confirm.show()
                return
            }
            if (!iDNumberReg.test(param.CarOwnerIDNum)) {
                this.setState({tipsText:'请输入正确格式的身份证号码'})
                this.refs.confirm.show()
                return
            }
            if (!param.CarOwnerPhone) {
                this.setState({tipsText:'请输入车主手机号'})
                this.refs.confirm.show()
                return
            }
        }
        let params = {
            Step: 1,
            CCustomerApply: param
          }
        let that = this
        this.setState({btnDisable: true})
        axios({ method: 'post',
            url: url + 'SubInfo/UserAndCar',
            data: params
        }).then((res) => {
            if (res.data.issuccess) {
                console.log(that.props);
                this.setState({btnDisable: false})
                that.props.getUserBaseInfo()
                that.props.history.push('/userCarInfo')
            } else {
                that.setState({
                    tipsText: res.data.message,
                    btnDisable: false
                })
                that.refs.confirm.show()
            }
        })
    }
    switchSelf(val) {
        this.isSelf = val
        console.log(this.isSelf);
        this.setState({isSelf: val}) //只有prop或者state变化了view才会更新，因此我们加了一个触发页面更新的字段isSelf在state中，
    }
    switchSex (val) {
        this.sex = val
        this.setState({sex: val}) // 用来辅助更新view的
    }
    render() {
        console.log('render');
        return (
            <div id="user-baseinfo">
                <Scroll ref={this.scroll}>
                        <div className="wrapper">
                            <HeadStep step={1}></HeadStep>
                            <div className="form-box">
                                <div className="inputBox padType2">
                                    <div className="input size-2 align-2">
                                        <h2>申请人信息</h2>
                                    </div>
                                </div>
                                <div className="inputBox padType2">
                                    <div className="input size-2 align-2"><label>姓名</label> 
                                    <input type="text" name="" placeholder="请输入姓名"  maxLength="13" defaultValue={this.newApply && this.newApply['Name']} ref={(input) => {this.name = input}}/></div>
                                </div>
                                <div className="inputBox padType2">
                                    <div className="input size-2 align-2">
                                        <label>性别</label>
                                        <div className="sex-box"><span className={this.sex=== '1' ? 'active' : ''} onClick={() =>this.switchSex('1')}></span><b onClick={() =>this.switchSex('1')}>男</b> <span className={this.sex==='0' ? 'active' : ''} onClick={() =>this.switchSex('0')}></span><b onClick={() =>this.switchSex('0')}>女</b></div>
                                    </div>
                                </div>
                                <div className="inputBox padType2">
                                    <div className="input size-2 align-2">
                                        <label>身份证号</label>
                                        <input type="text" name="" placeholder="请输入身份证号" defaultValue={this.newApply && this.newApply['IDNumber']} maxLength="18" ref={(input) => {this.iDNumber = input}}/>
                                    </div>
                                </div>
                                <div className="inputBox padType2">
                                    <div className="input size-2 align-2">
                                        <label>手机号</label> <input type="tel" name="" placeholder="请输入手机号" defaultValue={this.newApply && this.newApply['Phone']} maxLength="11" ref={(input) => {this.moblie = input}}/>
                                    </div>
                                </div>
                                <div className="inputBox padType">
                                    <div className="input size-2 align-2">
                                        <label>邀请码（选填）</label>
                                        <input type="tel" name="" placeholder="请输入邀请码" maxLength="11" defaultValue={this.newApply && this.newApply['Inviter']} ref={(input) => {this.inviteMoblie = input}}/>
                                    </div>
                                </div>
                            </div>
                            <div className="h10"></div>
                            <div className="form-box">
                                <div className="inputBox padType2">
                                    <div className="input size-2 align-2">
                                        <label>是否为申请人本人车辆</label>
                                        <div className="sex-box self-box">
                                            <span className={this.isSelf=== true ? 'active' : ''} onClick={() =>this.switchSelf(true)}></span><b onClick={() => this.switchSelf(true)}>是</b> <span className={this.isSelf=== false ? 'active' : ''} onClick={() =>this.switchSelf(false)}></span><b onClick={() =>this.switchSelf(false)}>否</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h10"></div>
                                <div className="form-box" style={{display: this.isSelf ? 'none' : 'block'}}>
                                    <div className="inputBox padType2">
                                        <div className="input size-2 align-2">
                                            <h2>车主信息</h2>
                                        </div>
                                    </div>
                                    <div className="inputBox padType2">
                                        <div className="input size-2 align-2"><label>车主姓名</label> <input type="text" name="" placeholder="请输入车主姓名" defaultValue={this.newApply && this.newApply['CarOwnerName']} ref={(input) => {this.carOwnerName = input}} maxLength="10" /></div>
                                    </div>
                                    <div className="inputBox padType2">
                                        <div className="input size-2 align-2">
                                            <label>车主身份证号</label>
                                            <input type="text" name="" placeholder="请输入车主身份证号" defaultValue={this.newApply && this.newApply['CarOwnerIDNum']} ref={(input) => {this.carOwnerIDNum = input}} maxLength="18" />
                                        </div>
                                    </div>
                                    <div className="inputBox padType">
                                        <div className="input size-2 align-2">
                                            <label>手机号</label>
                                            <input type="tel" name="" placeholder="请输入手机号码" defaultValue={this.newApply && this.newApply['CarOwnerPhone']} ref={(input) => {this.carOwnerPhone = input}} maxLength="11" />
                                        </div>
                                    </div>
                                </div>
                            <div className="buttonBox">
                                <div className={'button ' + (this.state.btnDisable ? "disable": "")} onClick={this.submitInfo}>
                                    下一步
                                </div>
                            </div>
                            <div style={{height: '40px'}}>
                            </div>
                        </div>
                </Scroll>
                <Confirm text={this.state.tipsText} confirmType='2' ref="confirm"></Confirm>
            </div>
            
        )
    }
}
const mapState = (state) => ({
    userApplyStepList: (state.getIn(['home','userApplyStepList'])),
    apply: (state.getIn(['home','userApplyStepList','apply']))
})

const mapDispatch = (dispatch) => ({
	changeHomeData() {
		dispatch(actionCreators.getHomeInfo());
    },
    getUserBaseInfo() {
		dispatch(actionCreators.getUserBaseInfo());
	}
});
export default withRouter(connect(mapState, mapDispatch)(userBaseInfo));