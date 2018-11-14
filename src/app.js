import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.styl'
import './common/styl/base.styl'

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/select-car/select-car',
      
      'pages/login/login',
      'pages/record-car/record-car',
      'pages/forgetpassword/forgetpassword',
      'pages/register/register',
      'pages/user-baseinfo/user-baseinfo',
      'pages/application-record-list/application-record-list',
      
      'pages/bill/bill'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
