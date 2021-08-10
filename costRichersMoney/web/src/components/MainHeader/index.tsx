import * as React from 'react'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { Button, Modal } from 'antd'
import Cart from '../Cart'

import { Layout, Menu, Breadcrumb } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import style from './style.less'
import cart from '../../assets/imgs/cart.svg'
import { observer } from "mobx-react";
import store from '../../store/store'
import { commitOrder } from '../../services/api'

interface State {
  cartVisible: boolean
  orderVisible: boolean
  successVisible: boolean
  total: number
}
@observer
class MainHeader extends React.Component<RouteComponentProps> {

  state: State = {
    cartVisible: false,
    orderVisible: false,
    successVisible: false,
    total: 0
  }

  componentDidMount() {
    if (this.props.location.pathname === '/') {
      this.setState({
        cartVisible: false
      })
    } else {
      this.setState({
        cartVisible: true
      })
    }
  }

  getTotal(total) {
    console.log(total);
    this.setState({
      total
    })
  }

  cartOrder = () => {
    this.setState({
      orderVisible: true,
      successVisible: false
    })
  }

  async commitOrder() {
    console.log(store);
    let res = await commitOrder({ richId: store.rich.id, goodsIds: store.order });
    if (res.stat === 'ok') {
      this.setState({
        orderVisible: false,
        successVisible: true
      })
    } else {
      console.error(res.msg);
    }
  }

  orderSuccess = () => {
    this.commitOrder();
  }

  handleCancel = () => {
    this.setState({
      orderVisible: false,
      successVisible: false
    })
  }

  toHome = () => {
    this.setState({
      orderVisible: false,
      successVisible: false
    })
    this.props.history.push("/")
  }

  countSum = () => {
    let count = 0
    for (let i = 0; i < store.order.length; i++) {
      count += store.order[i].count
    }
    return count
  }

  render() {
    return (
      <Layout>
        <Header className={style.header}
          style={{ height: 96 }}>
          <div className={style.headerHome}>
            <Link to="/" className={style.logo}>Logo</Link>
            {this.state.cartVisible && <div>
              <img className={style.cart} src={cart} alt="" onClick={this.cartOrder} />
              {store.count}
            </div>}
            <Modal visible={this.state.orderVisible} onCancel={this.handleCancel} footer={false}>
              <Cart total={this.state.total} getTotal={(total) => this.getTotal(total)} />
              <div className={style['order-btn']}>
                <Button onClick={this.handleCancel}>取消</Button>
                <Button onClick={this.orderSuccess}>下单</Button>
              </div>
            </Modal>
            <Modal visible={this.state.successVisible} onCancel={this.toHome} footer={false}>
              <span>尊敬的先生/女士，您共消费{this.state.total}元</span>
            </Modal>
          </div>
        </Header>
      </Layout>
    )
  }
}

export default withRouter(MainHeader)