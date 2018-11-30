import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Text } from '@tarojs/components'
import './car-select-no.styl'

export default class CarSelectNo extends Component {
    static propTypes = {
        defaultValue: PropTypes.array,
        onSelectedCarValue: PropTypes.func

    }
    static defaultProps = {
        defaultValue: ['沪', 'D'],
        onSelectedCarValue: f => f
    }
    
    constructor(props) {
        super(props)
        this.state = {
            childKeyBoardShow: false,
            popIsfadeIn: false
        }
        this.data = {
            provinceRow1: [{name: '京'}, {name: '津'}, {name: '冀'}, {name: '鲁'}, {name: '晋'}, {name: '蒙'}, {name: '辽'}, {name: '吉'}, {name: '黑'}, {name: '沪'}],
            provinceRow2: [{name: '苏'}, {name: '浙'}, {name: '皖'}, {name: '闽'}, {name: '赣'}, {name: '豫'}, {name: '鄂'}, {name: '湘'}, {name: '粤'}, {name: '桂'}],
            provinceRow3: [{name: '渝'}, {name: '川'}, {name: '贵'}, {name: '云'}, {name: '藏'}, {name: '陕'}, {name: '甘'}, {name: '青'}],
            provinceRow4: [{name: '琼'}, {name: '新'}, {name: '港'}, {name: '澳'}, {name: '台'}, {name: '宁'}],
            carNo1: [{name: '1'}, {name: '2'}, {name: '3'}, {name: '4'}, {name: '5'}, {name: '6'}, {name: '7'}, {name: '8'}, {name: '9'}, {name: '0'}],
            carNo2: [{name: 'Q'}, {name: 'W'}, {name: 'E'}, {name: 'R'}, {name: 'T'}, {name: 'Y'}, {name: 'U'}, {name: 'I'}, {name: 'O'}, {name: 'P'}],
            carNo3: [{name: 'A'}, {name: 'S'}, {name: 'D'}, {name: 'F'}, {name: 'G'}, {name: 'H'}, {name: 'J'}, {name: 'K'}, {name: 'L'}],
            carNo4: [{name: 'Z'}, {name: 'X'}, {name: 'C'}, {name: 'V'}, {name: 'B'}, {name: 'N'}, {name: 'M'}]
        }
        // this.carSelectBox = React.createRef()
        // this.keyboardListBox = React.createRef()
        // this.simKeyBoard = React.createRef()

        // this.provinceSelect = this.provinceSelect.bind(this)
        // this.carNoSelect = this.carNoSelect.bind(this)
        // this.show = this.show.bind(this)
        // this.hide = this.hide.bind(this)
        // this.deleteVal = this.deleteVal.bind(this)
        this.selectValue = props.defaultValue
    }
    componentDidMount () {
        if (this.props.defaultValue && this.props.defaultValue.length > 0) {
            this.setState({
                childKeyBoardShow: !this.state.childKeyBoardShow
            })
            console.log(this.selectValue);
            
          }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props.defaultValue) {
            // this.props.onSelectedCarValue(this.selectValue)
        }
    }
    provinceSelect(val) {
        this.selectValue = []
        this.selectValue.push(val)
        // this.$emit('selectedValue', this.selectValue)
        this.props.onSelectedCarValue(this.selectValue)
        this.setState({childKeyBoardShow: !this.state.childKeyBoardShow})
    }
    carNoSelect(val) {
        if (this.selectValue.length >= 7) {
            return
        }
        this.selectValue.push(val)
        this.props.onSelectedCarValue(this.selectValue)
    }
    deleteVal() {
        this.selectValue.pop()
        if (this.selectValue.length < 2) {
            this.setState({childKeyBoardShow: !this.state.childKeyBoardShow})
            this.selectValue = []
        }
        // this.$emit('selectedValue', this.selectValue)
        this.props.onSelectedCarValue(this.selectValue)
      }
    show() {
        this.setState({popIsfadeIn: true})
      }
    hide() {
         this.setState({popIsfadeIn: false})
    }
    shouldComponentUpdate (nextProps, nextState) {
        console.log(nextProps);
        this.selectValue = nextProps.defaultValue
        return true
    }
    render() {
        return (
            <View style={{display: this.state.popIsfadeIn ? 'block' : 'none'}} ref={this.carSelectBox} className={'car-select-no-box ' + (this.state.popIsfadeIn ? 'fadeIn' : '')}>
                <View ref={this.keyboardListBox} className={'keyboard-list-box ' + (this.state.popIsfadeIn ? 'fadeIn' : '')}>
                <View className='keyboard-list hidden' id='provinceList' ref='keyboardList' style={{display:!this.state.childKeyBoardShow ? 'block' : 'none'}}>
                    <View className='list-item clearfix'>
                        {
                            this.data.provinceRow1.map((item,index) => {
                                return (<Text className='p-item' key={index} onClick={this.provinceSelect.bind(this,item.name)}>{item.name}</Text>)
                            })
                        }
                    </View>
                    <View className='list-item clearfix'>
                        {
                            this.data.provinceRow2.map((item,index) => {
                                return (<Text className='p-item' key={index} onClick={this.provinceSelect.bind(this,item.name)}>{item.name}</Text>)
                            })
                        }
                    </View>
                    <View className='list-item clearfix list-three'>
                        <Text className='p-item  p-item-null'></Text>
                        {
                            this.data.provinceRow3.map((item,index) => {
                                return (<Text className='p-item' key={index} onClick={this.provinceSelect.bind(this,item.name)}>{item.name}</Text>)
                            })
                            
                        }
                        <Text className='p-item  p-item-null'></Text>
                    </View>
                    <View className='list-item clearfix list-four'>
                        <Text className='p-item  p-item-null'></Text>
                        {
                            this.data.provinceRow4.map((item,index) => {
                                return (<Text className='p-item' key={index} onClick={this.provinceSelect.bind(this,item.name)}>{item.name}</Text>)
                            })
                        }
                        <Text className='p-item p-item-close' onClick={this.hide}>取消</Text>
                        <Text className='p-item  p-item-null'></Text>
                    </View>
                </View>
                <View className='keyboard-list' id='simKeyBoard' style={{display: (this.state.childKeyBoardShow ? 'block' : 'none')}} ref={this.simKeyBoard}>
                    <View className='list-item clearfix'>
                        {
                            this.data.carNo1.map((item, index)=> {
                                return (<Text className='p-item' key={index} onClick={this.carNoSelect.bind(this,item.name)}>{item.name}</Text>)
                            })
                        }
                    </View>
                    <View className='list-item  clearfix'>
                        {
                            this.data.carNo2.map((item, index)=> {
                                return (<Text className='p-item' key={index} onClick={this.carNoSelect.bind(this,item.name)}>{item.name}</Text>)
                            })
                        }
                    </View>
                    <View className='list-item list-three clearfix' style={{width:'90%'}}>
                        {
                            this.data.carNo3.map((item, index)=> {
                                return (<Text className='p-item' key={index} onClick={this.carNoSelect.bind(this,item.name)}>{item.name}</Text>)
                            })
                        }
                    </View>
                    <View className='list-item  list-four clearfix'>
                        {
                            this.data.carNo4.map((item, index)=> {
                                return (<Text className='p-item' key={index} onClick={this.carNoSelect.bind(this,item.name)}>{item.name}</Text>)
                            })
                        }
                        <Text className='p-item delete' onClick={this.deleteVal.bind(this)} style={{'minWidth': '35px'}}>x</Text>
                        <Text className='p-item font-confirm' onClick={this.hide.bind(this)} style={{'minWidth': '40px'}}>确认</Text>
                    </View>
                </View>
                </View>
            </View>
        )
    }
}

