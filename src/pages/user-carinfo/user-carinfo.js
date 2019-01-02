import Taro, { Component } from '@tarojs/taro'
import { View, Input, ScrollView, Text, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as HTTP from '../../common/js/http'
import { showTips } from '../../common/js/util'
import HeadStep from '../../base/head-step/head-step'
import CarSelectNo from '../../base/car-select-no/car-select-no'
import '../user-baseinfo/userInfo.styl'
import '../login/login.styl' //微信端样式不能复用login中的样式，需要再次引用一次

import { getUserBaseInfo } from '../../store/actions/counter'
@connect(({ counter }) => ({
    counter
}), (dispatch) => ({
  getUserBaseInfo() {
		dispatch(getUserBaseInfo())
	}
}))

export default class userCarInfo extends Component{
    config = {
        navigationBarTitleText: '选择车辆'
    }
    constructor(props) {
        super(props)
        this.state = {
            selector: ['蓝牌','黄牌','黑牌','白牌'],
            selectorChecked: '蓝牌',
            CarColorType: 0,
            carno: ['沪','A','B'],
            defaultcarValue: ['杭','A'],
            btnDisable: false
        }
        this.forms = {}
    }
    componentDidShow() {
        // console.log('this', this.props.counter.userApplyStepList)
        this.newApply = this.props.counter.userApplyStepList && this.props.counter.userApplyStepList.apply
        if (this.newApply) {
            this.isSelf = this.newApply['IsOwnerApply'] || true
            this.CarColorType = this.newApply['CarColorType'] || 0
            this.sex = this.newApply['Sex'] || '1'
            this.setState({isSelf: this.isSelf}) // 用来辅助更新view的
            this.setState({selectorChecked: this.newApply['CarColor']  || '蓝牌'})
            this.forms = this.newApply
            this.setState({
                carno:( this.newApply && this.newApply.CarNum &&(this.newApply.CarNum).split('')) || ['沪','A','B']
            })
        }
    }
    onChange = e => {
        this.setState({
          selectorChecked: this.state.selector[e.detail.value]
        })
        this.setState({
            CarColorType:e.detail.value
          })
        console.log(e);
      }
    handleInputChange(keywords, e) {
        this.forms[keywords] = e.target.value
    }
    submitInfo () {
        let param = {
            CarColor:  this.state.selectorChecked.slice(0, 1), //'蓝', //this.info.carColor.slice(0, 1), //只取第一个文字
            CarColorType:  this.state.CarColorType, //this.forms.CarColorType,
            CarNum: (this.state.carno).join(''),
            EngineNum: this.forms.EngineNum || '',
            CarVin: this.forms.CarVin || '',
            CarBrand: this.forms.CarBrand || '',
            CarLoad: this.forms.CarLoad || '',
        }
        
        if (param.EngineNum === '') {
            return showTips('发动机号')
        }
        if (param.CarVin === '') {
            return showTips('车辆识别代码')
        }
        
        if (param.CarBrand === '') {
            return showTips('车辆品牌')
        }
        if (param.CarLoad === '') {
            return showTips('核定载重')
        }
        let params = {
            Step: 2,
            CCustomerApply: param
        }
        this.setState({btnDisable: true})
        let that = this
        Taro.showLoading({ title: '提交中..' })
        HTTP.post('SubInfo/UserAndCar', params).then(()=> {
            this.setState({btnDisable: false})
            // 成功后
            that.props.getUserBaseInfo()
            Taro.navigateTo({url: '/pages/user-upload/user-upload'})
        }).catch(()=> {
            this.setState({btnDisable: false})
        })
    }
    switchSelf(val) {
        this.isSelf = val
        this.setState({isSelf: val}) //只有prop或者state变化了view才会更新，因此我们加了一个触发页面更新的字段isSelf在state中，
    }
    switchSex (val) {
        this.sex = val
        this.setState({sex: val}) // 用来辅助更新view的
    }
    selectCarNoShow () {
        this.refs.selectCarNo.show()
    }
    selectedCarValue(val) { //选择车牌号
        this.setState({carno: val})
      }
    render() {
        return (
            <View id='user-baseinfo'>
                <ScrollView ref={this.scroll}>
                    <HeadStep step={2}></HeadStep>
                        <View className='form-box'>
                            <View className='form-list'>
                                    <View className='form-title'>车辆信息</View>
                            </View>
                            <View className='form-list'>
                                <Text className='label'>车牌颜色</Text> 
                                {/* <Input type='text' className='input' placeholder='请输入车牌颜色'  maxLength='13' value={this.newApply && this.newApply['CarColor']} /> */}
                                <Picker className='carcolor' range={this.state.selector} value={this.state.CarColorType} onChange={this.onChange}> <View className='picker'>
                                    {this.state.selectorChecked}
                                </View></Picker>
                            </View>
                            <View className='form-list' onClick={this.selectCarNoShow.bind(this)}>
                                <Text className='label'>车牌号</Text> 
                                <View className='selectedValueBox'>
                                    <Text className='line'></Text>
                                    <Input type='text' placeholder='' readOnly='' />

                                    <Input type='text' placeholder='' readOnly='' />
                                    <Input type='text' placeholder='' readOnly='' />
                                    <Input type='text' placeholder='' readOnly='' />
                                    <Input type='text' placeholder='' readOnly='' />
                                    <Input type='text' placeholder='' readOnly='' />
                                    <Input type='text' placeholder='' readOnly='' />
                                    </View>
                                    <View className='selected-car-box'  onClick={this.carSelectNoShow}>
                                    <Text className='line'></Text>
                                        {
                                            this.state.carno && this.state.carno.map((item,index)=> {
                                                return (<Input type='text' readOnly='' value={item}  key={index} />)
                                            })
                                        }
                                    </View>
                            </View>
                            
                            <View className='form-list'>
                                <Text className='label'>发动机号</Text> 
                                <Input type='text' className='input' placeholder='请输入发动机号'  maxLength='13'  value={this.newApply && this.newApply['EngineNum']}  onChange={this.handleInputChange.bind(this,'EngineNum')} />
                            </View>
                            <View className='form-list'>
                                <Text className='label'>车辆识别代码</Text> 
                                <Input type='text' className='input' placeholder='请输入车辆识别代码'  maxLength='13'  value={this.newApply && this.newApply['CarVin']}  onChange={this.handleInputChange.bind(this,'CarVin')} />
                            </View>
                            <View className='form-list'>
                                <Text className='label'>车辆品牌</Text> 
                                <Input type='text' className='input' placeholder='请输入车辆品牌'  maxLength='18' value={this.newApply && this.newApply['CarBrand']} onChange={this.handleInputChange.bind(this,'CarBrand')} />
                            </View>
                            <View className='form-list'>
                                <Text className='label'>核定载重</Text> 
                                <Input type='text' className='input' placeholder='请输入核定载重'  maxLength='11' value={this.newApply && this.newApply['CarLoad']} onChange={this.handleInputChange.bind(this,'CarLoad')} />
                            </View> 
                        </View>
                        <View className='buttonBox'>
                            <View className={'button ' + (this.state.btnDisable ? 'disable': '')} onClick={this.submitInfo.bind(this)}>
                                 下一步
                            </View>
                        </View>
                        <View style={{height: '40px'}}>
                        </View>
            </ScrollView>
            <CarSelectNo ref='selectCarNo' defaultValue={this.state.carno} onSelectedCarValue={this.selectedCarValue.bind(this)}></CarSelectNo>

            </View>
        )
    } 
}