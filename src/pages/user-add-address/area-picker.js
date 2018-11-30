import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'
import Picker from 'better-picker'
import city from './city'

export default class AreaPicker extends Component {
    static propTypes = {
        defaultArea: PropTypes.string,
        selectedAreaFn: PropTypes.func

    }
    static defaultProps = {
        defaultArea: '北京 西城区',
        selectedAreaFn: f => f
    }
    constructor() {
        super()
        this.aera = React.createRef()
    }
    componentDidMount() {
        this.defaultAreaInit(this.props.defaultArea)
    }
    defaultAreaInit(val) {
        console.log('watch', val)
        var dateData = city
        console.log('defaultArea---', val)
        var province = val.split(' ')[0]
        var month = val.split(' ')[1]
        var date = val.split(' ')[2]
  
        var first = []
        var second = []
        var third = []
        var selectedIndex = [1, 0, 0] /* 数组第一项设置为1 修复 创建月列表少一个的问题 */
        var checked = [0, 0, 0] /* 已选选项 */
        this._creatList(dateData, first, (list) => { //创建年列表
          this.firstArr = list
        })
        this.provinceIdx = this._getKeyByValue(province, this.firstArr)
        console.log(this.provinceIdx)
        if (dateData[this.provinceIdx].hasOwnProperty('sub')) { //创建月份列表
          this._creatList(dateData[this.provinceIdx].sub, second, (list) => {
            this.secondArr = list
          })
        } else {
          second = [{text: '', value: 0}]
        }
        this.cityIdx = this._getKeyByValue(month, this.secondArr)
        console.log(this.cityIdx)
        if (dateData[this.provinceIdx].sub[this.cityIdx].hasOwnProperty('sub')) { //创建日期列表
          this._creatList(dateData[this.provinceIdx].sub[this.cityIdx].sub, third, (list) => {
            this.thirdArr = list
          })
        } else {
          third = [{text: '', value: 0}]
        }
        this.thirIdx = (this.thirdArr && this._getKeyByValue(date, this.thirdArr)) || 0
        console.log(this.thirIdx)
  
        this._initAera(this.provinceIdx, this.cityIdx, this.thirIdx)
      }
    _initAera(InitYear, InitMonth, InitDate) {
        var selectedYear = InitYear || 0
        var selectedMonth = InitMonth || 0
        var selectedDate = InitDate || 0
        var that = this
        var aeraEl = this.aera.current
         var first = [] /* 年 */
         var second = [] /* 月 */
         var third = [] /* 日 */
         var selectedIndex = [selectedYear, selectedMonth, selectedDate] /* 默认选中的日期 */
         var checked = selectedIndex /* 已选选项 */
         this._creatList(city, first, (list) => {
           // console.log('first:', list)
           this.firstArr = list
         })
         var dateData = city
         if (dateData[selectedIndex[0]].hasOwnProperty('sub')) {
           console.log('-----', dateData[selectedIndex[0]])
           this._creatList(dateData[selectedIndex[0]].sub, second, (list) => {
             // console.log('second:', list)
             this.secondArr = list
           })
         } else {
           second = [{text: '', value: 0}]
         }
         if (dateData[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
           this._creatList(dateData[selectedIndex[0]].sub[selectedIndex[1]].sub, third, (list) => {
             console.log('third:', list)
             this.thirdArr = list
           })
         } else {
           third = [{text: '', value: 0}]
         }
         this.picker = new Picker({data: [first, second, third], selectedIndex: selectedIndex, title: '日期选择'
         })
        // this.picker = new Picker({data: [data1], selectedIndex: [0], title: '选择车牌颜色'})
        aeraEl.addEventListener('click', function() {
          that.picker.show()
        })
        this.picker.on('picker.select', function (selectedVal, selectedIndex) {
         var text1 = first[selectedIndex[0]].text
         var text2 = second[selectedIndex[1]].text
         var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : ''
         var selectedArea = text1 + ' ' + text2 + ' ' + text3
         aeraEl.innerText = selectedArea
        //  that.$emit('selectedArea', selectedArea)
         that.props.selectedAreaFn(selectedArea)
       })
       /**每一项的值改变之后**/
       this.picker.on('picker.change', function(index, selectedIndex) {
         console.log('picker.change', index)
         console.log('picker.change', selectedIndex)
         if (index === 0) {
           firstChange()
         } else if (index === 1) {
           secondChange()
         }
         function firstChange() {
          second = []
          third = []
          checked[0] = selectedIndex
          var firstCity = dateData[selectedIndex]
          if (firstCity.hasOwnProperty('sub')) {
            that._creatList(firstCity.sub, second)
 
            var secondCity = dateData[selectedIndex].sub[0]
            if (secondCity.hasOwnProperty('sub')) {
              that._creatList(secondCity.sub, third)
            } else {
              third = [{text: '', value: 0}]
              checked[2] = 0
            }
          } else {
            second = [{text: '', value: 0}]
            third = [{text: '', value: 0}]
            checked[1] = 0
            checked[2] = 0
          }
          that.picker.refillColumn(1, second)
          that.picker.refillColumn(2, third)
          that.picker.scrollColumn(1, 0)
          that.picker.scrollColumn(2, 0)
        }
        function secondChange() {
          third = []
          checked[1] = selectedIndex
          var firstIndex = checked[0]
          if (dateData[firstIndex].sub[selectedIndex].hasOwnProperty('sub')) {
            var secondCity = dateData[firstIndex].sub[selectedIndex]
            that._creatList(secondCity.sub, third)
            that.picker.refillColumn(2, third)
            that.picker.scrollColumn(2, 0)
          } else {
            third = [{text: '', value: 0}]
            checked[2] = 0
            that.picker.refillColumn(2, third)
            that.picker.scrollColumn(2, 0)
          }
        }
       })
       this.picker.on('picker.select', function (selectedVal, selectedIndex) {
           console.log('select', selectedVal)
       })
      }
    _getKeyByValue(val, arr) {
        var ret = ''
         arr.forEach(function(item, i) {
           if (item['text'] === val) {
             ret = item['value']
             return false
           }
         })
         return ret
       }
    _creatList(obj, list, cb) {
        obj.forEach(function (item, index, arr) {
            var temp = {}
            temp.text = item.name
            temp.value = index
            list.push(temp)
        })
        // console.log(list)
        cb && cb(list)
    }
    render() {
        return (
            <div id="aeraPicker" ref={this.aera}>
                {this.props.defaultArea}
            </div>
        )}
}