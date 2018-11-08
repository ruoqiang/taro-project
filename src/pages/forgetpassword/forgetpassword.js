import Taro, { Component } from '@tarojs/taro'

import { View, Input, Text } from '@tarojs/components'
import * as HTTP from '../../common/js/http'
import { showTips } from '../../common/js/util'
import '../login/login.styl'

export default class forgetPassword extends Component{
    config = {
        navigationBarTitleText: '忘记密码'
    }
    constructor(props) {
        super(props)
        this.state = {
            inputType: 'password',
            isOpen: false,
            mobile: '',
            password: '',
            code: '',
            codeBtnText: '发送验证码',
            codeBtnDisable: false, //修复微信端下 jsx中this.codeBtnDisable状态更新无效问题
            btnDisable: true
        }
        this.btnDisable = false
        this.codeBtnDisable = false
    }
    componentDidMount() {
        let _mobile = Taro.getStorageSync('mobile')
        _mobile && this.setState({mobile: _mobile})
    }
    handleMobileChange (e) {
        this.setState({
            mobile: e.target.value
        })
    }
    handlCodeChange(e) {
        this.setState({
            code: e.target.value
        })
    }
    handlePassWordChange(e) {
        this.setState({
            password: e.target.value
        })
    }
    switchEye () {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }), ()=> {
            this.state.isOpen ? this.setState({inputType: 'text'}) : this.setState({inputType: 'password'})
        })
    }
    getCode(mobile) {
        if (mobile === '') {
            showTips('请输入手机号码')
            return
        }
        if (!/1[3|4|5|7|8]\d{9}/.test(mobile)) {
            showTips('请输入正确手机号码')
            return
        }
        this.codeBtnDisable = true
        if(Taro.getEnv() === 'WEAPP') {
            this.setState({codeBtnDisable: true}) //修复微信端下 jsx中this.codeBtnDisable状态更新无效问题
        }
        this.postVcode(mobile)
        let total = 9
        this.setState({codeBtnText: `${total}秒`})
        this.timer = setInterval(() => {
          --total
          this.setState({codeBtnText: `${total}秒`})
          if (total <= 0) {
            clearInterval(this.timer)
            this.setState({codeBtnText: `发送验证码`})
            this.codeBtnDisable = false
            if(Taro.getEnv() === 'WEAPP') {
                this.setState({codeBtnDisable: false}) //修复微信端下 jsx中this.codeBtnDisable状态更新无效问题
            }
          }
        }, 1000)
      }
      postVcode(mobile) {
        var params = {
              Phone: mobile
        }
        var that = this
        HTTP.post('ComService/PostVcode', params).then((res)=> {
            // 成功后
            if(res.issuccess) {
                that.setState({tipsText: res.message})
            } else {
                that.codeBtnDisable = false
                clearInterval(that.timer)
                this.setState({codeBtnText: `发送验证码`})
                return
            }
        })
      }
    login() {
        let params = {
            Identifier:this.state.mobile,
            Credential:this.state.password
        }
        if (params.Identifier === '') {
            showTips('请输入手机号码')
            return
          }
          if (!/1[3|4|5|7|8]\d{9}/.test(params.Identifier)) {
            showTips('请输入正确手机号码')
            return
          }
          if (params.Credential === '') {
            showTips('请输入密码')
            return false
          }
          console.log(this.state.tipsText)
        HTTP.post('Login/UserLogin', params).then(()=> {
            // 成功后
            Taro.navigateTo({url: '/pages/index/index'})
        })
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('nextState', nextState);
        if (nextState.mobile && (/1[3|4|5|7|8]\d{9}/.test(nextState.mobile)) && nextState.password && nextState.code ) {
            this.btnDisable = true
        } else {
            this.btnDisable = false
            // return false  //注意这里千万不要return false ，这样的话组件就不会更新，看不到界面上更新的效果
        }
        return true
    }
    render() {
        return (
            <View>
                <View className='title'>忘记密码</View> 
                <View className='inputBox padType'>
                    <View className='input'>
                        <Text className='label'>手机号</Text>
                        <Input className='inputt' type='tel' placeholder='请输入手机号' maxLength='11' value={this.state.mobile} onChange={this.handleMobileChange.bind(this)} />
                    </View>
                </View> 
                <View className='inputBox padType'>
                    <View className='input'>
                        <Text className='label'>验证码</Text>
                        <Input className='inputt' placeholder='请输入密码'  maxLength='6' type='number' value={this.state.code}  onChange={this.handlCodeChange.bind(this)} /> <View className={'send-smg-code ' + (this.codeBtnDisable ? 'disable' : '')}  onClick={this.getCode.bind(this,this.state.mobile)}>{this.state.codeBtnText}</View>
                    </View>
                </View>
                <View className='inputBox padType'>
                    <View className='input'>
                        <Text className='label'>密&nbsp;&nbsp;&nbsp;&nbsp;码</Text>
                        <Input className='inputt' placeholder='请输入密码' maxLength='16' type={this.state.inputType} value={this.state.password} onChange={this.handlePassWordChange.bind(this)} />
                         <View className={'eye ' + (this.state.isOpen ? 'open' : '')} onClick={this.switchEye.bind(this)}></View>
                    </View>
                </View>
                <View className='buttonBox '>
                        <View className={'button ' + (this.btnDisable ? '': 'disable')} onClick={this.login.bind(this)}>
                        确定
                        </View>
                </View> 
            </View>
        )
    }
}