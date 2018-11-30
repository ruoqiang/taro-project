import '@tarojs/async-await' //add 11-20

import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import { Provider } from '@tarojs/redux' //add 11-20
import configStore from './store' //add 11-20

import './app.styl'
import './common/styl/base.styl'

const store = configStore()
class App extends Component {

  config = {
    pages: [
      // 'pages/user-upload/user-upload',
      'pages/user-add-address/user-add-address',
      'pages/index/index',
      'pages/record-car/record-car',
      'pages/select-car/select-car',
      'pages/login/login',
      'pages/forgetpassword/forgetpassword',
      'pages/register/register',
      'pages/user-baseinfo/user-baseinfo',
      'pages/user-carinfo/user-carinfo',
      'pages/application-record-list/application-record-list',
      'pages/bill/bill'
      // 'pages/demo/demo'
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
      <Provider store={store}>
          <Index />
      </Provider>
      
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
