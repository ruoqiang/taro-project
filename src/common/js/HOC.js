
import React, {Component} from 'react'
import axios from 'axios'
import qs from 'qs'
import { noToken } from './config'

import { loadToken } from 'common/js/cache'
import { url } from 'common/js/config'
 let token = loadToken()
 console.log('token', token);
export default (WrappedComponent) => {
    return class extends Component {
      constructor(props) {
        super(props)
        this.state = {
            codeBtnText: '发送验证码'
        }
        this.getCode = this.getCode.bind(this)
        this.postVcode = this.postVcode.bind(this)
      }
      componentWillMount() {
        
      }
      getCode(mobile) {
        if (mobile === '') {
            this.setState({
                tipsText: '请输入手机号码'
            })
            this.refs.confirm.show()
            return
        }
        if (!/1[3|4|5|7|8]\d{9}/.test(mobile)) {
            this.setState({
                tipsText: '请输入正确手机号码'
            })
            this.refs.confirm.show()
            return
        }
        this.codeBtnDisable = true
        // console.log(this.codeBtnDisable)
        this.postVcode(mobile)
        let total = 59
        this.setState({codeBtnText: `${total}秒`})
        // this.codeBtnText = `${total}秒`
        this.timer = setInterval(() => {
          // console.log(total)
          --total
        //   this.codeBtnText = `${total}秒`
          this.setState({codeBtnText: `${total}秒`})
          if (total <= 0) {
            clearInterval(this.timer)
            // this.codeBtnText = '发送验证码'
            this.setState({codeBtnText: `发送验证码`})
            this.codeBtnDisable = false
          }
        }, 1000)
      }
      postVcode(mobile) {
        var _params = {
              Phone: mobile
        }
        var that = this
        axios({ method: 'post',
                url: url + 'ComService/PostVcode',
                data: _params
                })
                .then(function (res) {
                    if (res.data.issuccess) {
                        that.setState({
                            tipsText: res.data.message
                        })
                        that.refs.confirm.show()
                      //that.saveUserApplyStepList(res.data.result)
                    } else {
                        that.setState({
                            tipsText: res.data.message
                        })
                        that.refs.confirm.show()
                       that.codeBtnDisable = false
                       clearInterval(that.timer)
                    //    that.codeBtnText = `发送验证码`
                        this.setState({codeBtnText: `发送验证码`})
                       return false
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
      }
      render() {
        return (
          <div>
            <WrappedComponent getCode={this.getCode} state={this.state} {...this.props}/>
          </div>
        )
      }
    }
  }