import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View } from '@tarojs/components'
import './tipsStatus.styl'

class TipsStatus extends Component {
    static propTypes = {
        title: PropTypes.string, 
        text: PropTypes.string,
        statusClass: PropTypes.string,
        data: PropTypes.array,
        btnClick: PropTypes.func,
        buttonHide: PropTypes.bool
      }
      static defaultProps = {
        title: '恭喜！您的信息已提交成功！',
        text: '返回',
        statusClass: 'success',
        data: [0],
        onBtnClick: f => f,
        buttonHide: false
      }
      constructor(props) {
        super(props)
        this.state = {
          flag: true
        }
        this.confirm = this.confirm.bind(this)
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
      }
      confirm() {
        this.props.onBtnClick() 
      }
      show() {
        this.setState({flag: true})
      }
      hide() {
        this.setState({flag: false})
      }
    render () {
        return (
            <View className='tips-status' style={{'display': this.state.flag}}>
                <View className='statusImg'></View>
                <View className='desc'>{this.props.title}</View>
                {!this.props.buttonHide === true? (
                  <View className='backbutton' onClick={this.confirm.bind(this)}>
                    {this.props.text}
                </View>
                ) : null}
        </View>
        )
    }
}
export default TipsStatus