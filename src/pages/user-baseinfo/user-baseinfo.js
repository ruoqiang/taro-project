import Taro, { Component } from '@tarojs/taro'
import { View, Input, ScrollView, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as HTTP from '../../common/js/http'
import { showTips } from '../../common/js/util'
import HeadStep from '../../base/head-step/head-step'
import './userInfo.styl'
import '../login/login.styl' //微信端样式不能复用login中的样式，需要再次引用一次

import { getUserBaseInfo } from '../../store/actions/counter'
@connect(({ counter }) => ({
    counter
}), (dispatch) => ({
  getUserBaseInfo() {
		dispatch(getUserBaseInfo())
	}
}))

export default class userBaseInfo extends Component{
    config = {
        navigationBarTitleText: '选择车辆'
    }
    constructor(props) {
        super(props)
        this.state = {
            isSelf: true,
            sex: '1',
            btnDisable: false
        }
        this.forms = {}
    }
    componentDidShow() {
        // console.log('this', this.props.counter.userApplyStepList)
        this.newApply = this.props.counter.userApplyStepList && this.props.counter.userApplyStepList.apply
        if (this.newApply) {
            this.isSelf = this.newApply['IsOwnerApply'] || true
            this.sex = this.newApply['Sex'] || '1'
            this.setState({isSelf: this.isSelf}) // 用来辅助更新view的
            this.forms = this.newApply
        }
    }
    handleInputChange(keywords, e) { //该方式会导致界面上输入框的值，第一次在修改state下的单选按钮状态时 刷新页面丢失数据
        this.forms[keywords] = e.target.value
    }
    submitInfo () {
        let param = {
            Name: this.forms.Name || '',
            IDNumber: this.forms.IDNumber || '',
            Phone: this.forms.Phone || '',
            Inviter: this.forms.Inviter || '',
            CarOwnerName: this.forms.CarOwnerName || '',
            CarOwnerIDNum: this.forms.CarOwnerIDNum || '',
            CarOwnerPhone: this.forms.CarOwnerPhone || '',
            isSelf :this.isSelf || true,
            Sex: this.sex || '1'
        }
        if (param.Name === '') {
            return showTips('请输入姓名')
          }
          if (param.IDNumber === '') {
            return showTips('请输入身份证号码')
          }
          var iDNumberReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          if (!iDNumberReg.test(param.IDNumber)) {
            return showTips('请输入正确格式的身份证号码')
          }
          if (param.Phone === '') {
            return showTips('请输入手机号码')
          }
          if (!/1[3|4|5|7|8]\d{9}/.test(param.Phone)) {
            return showTips('请输入正确手机号码')
          }
        if (!param.isSelf) {
            if (!param.CarOwnerName) {
                return showTips('请输入车主姓名')
            }
            if (!param.CarOwnerIDNum) {
                return showTips('请输入车主车主身份证号')
            }
            if (!iDNumberReg.test(param.CarOwnerIDNum)) {
                return showTips('请输入正确格式的车主身份证号码')
            }
            if (!param.CarOwnerPhone) {
                return showTips('请输入车主手机号')
            }
        }
        let params = {
            Step: 1,
            CCustomerApply: param
        }
        this.setState({btnDisable: true})
        let that = this
        Taro.showLoading({ title: '提交中..' })
        HTTP.post('SubInfo/UserAndCar', params).then(()=> {
            this.setState({btnDisable: false})
            // 成功后
            that.props.getUserBaseInfo()
            Taro.navigateTo({url: '/pages/user-carinfo/user-carinfo'})
        }).catch(()=> {
            this.setState({btnDisable: false})
        })
    }
    switchSelf(val) {
        this.isSelf = val
        this.setState({isSelf: val}) //只有prop或者state变化了view才会更新，因此我们加了一个触发页面更新的字段isSelf在state中，
    }
    switchSex (val) {
        this.sex = val
        this.setState({sex: val}) // 用来辅助更新view的
    }
    render() {
        return (
            <View id='user-baseinfo'>
                <ScrollView ref={this.scroll}>
                    <HeadStep step={1}></HeadStep>
                        <View className='form-box'>
                            <View className='form-list'>
                                    <View className='form-title'>申请人信息</View>
                            </View>
                            <View className='form-list'>
                                <Text className='label'>姓名</Text> 
                                <Input type='text' className='input' placeholder='请输入姓名'  maxLength='13'  value={this.newApply && this.newApply['Name']}  onChange={this.handleInputChange.bind(this,'Name')} />
                            </View>
                            <View className='form-list'>
                                <Text className='label'>性别</Text>
                                    <View className='sex-box'>
                                        <View className={this.sex=== '1' ? 'active span' : 'span'} onClick={this.switchSex.bind(this,'1')}></View><View className='b'>是</View> <View className={this.sex=== '0' ? 'active span' : 'span'} onClick={this.switchSex.bind(this,'0')}></View><View  className='b'>否</View>
                                    </View>
                            </View>
                            <View className='form-list'>
                                <Text className='label'>身份证号</Text> 
                                <Input type='text' className='input' placeholder='请输入身份证号'  maxLength='18' value={this.newApply && this.newApply['IDNumber']} onChange={this.handleInputChange.bind(this,'IDNumber')} />
                            </View>
                            <View className='form-list'>
                                <Text className='label'>手机号</Text> 
                                <Input type='text' className='input' placeholder='请输入手机号'  maxLength='11' value={this.newApply && this.newApply['Phone']} onChange={this.handleInputChange.bind(this,'Phone')} />
                            </View> <View className='form-list'>
                                <Text className='label'>邀请码（选填）</Text> 
                                <Input type='text' className='input' placeholder='请输入邀请码'  maxLength='13' value={this.newApply && this.newApply['Inviter']} />
                            </View>
                        </View>
                        <View className='h10'></View>
                        <View className='form-box'>
                            <View className='form-list'>
                                <Text className='label'>是否为申请人本人车辆</Text>
                                    <View className='sex-box self-box'>
                                        <View className={this.isSelf=== true ? 'active span' : 'span'} onClick={this.switchSelf.bind(this,true)}></View><View className='b'>是</View> <View className={this.isSelf=== false ? 'active span' : 'span'} onClick={this.switchSelf.bind(this,false)}></View><View  className='b'>否</View>
                                    </View>
                            </View>
                        </View>
                        <View className='h10'></View>
                        <View className='form-box' style={{display: this.isSelf ? 'none' : 'block'}}>
                            <View className='form-list'>
                                    <View className='form-title'>车主信息</View>
                            </View>
                            <View className='form-list'>
                                <Text className='label'>车主姓名</Text> 
                                <Input type='text' className='input' placeholder='请输入车主姓名'  maxLength='13' value={this.newApply && this.newApply['CarOwnerName']}  onChange={this.handleInputChange.bind(this,'CarOwnerName')} />
                            </View>
                            <View className='form-list'>
                                <Text className='label'>车主身份证号</Text> 
                                <Input type='text' className='input' placeholder='请输入车主身份证号'  maxLength='18' value={this.newApply && this.newApply['CarOwnerIDNum']}  onChange={this.handleInputChange.bind(this,'CarOwnerIDNum')} />
                            </View>
                            <View className='form-list'>
                                <Text className='label'>手机号</Text> 
                                <Input type='text' className='input' placeholder='请输入手机号'  maxLength='11' value={this.newApply && this.newApply['CarOwnerPhone']}  onChange={this.handleInputChange.bind(this,'CarOwnerPhone')} />
                            </View>
                        </View>
                        <View className='buttonBox'>
                            <View className={'button ' + (this.state.btnDisable ? 'disable': '')} onClick={this.submitInfo.bind(this)}>
                                 下一步
                            </View>
                        </View>
                        <View style={{height: '40px'}}>
                        </View>
            </ScrollView>
            </View>
        )
    } 
}