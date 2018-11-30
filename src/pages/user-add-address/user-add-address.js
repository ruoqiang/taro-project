import Taro, { Component } from '@tarojs/taro'
import { View, Input, ScrollView, Text, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as HTTP from '../../common/js/http'
import { showTips } from '../../common/js/util'
import HeadStep from '../../base/head-step/head-step'
import cityDatas from './city'
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
            isSelf: 0,
            provinces:[],
            citys:[],
            // index:'ff',
            districts:[],
            selectedIndex:[1,1,1],
            btnDisable: false
        }
        this.forms = {}
        this.selectedIndex = [1,1,1]
    }
    componentDidShow() {
        this.newApply = this.props.counter.userApplyStepList && this.props.counter.userApplyStepList.apply
        this.address = this.props.counter.userApplyStepList && this.props.counter.userApplyStepList.address
        if (this.address) {
            this.defaultArea = (this.address && (`${this.address['Province']} ${this.address['City']} ${this.address['Town']}`)) || ''
            this.setState({defaultArea: this.defaultArea}) // 用来辅助更新view的
        }
        // this.initCreateArea('广东','深圳')
        this.initCreateArea(this.address['Province'],this.address['City'],this.address['Town'])
        // this.selectedIndex = this.getSelectIndex(this.defaultArea)
        
    }
    initCreateArea(province,city,district) {
        this.provinces = this.createProvinces()
        this.citys = this.createCitys(province)
        this.districts = this.createDistricts(city)
        this.setState({provinces: this.provinces})
        this.setState({citys: this.citys})
        this.setState({districts: this.districts})
        //根据名称获取选择的索引
        let provinceIndex = this.getSelectIndex(province,this.provinces)
        let cityIndex = this.getSelectIndex(city,this.citys)
        let districtIndex = this.getSelectIndex(district,this.districts)
        this.selectedIndex = [provinceIndex,cityIndex,districtIndex]

        this.setState({selectedIndex: this.selectedIndex})
    }
    getSelectIndex(name,arr){
        let idx = 0
         arr.forEach((item,index)=>{
            if(name === item.name) idx = index
        })
        return idx
    }
    createProvinces() {
        let arr = []
        cityDatas.forEach((item)=> {
            arr.push({name: item.name})
        })
        return arr
    }
    createCitys(province) {
        let arr = []
        cityDatas.forEach((item)=> {
            if(item.name === province){
                (item.sub || []).forEach((itemm)=> {
                    arr.push(itemm)
                })
            }
        })
        return arr
    }
    createDistricts(city= []) {
        let arr = []
        this.citys.forEach((item)=> {
            if(item.name === city){
                (item.sub || []).forEach((itemm)=> {
                    arr.push(itemm)
                })
            }
        })
        return arr
    }
    onPickOk(e) {
        // console.log('onChange', e.detail.value);
        let selectedIndex = e.detail.value
        this.setState({selectedIndex:this.selectedIndex})

        let province = this.provinces[selectedIndex[0]]
        let city = this.citys[selectedIndex[1]]
        let district = this.districts[selectedIndex[2]]
        this.defaultArea = `${province&&province.name} ${city&&city.name || ''} ${district&&district.name || ''}`
      }
    onColumnchange(e) {
        let column = e.detail.column
        let curProvinceName = null
        let curCityName = null
        if (column === 0) { //如果选择的是第一项，修改第二三项
            //修改第二项
            curProvinceName = this.provinces[e.detail.value]
            this.citys = this.createCitys(curProvinceName.name)
            this.setState({citys:this.citys})
            //修改第三项
            curCityName = this.citys[0]
            this.districts = this.createDistricts(curCityName && curCityName.name)
            this.setState({districts:this.districts})
        } else if(column === 1) {//如果选择的是第二项
            //修改第三项
            curCityName = this.citys[e.detail.value] //this.citys[0]
            this.districts = this.createDistricts(curCityName && curCityName.name)
            this.setState({districts:this.districts})
        }
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
        debugger
        this.setState({btnDisable: true})
        let that = this
        Taro.showLoading({ title: '提交中..' })
        HTTP.post('SubInfo/UserAndCar', params).then(()=> {
            this.setState({btnDisable: false})
            // 成功后
            that.props.getUserBaseInfo()
            Taro.navigateBack({url: '/pages/user-carinfo/user-carinfo'})
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
    render() {
        return (
            <View id='user-baseinfo'>
                <ScrollView ref={this.scroll}>
                    <HeadStep step={4}></HeadStep>
                        <View className='form-box'>
                            <View className='form-list'>
                                    <View className='form-title'>收货地址</View>
                            </View>
                            
                            <View className='form-list'>
                                <Text className='label'>收货人</Text> 
                                <Input type='text' className='input' placeholder='请输入收货人'  maxLength='13'  value={this.address && this.address['ConName']}  onChange={this.handleInputChange.bind(this,'ConName')} />
                            </View>
                            <View className='form-list'>
                                <Text className='label'>手机号</Text> 
                                <Input type='text' className='input' placeholder='请输入手机号'  maxLength='13'  value={this.address && this.address['ConPhone']}  onChange={this.handleInputChange.bind(this,'ConPhone')} />
                            </View>
                            <View className='form-list'>
                                <Text className='label'>所在地区</Text> 
                                {/* rangeKey='name' onColumnchange={this.onColumnchange.bind(this)} */}
                                {
                                    this.state.provinces.length>0&& (
                                        <Picker className='carcolor' mode='multiSelector' rangeKey='name' value={this.selectedIndex} range={[this.state.provinces,this.state.citys,this.state.districts]}  onColumnchange={this.onColumnchange.bind(this)} onChange={this.onPickOk.bind(this)}>  <View className='picker'>
                                        {this.defaultArea}
                                    </View>
                                    </Picker>
                                    )
                                }
                               
                            </View>
                            <View className='form-list'>
                                <Text className='label'>详细地址</Text> 
                                <Input type='text' className='input' placeholder='请输入详细地址'  maxLength='11' value={this.address && this.address['DetailAddress']} onChange={this.handleInputChange.bind(this,'DetailAddress')} />
                            </View> 
                        </View>
                        <View className='buttonBox'>
                            <View className={'button ' + (this.state.btnDisable ? 'disable': '')} onClick={this.submitInfo.bind(this)}>
                                 下一步
                            </View>
                        </View>
                        {/* <Picker  mode='multiSelector' value={[1,2]}  range={[['北京','上海','天津'],['北京','上海','天津']]}  onColumnchange={this.onColumnchange.bind(this)}>  <View className='picker'>
                                    {this.defaultArea}
                                </View>
                        </Picker>
                        <Picker mode='multiSelector' rangeKey='name' value={[2]}  range={[[{name:'北京'},{name:'上海'},{name:'天津'}]]}  onColumnchange={this.onColumnchange.bind(this)}>  <View className='picker'>
                                {this.defaultArea}
                            </View>
                        </Picker> */}
                        <View style={{height: '40px'}}>
                        </View>
            </ScrollView>
            </View>
        )
    } 
}