import Taro, { Component } from '@tarojs/taro'

import { View, ScrollView,Input} from '@tarojs/components'
import './demo.styl'

let data = Array(20).fill({consumeMoney: '100',inStation: '2018-02-14:12:21',inTime: '2018-02-14:12:21',inStation: '2018-02-14:12:21',outStation: '2018-02-14:12:21'})
export default class Demo extends Component{
    constructor(props) {
        super(props)
        this.state = {
            recordList: data,
        }
    }
    componentDidMount() {
        // this.slectedImg()
    }
    inputChange(e) {
        this.slectedImg(e.target)
    }
    slectedImg(obj) {
       
        var f = obj.files[0]
        var reader = new FileReader()
        reader.readAsDataURL(f)
        reader.onload = function(e) {
            console.log(e);
            debugger
        }
    }
    onScrollToLower() {
        console.log('onScrollToLower')
    }

    render() {
        return (
            <View className='record-car'>
            <View className='record-img'>
            <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />
            </View>
            <View className='record-list-box-wrap' ref={this.recordListBoxWrap} style={{height: '300px'}}>
                <ScrollView className='ScrollView' scrollY onScrollToLower={this.onScrollToLower.bind(this)} lowerThreshold={20}>
                {this.state.recordList.map((item,index)=> {
                                return (
                                    <View className='record-list' key={index}>
                                        <View className='record-list-title'>
                                            <View className='div'>通行费用  </View>
                                            <View className='div cost'>￥{item.consumeMoney}</View>
                                        </View>
                                        <View className='record-list-info'>
                                        <View className='in-out-list'>
                                            <View className='go-site'>进站名：<View className='span'>{item.inStation}</View> </View>
                                            <View className='go-time'>{item.inTime}</View>
                                        </View>
                                        <View className='in-out-list'>
                                            <View className='go-site'>出站名：<View className='span'>{item.outStation}</View> </View>
                                            <View className='go-time'>{item.inTime}</View>
                                        </View>
                                        </View>
                                    </View>
                                ) 
                            })}
                </ScrollView>
            </View>
            </View>
        )
    }
}

