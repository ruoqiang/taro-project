import React, { Component} from 'react'
import Scroll from 'base/scroll/scroll'
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux'
import { actionCreators } from '../home/store';
import axios from 'common/js/http'
import Confirm from 'base/confirm/confirm'
import { url } from 'common/js/config'
import HeadStep from 'base/head-step/head-step'
import CarSelectNo from 'base/car-select-no/car-select-no'
import { toObject } from 'immutable'
import Picker from 'better-picker'
import '../user-baseinfo/userInfo.styl'
class UserCarInfo extends Component{
    constructor() {
        super()
        this.state = {
            isSelf: true,
            sex: '1',
            btnDisable: false,
            carno: ['沪','A','B'],
            defaultcarValue: ['杭','A']
        }
        this.info = {
            carColorType: 0,
            carColor: '蓝'
        }
        this.scroll = React.createRef()
        this.confirm = React.createRef()
        this.selectCarNo = React.createRef()
        this.selectColor = React.createRef()
        this.selectColorInput = React.createRef()
        
        this.submitInfo= this.submitInfo.bind(this)
        this.selectCarNoShow = this.selectCarNoShow.bind(this)
        this.selectedCarValue = this.selectedCarValue.bind(this)
    }
    
    componentDidMount () {
        let that = this
        this.props.getUserBaseInfo(function() {
            
        })
        this.scroll.current.refresh()
        // this.newApply = this.props.apply && (this.props.apply).toObject()
        //setTimeout(()=>{ //有bug网络慢的时候
            that.setState({
                carno:( that.newApply && that.newApply.CarNum &&(that.newApply.CarNum).split('')) || ['沪','A','B']
            })
       // },100)
       
        // this.carn = 
        this.carTypeInit()
        
    }
    carTypeInit() {
        var that = this
        var nameEl = this.selectColor.current
        var inputEl = this.selectColorInput.current
        var data1 = [{text: '蓝牌', value: 0}, {text: '黄牌', value: 1}, {text: '黑牌', value: 2}, {text: '白牌', value: 3}]
        this.picker = new Picker({data: [data1], selectedIndex: [0], title: '选择车牌颜色'})
        nameEl.addEventListener('click', function() { that.picker.show() })
        var me = this
        this.picker.on('picker.select', function(selectedVal, selectedIndex) {
          inputEl.value = data1[selectedIndex[0]].text
          me.info.carColor = data1[selectedIndex[0]].text
          me.info.carColorType = data1[selectedIndex[0]].value
          console.log(me.info)
          // console.log(me.carno.join())
        })
    }
    selectCarNoShow () {
        this.refs.selectCarNo.show()
    }
    submitInfo () {
        let param = {
            CarColor: this.info.carColor.slice(0, 1), //只取第一个文字
            CarColorType: this.info.carColorType,
            CarNum: (this.state.carno).join(''),
            EngineNum: this.engineNum.value,
            CarVin: this.carVin.value,
            CarBrand: this.carBrand.value,
            CarLoad: this.carLoad.value,
            Relation: "11111"
        }
        console.log(param)
        if (this.state.carno.length < 5) {
            this.setState({tipsText:'请输入正确位数车牌号'})
            this.refs.confirm.show()
            return
        }
        if (param.EngineNum === '') {
            this.setState({tipsText:'请输入发动机号'})
            this.refs.confirm.show()
            return
        }
        var engineNumReg = /^[0-9a-zA-Z]*$/g
        if (!engineNumReg.test(param.EngineNum)) {
            this.setState({tipsText:'请输入正确格式的发动机号'})
            this.refs.confirm.show()
            return
        }
        if (!param.CarVin) {
            this.setState({tipsText:'请输入车辆识别代码'})
            this.refs.confirm.show()
            return
        }
        var vehicleCodeReg = /^[0-9a-zA-Z]*$/g
        if (!vehicleCodeReg.test(param.CarVin)) {
            this.setState({tipsText:'请输入正确格式的车辆识别代码'})
            this.refs.confirm.show()
            return
        }
        if (!param.CarBrand) {
            this.setState({tipsText:'请输入车牌品牌'})
            this.refs.confirm.show()
            return
        }
        if (!param.CarLoad) {
            this.setState({tipsText:'请输入车辆载重'})
            this.refs.confirm.show()
            return
        }
        var numReg= /^\d+(\.\d+)?$/
        if (!numReg.test(param.CarLoad)) {
            this.setState({tipsText:'请输入正确的载重'})
            this.refs.confirm.show()
            return
        }
        console.log(param)
        let params = {
            Step: 2,
            CCustomerApply: param
          }
        let that = this
        this.setState({btnDisable: true})
        axios({ method: 'post',
            url: url + 'SubInfo/UserAndCar',
            data: params
        }).then((res) => {
            if (res.data.issuccess) {
                console.log(that.props)
                this.setState({btnDisable: false})
                that.props.getUserBaseInfo()
                that.props.history.push('/userUpload')
            } else {
                that.setState({
                    tipsText: res.data.message,
                    btnDisable: false
                })
                that.refs.confirm.show()
            }
        })
    }
    selectedCarValue(val) { //选择车牌号
        this.setState({carno: val})
      }
    render() {
        console.log('render')
        this.newApply = this.props.apply && (this.props.apply).toObject()
        return (
            <div id="user-baseinfo">
                <Scroll ref={this.scroll}>
                    <div className="wrapper">
                        <HeadStep step={2}></HeadStep>
                        <div className="form-box">
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2">
                                    <h2>车辆信息</h2>
                                </div>
                            </div>
                           
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2" ref={this.selectColor}>
                                    <label>车牌颜色</label>
                                    <input type="text" defaultValue={(this.newApply && this.newApply['CarColor']) || this.info.carColor}  ref={this.selectColorInput} readOnly="readOnly"/>
                                     <div className="icon-more"></div>
                                </div>
                            </div>
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2" onClick={this.selectCarNoShow}>
                                    <label>车牌号</label>
                                    {/* <div className="sex-box">{(this.state.carno).join()}</div> */}
                                    <div className="selectedValueBox">
                                    <span className="line"></span>
                                    <input type="text" name="" placeholder="" defaultValue="" readOnly="" />

                                    <input type="text" name="" placeholder="" defaultValue="" readOnly="" />
                                    <input type="text" name="" placeholder="" defaultValue="" readOnly="" />
                                    <input type="text" name="" placeholder="" defaultValue="" readOnly="" />
                                    <input type="text" name="" placeholder="" defaultValue="" readOnly="" />
                                    <input type="text" name="" placeholder="" defaultValue="" readOnly="" />
                                    <input type="text" name="" placeholder="" defaultValue="" readOnly="" />
                                    </div>
                                </div>
                                <div className="selected-car-box"  onClick={this.carSelectNoShow}>
                                    <span className="line"></span>
                                    {
                                        this.state.carno && this.state.carno.map((item,index)=> {
                                            return (<input type="text" readOnly="" value={item}  key={index} onChange={(input)=>this.inputChange}/>)
                                        })
                                    }
                                </div>
                            </div>
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2">
                                    <label>发动机号</label>
                                    <input type="text" name="" placeholder="请输入发动机号" defaultValue={this.newApply && this.newApply['EngineNum']} maxLength="18" ref={(input) => {this.engineNum = input}}/>
                                </div>
                            </div>
                            <div className="inputBox padType2">
                                <div className="input size-2 align-2">
                                    <label>车辆识别代码</label> <input type="tel" name="" placeholder="请输入车辆识别代码" defaultValue={this.newApply && this.newApply['CarVin']} maxLength="11" ref={(input) => {this.carVin = input}}/>
                                </div>
                            </div>
                            <div className="inputBox padType">
                                <div className="input size-2 align-2">
                                    <label>车辆品牌</label>
                                    <input type="tel" name="" placeholder="请输入车辆品牌" maxLength="11" defaultValue={this.newApply && this.newApply['CarBrand']} ref={(input) => {this.carBrand = input}}/>
                                </div>
                            </div>
                            <div className="inputBox padType">
                                <div className="input size-2 align-2">
                                    <label>核定载重(kg)</label>
                                    <input type="tel" name="" placeholder="请输入核定载重" maxLength="11" defaultValue={this.newApply && this.newApply['CarLoad']} ref={(input) => {this.carLoad = input}}/>
                                </div>
                            </div>
                        </div>
                        
                        <div className="buttonBox">
                            <div className={'button ' + (this.state.btnDisable ? "disable": "")} onClick={this.submitInfo}>
                                 下一步
                            </div>
                        </div>
                        <div style={{height: '40px'}}></div>
                    </div>
                </Scroll>
                <Confirm text={this.state.tipsText} confirmType='2' ref="confirm"></Confirm>
                <CarSelectNo ref="selectCarNo" defaultValue={this.state.carno} selectedCarValue={this.selectedCarValue}></CarSelectNo>
            </div>
            
        )
    }
}
const mapState = (state) => ({
    userApplyStepList: (state.getIn(['home', 'userApplyStepList'])),
    apply: (state.getIn(['home', 'userApplyStepList', 'apply']))
})

const mapDispatch = (dispatch) => ({
	changeHomeData() {
		dispatch(actionCreators.getHomeInfo())
    },
    getUserBaseInfo() {
		dispatch(actionCreators.getUserBaseInfo())
	}
})
export default withRouter(connect(mapState, mapDispatch)(UserCarInfo))
