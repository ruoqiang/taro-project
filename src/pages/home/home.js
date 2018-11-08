import React, { Component } from 'react'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import { actionCreators } from './store';
import axios from 'common/js/http'
import { url } from 'common/js/config'
import './home.styl'

class Home extends Component{
    constructor(props) {
        super(props)
        this.homeCon = React.createRef()
        this.scroll = React.createRef()
        this.picWrapper = React.createRef()
        this.actionScroll01 = React.createRef()
        this.actionSlideCon = React.createRef()
        
        this.checkToken = this.checkToken.bind(this)
        this.goToNext = this.goToNext.bind(this)
        this.scrollX = true
        this.direction = 'horizontal'
        this.directionV = 'vertical'
    }
    componentDidMount() {
        let _height = window.innerHeight + 1
        this.homeCon.current.style.height = _height + 'px'
        
        this._initActionSlide()

        let _mobile = Taro.getStorageSync('mobile') || '' 
        console.log(_mobile);
        
    }
    _initActionSlide () {
        let picWidth = 250
        if (document.body.clientWidth <= 320) {
            picWidth = 220
        }
        let margin = 0
        let width1 = (picWidth + margin) * this.actionSlideCon.current.children.length - margin
        this.actionSlideCon.current.style.width = width1 + 'px'
        this.actionScroll01.current.refresh()
    }
   goToNext (nextPage) {
     this.checkToken(nextPage)
   }
    checkToken (nextPage) {
        var _params = {
            data: {}
          }
        axios({ method: 'post',
            url: url + 'Main/MainQuest',
            data: _params
        }).then((res) =>{
            if (!res.data.issuccess) {
                // this.props.history.push("/login") //交个全局http方法去跳转
                return false
            } else {
                this.props.history.push(`/${nextPage}`)
            }
        })
    }
    render() {
        console.log('render');
        
        return (
                <Scroll ref={this.scroll}>
                    <div className="homeCon"  ref={this.homeCon} style={{height:'700px'}}>
                        <div className="slider-wrapper" ref="ddd">
                            <div className="slider-content">
                            <Slider>
                                <a href="##" className="">
                                <img src={require('../../common/image/banner.png')} alt="" />
                                </a>
                                <a className="">
                                <img src={require('../../common/image/banner2.png')} alt="" />
                                </a>
                                <a className="">
                                <img src={require('../../common/image/banner3.png')} alt="" />
                                </a>
                            </Slider>
                            </div>
                        </div>
                        <div className="card-box-wrap">
                            <div className="card-box">
                                <div href='##' className="card-item" >
                                    <img src={require('../../common/image/icon-ETC.png')} alt="" onClick={() => this.goToNext('userBaseInfo')}/>
                                    <p>办理ETC</p>
                                </div>
                                <div className="card-item" onClick={() => this.goToNext('applicationRecordList')}>
                                    <img src={require('../../common/image/icon-applyRecord.png')} alt="" />
                                    <p>申请记录</p>
                                </div>
                                <div className="card-item">
                                    <img src={require('../../common/image/icon-bill.png')} alt="" onClick={() => this.goToNext('selectCar/1')}/>
                                    <p>账单查询</p>
                                </div>
                                <div className="card-item">
                                    <img src={require('../../common/image/icon-applyRecord.png')} alt="" onClick={() => this.goToNext('selectCar/2')}/>
                                    <p>申请记录</p>
                                </div>
                            </div>
                        </div>
                        <div className="actionBoxWrap">
                            <div className="actionContent">
                                <div className="actionBox ">
                                    <h2 >新闻资讯</h2> 
                                    <div className="actionSlideWrap" ref= {this.picWrapper}>
                                        <Scroll ref={this.actionScroll01} scrollX={this.scrollX} direction={this.direction}>
                                                <div className="actionSlide" ref={this.actionSlideCon}>
                                                    <p ><img src={require('../../common/image/action001.png')} alt="" /></p>
                                                    <p className="no-padding"><img src={require('../../common/image/action002.png')} alt="" /></p>
                                                </div>
                                    </Scroll>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Scroll>
        )
    }
    
}
const mapState = (state) => ({
	showScroll: state.getIn(['home', 'token']),
    // userApplyStepList: (state.getIn(['home','userApplyStepList']))
})

const mapDispatch = (dispatch) => ({
	changeHomeData() {
		dispatch(actionCreators.getHomeInfo());
    },
    getUserBaseInfo() {
		dispatch(actionCreators.getUserBaseInfo());
	},
	changeScrollTopShow() {
        dispatch(actionCreators.toggleTopShow(true))
		// if (document.documentElement.scrollTop > 100) {
        //     dispatch(actionCreators.toggleTopShow(true))
        //     // dispatch(actionCreators.setToken('sdddd'))
		// }else {
		// 	dispatch(actionCreators.toggleTopShow(false))
		// }
    },
    setToken () {
        dispatch(actionCreators.setToken('cccc'))
    }
});
export default (connect(mapState, mapDispatch)(Home));