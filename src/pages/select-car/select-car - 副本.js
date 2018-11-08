import React, { Component } from 'react'
import Scroll from 'base/scroll/scroll'
import { connect } from 'react-redux'
import { actionCreators } from '../home/store';
import axios from 'common/js/http'
import { url } from 'common/js/config'
import { toObject, toJS } from 'immutable'
import TipsStatus from 'base/tipsStatus/tipsStatus'
import Loading from 'base/loading/loading'
import './select-car.styl'
import '../user-baseinfo/userInfo.styl'
class SelectCar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadingHide: false,
            carInfoList: []
        }
        this.scroll = React.createRef()
        this.formBox = React.createRef()
        this.getCarList = this.getCarList.bind(this)
        this.selectCarGotoPage = this.selectCarGotoPage.bind(this)
        this.back =this.back.bind(this)
    }
    componentDidMount() {
        this.getCarList()
        let _height = window.innerHeight - 40
        this.formBox.current.style.height = `${_height}px`
        this.scroll.current.refresh()
        
        this.type = this.props.match.params.id
        console.log(this.type);
    }
    selectCarGotoPage(item) {
        let _type = this.type
        //还款记录
        if (_type === '1') {
            this.props.history.push('/bill')
          localStorage.setItem('carListInfo', JSON.stringify(item))
          // localStorage.setItem('CardNum', item.CardNum)
        }
        //通行记录
        if (_type === '2') {
          // console.log(carNo)
          this.props.history.push('/recordCar')
          localStorage.setItem('carListInfo', JSON.stringify(item))
          // localStorage.setItem('CardNum', item.CardNum)
        }
      }
      
    getCarList () {
        let that = this
        let _params = {
            data: {}
        }
        axios({ method: 'post',
                url: url + 'SubInfo/QueryWirteCard',
                data: _params
                })
                .then(function (res) {
                    if (res.data.issuccess) {
                    //   that.endOneLoop()
                    that.setState({
                        carInfoList: res.data.result
                    })
                    that.setState({loadingHide: true})
                      that.btnDisable = false
                    } else {
                       that.setState({tipsText: res.data.message})
                       that.refs.confirm.show()
                       that.btnDisable = false
                       return false
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
     
    }
    back() {
        this.props.history.push('/userBaseInfo')
      }
    render(){
        return(
    <div id="select-car">
        <div className="select-car-title">
        请先选择要查询的车辆
        </div>
        <div className="form-box" ref={this.formBox}>
        <Scroll ref={this.scroll}>
            <div className="">
            {
                this.state.carInfoList.map((item,idx) => {
                    return (
                        <div className="car-list" key={idx} onClick={(e)=>this.selectCarGotoPage(item)}>
                            <div className="car-img">
                                <img src={require('./img01.png')} alt="" />
                            </div>
                            <div className="car-number">{item.CarNum}</div>
                            <div className="icon-more"></div>
                        </div>
                    )
                })
            }
            </div>
        </Scroll>
        
        </div>
        <div className="buttonBox">
        </div>
        {
            this.state.carInfoList.length <= 0 && (
                <div className="tips-status-box">
                    <div className="ptc">
                        <TipsStatus statusClass="no-record" title="您暂时还没有办理ETC的车辆哦~" text="办理ETC" btnClick={this.back}></TipsStatus>
                    </div>
                </div>
            )
        }
        <div className="loading-box" style={{display: this.state.loadingHide ? 'none': 'block'}}>
                 <Loading title="数据加载中..." ref={this.loading}></Loading>
            </div>
    </div>)
    }
}
export default SelectCar