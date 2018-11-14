import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './loading.styl'
class Loading extends PureComponent {
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
   constructor() {
       super()
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
            <div className={'loading ' + this.props.displayType} style={{display: this.state.flag ? 'block': 'none'}}>
                <img width={this.props.size} height={this.props.size} src={require('./loading.gif')} alt=""/>
                <p className="desc">{this.props.title}</p>
            </div>
        )
    }
 }
 export default Loading