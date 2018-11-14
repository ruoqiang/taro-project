import React, { Component } from 'react'
import TipsStatus from 'base/tipsStatus/tipsStatus'
import '../application-record-list/application-record-list.styl'
class Bill extends Component {
    render(){
        return(<div>
           <div className="tips-status-box">
                        <div className="ptc">
                        <TipsStatus statusClass="no-record" title="暂时还没有该车辆的账单" text="办理ETC" buttonHide></TipsStatus>
                        </div>
                    </div>
        </div>)
    }
}
export default Bill