import { Table, Row, Col } from 'antd'
import * as React from 'react'

import style from './style.less'
import store from '../../store/store'
import {observer} from 'mobx-react'
import {moneyFormat} from "../../util/util"

interface Props {
  total: number,
  getTotal: (total) => void
}
interface State{
  shop: any
  sum: number
  //price:string
}
@observer
export default class Cart extends React.Component<Props> {
  state: State = {
    shop: [],
    sum: 0
  }
  getDate() {
    let data = store.order;
    let sum = 0;
    console.log("data",data);
    for(let i=0;i<data.length;i++){
      sum += data[i].price*data[i].count
    }
    this.setState({
      shop: data,
      sum
    },()=>{
      this.props.getTotal(this.state.sum);
    })
  }
  componentDidMount(){
    this.setState({
      shop: [],
      sum: 0
    },()=>{
      this.getDate()
    })
    
  }
  // formatNum=(num)=>{

  //   if(num.length>9){
  //     return ((Math.round(num/100000000))/10).toString()+"b"
  //   }
  // }
  render() {
    return (
      <div className={style.cart}>
        <h1>Your Receipt</h1>
        <div className={style['cart-item']}>
          {store.order.map((item, index) => {
            return (
              <Row key={index} justify='start'>
                <Col span={10} className={style['title-span']}>{item.title} </Col>
                <Col span={5}>x{item.count} </Col>
                <Col flex={1} className={style['money-span']}>${moneyFormat(item.price*item.count)} </Col>
              </Row>
            )
          })}
        </div>
        <div className={style['cart-total']}>
          <span>TOTAL</span>
          <span className={style['money-span']}>${this.state.sum}</span>
        </div>
      </div>
    )
  }
}