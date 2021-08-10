import * as React from "react"
import { Route } from "react-router";
import { Layout, Menu } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import { Link, NavLink } from "react-router-dom";
import style from './style.less'
import Goods from "../../views/Goods";
import Order from "../../views/Order";
import Richers from "../../views/Richers";
import { observer } from "mobx-react";
import store from "../../store/store"

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
@observer
export default class myLayout extends React.Component<any> {
  render() {
    return (
      <Layout className={style.homePage}>
        <Header className={style.homeHeader}>
          <span className={style.homeName}>花光他们的钱管理后台</span>
          <span className={style.homeQuit}>{store.name}<Link to="/" style={{ color: "white", marginLeft: 5 }}><ExportOutlined /></Link></span>
        </Header>
        <Layout className={style.homePage}>
          <Sider width={200} className="site-layout-background">
            <Menu
              className={style.menu}
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1"><Link to="/richers" className={style.richersMenu}>富豪榜</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/goods" className={style.goodsMenu}>商品管理</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/order" className={style.orderMenu}>订单管理</Link></Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '25px 25px' }}>
            <Content
              className={style.sitelayoutbackground}
              style={{
                padding: 20,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Route exact path='/goods' component={Goods}></Route>
              <Route exact path='/order' component={Order}></Route>
              <Route exact path='/richers' component={Richers}></Route>
            </Content>
          </Layout>
        </Layout>
      </Layout>

    )
  }
}