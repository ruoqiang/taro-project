import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View,Image} from '@tarojs/components'
import './loading.styl'

class Loading extends Component {
    static propTypes = {
        title: PropTypes.string,
        size: PropTypes.string,
        displayType: PropTypes.string
      }
      static defaultProps = {
        title: '正在载入...',
        size: '24',
        displayType: '',
    }
      constructor(props) {
        super(props)
        this.state = {
            flag: true
        }
      }
      show() {
        this.setState({flag: true})
    }
    hide() {
        this.setState({flag: false})
    }
    render() {
        return (
            <View className={'loading ' + this.props.displayType} style={{display: this.state.flag ? 'block': 'none'}}>
                <Image style={{height: `${this.props.size}px`,width:`${this.props.size}px`}}  src={require('./loading.gif')} alt='' />
                <View className='desc'>{this.props.title}</View>
            </View>
        )
    }
}
export default Loading