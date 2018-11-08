// import React, {Component} from 'react'
// import { actionCreators } from '../home/store';
// import { connect } from 'react-redux'
import React, {Component} from 'react'
import axios from 'common/js/http'
import { url } from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import { withRouter } from 'react-router-dom'
import { setToken } from 'common/js/cache'
import getCodeHOC from 'common/js/HOC'
@getCodeHOC
class Register extends Component{

    constructor() {
        super()
        this.state = {
            mobile: '',
            password: '',
            tipsText: '',
            isOpen: false,
            inputType: 'password',
            codeBtnText: '发送验证码'
        }
        this.confirm = React.createRef()
        this.buttonBtn = React.createRef()
        this.handleMobileChange = this.handleMobileChange.bind(this)
        this.handlePassWordChange = this.handlePassWordChange.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.switchEye = this.switchEye.bind(this)
        this.goToLogin = this.goToLogin.bind(this)
        // this.getCode = this.getCode.bind(this)
        this.btnDisable = false
        this.codeBtnDisable = false
        // this.codeBtnText = '发送验证码'
        this.timer = null
    }
    componentDidMount() {
        let _mobile = localStorage.getItem('mobile')
        this.setState({
            mobile: _mobile
        })
    }
    handleMobileChange (e) {
        this.setState({
            mobile: e.target.value
        })
    }
    handleLogin (e) {
        let that = this
        let params = {
            Identifier:this.state.mobile,
            Credential:this.state.password
        }
        if (params.Identifier === '') {
            this.setState({
                tipsText:'请输入手机号码'
            })
            this.refs.confirm.show()
            return
          }
          if (!/1[3|4|5|7|8]\d{9}/.test(params.Identifier)) {
            this.setState({
                tipsText:'请输入正确手机号码'
            })
            this.refs.confirm.show()
            return
          }
          if (params.Credential === '') {
            this.setState({
                tipsText:'请输入密码'
            })
            this.refs.confirm.show()
            return false
          }
        axios({ method: 'post',
            url: url + 'Login/UserLogin',
            data: params
        }).then((res) => {
            // console.log(res);
            if (res.data.issuccess) {
                console.log(that.props);
                window.location.href = '/home'
                setToken(res.data.result.Token)
                localStorage.setItem('mobile', that.state.mobile)
            } else {
                that.setState({
                    tipsText: res.data.message
                })
                that.refs.confirm.show()
            }
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
    shouldComponentUpdate(nextProps, nextState) {
        // console.log('nextProps', nextProps);
        console.log('nextState', nextState);
        if (nextState.mobile && (/1[3|4|5|7|8]\d{9}/.test(nextState.mobile)) && nextState.password ) {
            this.btnDisable = true
        } else {
            this.btnDisable = false
        }
        if (nextState.codeBtnText === '发送验证码') {
            this.codeBtnDisable = false
        }
        return true
    }
    goToLogin () {
        console.log(this.props);
        this.props.history.push('/login')
    }
    render() {
        return (
            <div>
                <div className="title">用户注册</div> 
                <div className="inputBox padType">
                    <div className="input size-0 align-1">
                        <label >手机号</label>
                        <input type="tel" placeholder="请输入手机号" maxLength="11" value={this.state.mobile} onChange={this.handleMobileChange} />
                    </div>
                </div> 
                <div className="inputBox padType">
                    <div className="input size-0 align-1">
                        <label >验证码</label>
                        <input placeholder="请输入密码"  maxLength="6" type="number"/> <div className={"send-smg-code " + (this.codeBtnDisable ? 'disable' : '')} onClick={()=>this.props.getCode(this.state.mobile)}>{this.props.state.codeBtnText}</div>
                    </div>
                </div>
                <div className="inputBox padType">
                    <div className="input size-0 align-1">
                        <label >密&nbsp;&nbsp;&nbsp;&nbsp;码</label>
                        <input placeholder="请输入密码" maxLength="16" type={this.state.inputType} onChange={this.handlePassWordChange}/> 
                            <div className="eye" onClick={this.switchEye}>
                        </div>
                    </div>
                </div>
                <div className="agree-register">
                    <div className="agree-check"></div> <div className="agree-text">
                        同意《
                        <a href="#/useAgreementRegister">
                            注册协议
                        </a>
                        》
                    </div>
                </div>
                <div className="buttonBox disable">
                            <div className={"button " + (this.btnDisable ? '' : 'disable')}>
                            注册
                            </div>
                    </div>
                <div className="child-mt20">
                    
                    <div className="buttonBox reverse">
                            <div className="button reverse" onClick={this.goToLogin}>
                            已有账号，去登录
                            </div>
                    </div>
                </div>
                <Confirm text={this.state.tipsText} confirmType='2' ref="confirm"></Confirm>
            </div>
        )
    }
    
}
export default withRouter(Register)

// const mapState = (state) => ({
// 	showScroll: state.getIn(['showScroll'])
// })

// const mapDispatch = (dispatch) => ({
// 	changeHomeData() {
// 		dispatch(actionCreators.getHomeInfo());
// 	},
// 	changeScrollTopShow() {
// 		if (document.documentElement.scrollTop > 100) {
// 			dispatch(actionCreators.toggleTopShow(true))
// 		}else {
// 			dispatch(actionCreators.toggleTopShow(false))
// 		}
// 	}
// });

// export default connect(mapState, mapDispatch)(Register);