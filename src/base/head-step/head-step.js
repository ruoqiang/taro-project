import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { View } from '@tarojs/components'
import './head-step.styl'

class HeadStep extends Component {
      static propTypes = {
        step: PropTypes.number
      }
      static defaultProps = {
          step: 1
      }
      constructor(props) {
        super(props)
        this.state = {
          stepText: ['申请人信息', '车辆信息', '证件照片', '收货地址'],
          stepLine: ['1', '2', '3', '4', '5', '6', '7']
       }
      }
    render () {
        let step = this.props.step
        return (
          <View className='head-setp'>
              <View className='setp'>
                <View className='setp-tips-box'>
                {
                  this.state.stepText.map((item,index)=> {
                    return (<View className={step>index? 'span active': 'span'} key={index}>{item}</View>)
                  })
                  
                }
                  
                </View>
                <View className='setp-dot-box'>
                  {
                    this.state.stepLine.map((item,index) => {
                      return <View className={classNames(index<=step+(step-1)? 'span active' : 'span', (index%2===1 ? 'setp-line' : ''))} key={index}></View>
                    })
                  }
                </View>
              </View>
          </View>
        )
    }
}
export default HeadStep