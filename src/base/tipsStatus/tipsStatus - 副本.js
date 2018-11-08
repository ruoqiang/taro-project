import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
        btnClick: f => f,
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
        this.props.btnClick()
      }
      show() {
        this.setState({flag: true})
      }
      hide() {
        this.setState({flag: false})
      }
    render () {
        return (
            <div className="tips-status" style={{'display': this.state.flag}}>
                <p className="statusImg"></p>
                <p className="desc">{this.props.title}</p>
                {!this.props.buttonHide === true? (
                  <div className="backbutton" onClick={this.confirm}>
                    {this.props.text}
                </div>
                ) : null}
        </div>
        )
    }
}
export default TipsStatus