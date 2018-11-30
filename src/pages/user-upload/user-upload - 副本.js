import React, { Component} from 'react'
import Scroll from 'base/scroll/scroll'
// import {withRouter} from "react-router-dom";
import { connect } from 'react-redux'
import { actionCreators } from '../home/store';
import axios from 'common/js/http'
import Confirm from 'base/confirm/confirm'
import { url } from 'common/js/config'
import HeadStep from 'base/head-step/head-step'
import { toObject, toJS } from 'immutable'
import ImageUtil from './imgcomPress'
import Exif from 'exif-js'
import '../user-baseinfo/userInfo.styl'
// @connect(
// 	state=>state.userApplyStepList,
// 	{getUserBaseInfo}
// )
class UserUpload extends Component {
    constructor() {
        super()
        this.state = {
            btnDisable: false,
            destroyInput: false,
            tipsText: ''
        }
        this.inputChange = this.inputChange.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.uploadImgSrc = [
            {src: require('./pic01.png'), isUploaded: false, IDfication: '上传身份证正面照', TypeID: 1011},
            {src: require('./pic02.png'), isUploaded: false, IDfication: '上传身份证反面照', TypeID: 1012},
            {src: require('./pic04.png'), isUploaded: false, IDfication: '上传驾驶证正页照', TypeID: 1013},
            {src: require('./pic03.png'), isUploaded: false, IDfication: '上传驾驶证副页照', TypeID: 1014},
            {src: require('./pic04.png'), isUploaded: false, IDfication: '上传行驶证正面照', TypeID: 1015},
            {src: require('./pic03.png'), isUploaded: false, IDfication: '上传行驶证反面照', TypeID: 1016},
        ]
        this.destroyInput = false // 是否销毁input元素, 解决在第二次和第一次选择的文件相同时不触发onchange事件的问题
        this.isIos = ImageUtil.isIos
        this.btnDisable = false
    }
    componentDidMount () {
        this.props.getUserBaseInfo()  
        // console.log('this.props.apply',(this.props.apply).toObject());
        
    }
    inputChange(e) {
        this.SubClick(e.target)
    }
    SubClick(obj) {
        var that = this
        //ios 修复下不能多次选择同一张图片
        this.destroyInput = true
        this.setState({destroyInput: true}) //触发view渲染
        setTimeout(() => {
          this.destroyInput = false
          this.setState({destroyInput: false})
        }, 20)
        var f = obj.files[0]
        var fileType = f.type
        var fileSize = f.size
        if (['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].indexOf(fileType) < 0) {
          alert('请上传图片')
          return false
        }
        if (fileSize > 10 * 1024 * 1024) {
          alert('请上传不超过10M的图片')
          return false
        }
        var index = obj.id
        //loading载图片
        that.uploadImgSrc[index]['src'] = require('./loading.gif')
        var result = null
        let t = this
        Exif.getData(f, function() {
          //获取图片的拍摄方向的数据
          t.Orientation = Exif.getTag(f, 'Orientation')
        })
        var reader = new FileReader()
        reader.readAsDataURL(f)
        reader.onload = function(e) {
          var quality = 0.8
          if (f.size > 1024 * 500) { //若图片大小大于0.5M，压缩比例重新设置 1M=1024*1024
            quality = 0.5
          }
          var result = e.target.result //返回的dataURL
          //修正图片方向
          t.ImageCompress(result, t.Orientation, quality, function(data) {
            var img = new Image()
            img.onload = function() {
              // oShowImg.src = data
              // console.log('data____', data)
              // var FileBase64 = cvs.toDataURL('image/jpeg', 0.5)
              t.begainUpload(data, index)
            }
            img.src = data
          })
        }
        // reader.readAsDataURL(f)
      }
      /*
    *FileBase64：上传的图片
    *index第几个选择框
    */
    begainUpload(FileBase64, index) { //
        var that = this
        var needData = {
          IDfication: that.uploadImgSrc[index]['IDfication'],
          TypeID: that.uploadImgSrc[index]['TypeID'],
          Relation: (that.props.apply).toObject()['Relation'],
          FileBase64: FileBase64
        }
        // console.log('postData', needData)
        axios({
            method: 'POST',
            url: url + '/SubInfo/SubPhoto', //上传接口
            data: needData,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(function(res) {
            // console.log('response----------:', res)
            that.uploadImgSrc[index]['src'] = url + res.data.result.Url
            that.uploadImgSrc[index]['isUploaded'] = true
            that.props.getUserBaseInfo() 
            that.btnDisable = false
          })
          .catch(function(error) {
            that.uploadImgSrc[index]['src'] = require('./fail.png')
            that.uploadImgSrc[index]['isUploaded'] = false
            that.btnDisable = false
            console.log(error)
          })
      }
      ImageCompress(img, dir, quality, next) {
        var image = new Image()
        image.onload = function() {
          var degree = 0,
            drawWidth, drawHeight, width, height
          //原始宽高
          drawWidth = this.naturalWidth
          drawHeight = this.naturalHeight
          //以下改变一下图片大小
          var maxSide = Math.max(drawWidth, drawHeight)
          if (maxSide > 1024) {
            var minSide = Math.min(drawWidth, drawHeight)
            minSide = minSide / maxSide * 1024
            maxSide = 1024
            if (drawWidth > drawHeight) {
              drawWidth = maxSide
              drawHeight = minSide
            } else {
              drawWidth = minSide
              drawHeight = maxSide
            }
          }
          //使用canvas修正图片的方向
          var canvas = document.createElement('canvas')
          canvas.width = width = drawWidth
          canvas.height = height = drawHeight
          var context = canvas.getContext('2d')
          //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
          if (dir && dir !== '' && dir !== 1) {
            switch (dir) {
              //iphone横屏拍摄，此时home键在左侧
              case 3:
                degree = 180
                drawWidth = -width
                drawHeight = -height
                break
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
              case 6:
                canvas.width = height
                canvas.height = width
                degree = 90
                drawWidth = width
                drawHeight = -height
                break
                //iphone竖屏拍摄，此时home键在上方
              case 8:
                canvas.width = height
                canvas.height = width
                degree = 270
                drawWidth = -width
                drawHeight = height
                break 
            }
          }
          //使用canvas旋转校正
          context.rotate(degree * Math.PI / 180)
          context.drawImage(this, 0, 0, drawWidth, drawHeight)
          //返回校正图片
          next(canvas.toDataURL("image/jpeg", quality || 0.8))
        }
        image.src = img
      }
      nextPage() {
        if (!this.uploadImgSrc[0]['isUploaded']) {
            this.setState({tipsText: `请选择${this.uploadImgSrc[0]['IDfication']}`})
            this.refs.confirm.show()
          return false
        }
        if (!this.uploadImgSrc[1]['isUploaded']) {
            this.setState({tipsText: `请选择${this.uploadImgSrc[1]['IDfication']}`})
            this.refs.confirm.show()
          return false
        }
        if (!this.uploadImgSrc[2]['isUploaded']) {
            this.setState({tipsText: `请选择${this.uploadImgSrc[2]['IDfication']}`})
            this.refs.confirm.show()
          return false
        }
        if (!this.uploadImgSrc[3]['isUploaded']) {
            this.setState({tipsText: `请选择${this.uploadImgSrc[3]['IDfication']}`})
            this.refs.confirm.show()
          return false
        }
        if (!this.uploadImgSrc[4]['isUploaded']) {
          this.setState({tipsText: `请选择${this.uploadImgSrc[4]['IDfication']}`})
          this.refs.confirm.show()
          return false
        }
        if (!this.uploadImgSrc[5]['isUploaded']) {
            this.setState({tipsText: `请选择${this.uploadImgSrc[5]['IDfication']}`})
            this.refs.confirm.show()
            return
        }
        // this.props.getUserBaseInfo()
        this.props.history.push('/userAddAddress')
      }
    render() {
        // let listphoto = this.props.listphoto
        let listphoto = this.props.listphoto && this.props.listphoto.toJS()
        if (listphoto && listphoto.length > 0) {
            var listPhotoArr = listphoto
            listPhotoArr.forEach((item) => {
            let oldTypeID = item.TypeID.toString()
            let index = oldTypeID.substr(oldTypeID.length - 1, 1) -1 //index 的索引根据TypeID字段最后一个值来确定
            this.uploadImgSrc[index]['src'] = url + item.Url
            this.uploadImgSrc[index]['isUploaded'] = true

            
            })
        }
        // let apply = this.props.apply && this.props.apply.toJS()
        // if (apply) this.Relation = apply.Relation
        return(<div id="user-baseinfo">
            <Scroll ref={this.scroll}>
                <div className="wrapper">
                    <HeadStep step={3}></HeadStep>
                    <div className="form-box">
                        <div className="inputBox padType">
                            <div className="input size-2 align-0">
                                <h2>上传身份证照片</h2>
                            </div>
                        </div>
                        <div className="list-box">
                            <ul>
                                <li>
                                    <div className="img-box">
                                        <img src={this.uploadImgSrc[0]['src']} alt=""/>
                                    </div> <p className="desc">{this.uploadImgSrc[0]['IDfication']}</p>
                                    {this.isIos && !this.destroyInput ? (
                                        <input type="file"  onChange={this.inputChange} id="0" accept="image/jpg,image/jpeg,image/png,image/gif" />
                                    ): null}
                                     {!this.isIos && !this.destroyInput ? (
                                        <input type="file"  onChange={this.inputChange} id="0" accept="image/jpg,image/jpeg,image/png,image/gif" />
                                    ): null}
                                </li>
                                <li>
                                    <div className="img-box">
                                        <img src={this.uploadImgSrc[1]['src']} alt=""/>
                                    </div>
                                    <p className="desc">{this.uploadImgSrc[1]['IDfication']}</p> 
                                    <input type="file"  onChange={this.inputChange} text="请选择图片" id="1" accept="image/jpg,image/jpeg,image/png,image/gif" />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="h10"></div>
                    <div className="form-box">
                        <div className="inputBox padType">
                            <div className="input size-2 align-0">
                                <h2>上传驾驶证照片</h2>
                            </div>
                        </div>
                        <div className="list-box">
                            <ul>
                                <li>
                                    <div className="img-box">
                                        <img src={this.uploadImgSrc[2]['src']} alt=""/>
                                    </div> <p className="desc">{this.uploadImgSrc[2]['IDfication']}</p>
                                    <input type="file"  onChange={this.inputChange} id="2" accept="image/jpg,image/jpeg,image/png,image/gif" />
                                </li>
                                <li>
                                    <div className="img-box">
                                        <img src={this.uploadImgSrc[3]['src']} alt=""/>
                                    </div>
                                    <p className="desc">{this.uploadImgSrc[3]['IDfication']}</p> 
                                    <input type="file"  onChange={this.inputChange} text="请选择图片" id="3" accept="image/jpg,image/jpeg,image/png,image/gif" />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="h10"></div>
                    <div className="form-box">
                        <div className="inputBox padType">
                            <div className="input size-2 align-0">
                                <h2>上传行驶证照片</h2>
                            </div>
                        </div>
                        <div className="list-box">
                            <ul>
                                <li>
                                    <div className="img-box">
                                        <img src={this.uploadImgSrc[4]['src']} alt=""/>
                                    </div> <p className="desc">{this.uploadImgSrc[4]['IDfication']}</p>
                                    <input type="file"  onChange={this.inputChange} id="4" accept="image/jpg,image/jpeg,image/png,image/gif" />
                                </li>
                                <li>
                                    <div className="img-box">
                                        <img src={this.uploadImgSrc[5]['src']} alt=""/>
                                    </div>
                                    <p className="desc">{this.uploadImgSrc[5]['IDfication']}</p>
                                     <input type="file"  onChange={this.inputChange} text="请选择图片" id="5" accept="image/jpg,image/jpeg,image/png,image/gif" />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="buttonBox">
                        <div className={'button ' + (this.state.btnDisable ? "disable": "")} onClick={this.nextPage}>
                                下一步
                        </div>
                    </div>
                    <div style={{height: '40px'}}></div>
                </div>
            </Scroll>
            <Confirm text={this.state.tipsText} confirmType='2' ref="confirm"></Confirm>
        </div>)
    }
}
const mapState = (state) => ({
    userApplyStepList: (state.getIn(['home', 'userApplyStepList'])),
    apply: (state.getIn(['home', 'userApplyStepList', 'apply'])),
    listphoto:(state.getIn(['home', 'userApplyStepList', 'listphoto']))
})

const mapDispatch = (dispatch) => ({
	changeHomeData() {
		dispatch(actionCreators.getHomeInfo())
    },
    getUserBaseInfo() {
		dispatch(actionCreators.getUserBaseInfo())
	}
})
export default connect(mapState, mapDispatch)(UserUpload)
