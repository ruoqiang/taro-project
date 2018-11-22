import Taro, { Component } from '@tarojs/taro'

import { View, Input, Text } from '@tarojs/components'
import * as HTTP from '../../common/js/http'
import { showTips } from '../../common/js/util'
import './login.styl'

export default class Login extends Component{
    config = {
        navigationBarTitleText: '登录'
    }
    constructor(props) {
        super(props)
        this.state = {
            inputType: 'password',
            isOpen: false,
            mobile: '',
            password: '',
            btnDisable: true //微信环境中应该会编译为data下 jsx中的this.btnDisable
        }
        this.btnDisable = false //h5环境中的 jsx中的this.btnDisable
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
    goToPage(url) {
        Taro.navigateTo({url: url})
        Taro.setStorageSync('mobile', this.state.mobile)
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
        HTTP.post('Login/UserLogin', params).then(()=> {
            // 成功后
            Taro.navigateBack({url: '/pages/index/index'})
        })
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.mobile && (/1[3|4|5|7|8]\d{9}/.test(nextState.mobile)) && nextState.password ) {
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
                <View className='title'>用户登录</View> 
                <View className='inputBox padType'>
                    <View className='input'>
                        <Text className='label'>手机号</Text>
                        <Input className='inputt' type='tel' placeholder='请输入手机号' maxLength='11' value={this.state.mobile} onChange={this.handleMobileChange.bind(this)} />
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
                        登录
                        </View>
                </View> 
                <View className='forget-register'>
                    <Text className='extend-click span' onClick={this.goToPage.bind(this,'/pages/forgetpassword/forgetpassword')}>忘记密码？</Text >
                    <Text className='extend-click register-btn span' onClick={this.goToPage.bind(this,'/pages/register/register')}>立即注册</Text >
                </View>
            </View>
        )
    }
}