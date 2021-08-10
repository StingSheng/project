import { Button, Input, Tag, Table, Modal, Space, Row, Col,message } from "antd";
import * as React from "react";
import { useState } from "react";
import { Component } from "react";
import style from "./style.less";
import { searchOrder } from '../../services/api'
import { formatTime } from '../../util/util'
interface State {
  modalVisible: boolean
  data: any
  currentItem: any
  search: string
}
export default class Order extends React.Component {
  state: State = {
    modalVisible: false,
    data: [],
    //currentItem数组用来存储当前行的数据
    currentItem: { goods: [] },
    search: ''
  };
  columns = [
    // dataIndex:列数据在数据项中对应的路径，支持通过数组查询嵌套路径
    {
      title: "下单人",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "订单价格",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "剩余",
      dataIndex: "restMoney",
      key: "restMoney",
    },
    {
      title: "购买时间",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "操作",
      key: "action",
      //text不可以删除，删了就无法取出record的值     
      render: (record) => (
        <Space size="middle">
          <Button size="small" type="dashed" onClick={() => {
            this.setState({ modalVisible: true, currentItem: record })
          }} >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  componentDidMount() {
    this.loadOrder();
  }
  async loadOrder(keyword = '') {
    let res = await searchOrder({ pageIndex: 1, pageSize: 0, keyword });
    if (res.stat === 'ok') {
      let orders = res.data.items;
      let data = [];
      for (let i = 0; i < res.data.total; i++) {
        let price = this.calculateTotalmoney(orders[i].goods);
        let obj = {
          nickname: orders[i].richer.nickname,
          price,
          restMoney: orders[i].richer.worth - price,
          time: formatTime(orders[i].ctime),
          goods: orders[i].goods,
          id: orders[i].id
        }
        data.push(obj);
      }
      this.setState({
        data
      })
    }else {
      message.error('数据加载失败，请重新登录！');
    }
  }
  handleOk = () => {
    this.setState({
      modalVisible: false,
    })
  };
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    })
  };
  calculateTotalmoney(goods) {
    let spendTotalMoney = 0
    for (let i = 0; i < goods.length; i++) {
      spendTotalMoney += goods[i].item.price * goods[i].count
    }
    return spendTotalMoney
  }
  ref = React.createRef();
  //搜索
  //搜索
  onSearch = value => {
    this.loadOrder(value);
  }
  onChange = e => {
    this.setState({
      search: e.target.value
    })
  }
  //重置
  onReset = () => {
    this.setState({
      search: ''
    })
    this.loadOrder();
  }
  render() {
    return (
      <React.Fragment>
        <div className={style.top}
          style={{ paddingTop: 10 }}>
          <div>
            <Input.Search placeholder='搜索' onSearch={this.onSearch} className={style.search}
            allowClear value={this.state.search} onChange={this.onChange}
              style={{ width: 320, marginLeft: 20 }}
            ></Input.Search>
            <Button type='default' onClick={this.onReset}>重置</Button>
          </div>
        </div>
        <div className={style["main-table"]}>
          <Table
            columns={this.columns}
            dataSource={this.state.data}
            rowKey="id"
          />
        </div>
        <Modal
          title="订单详情"
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className={style["show-div"]}>
            <span className={style["show-span"]}>下单人:{this.state.currentItem.nickname}</span>
            <span className={style["show-span"]}>下单时间:{this.state.currentItem.time}</span>
            <span className={style["show-span"]}>总价格:${this.state.currentItem.price}</span>
            <span className={style["show-span"]}>剩余:${this.state.currentItem.restMoney}</span>
          </div>
          {this.state.currentItem.goods.length > 0 && this.state.currentItem.goods.map((item, index) => {
            let good = item.item;
            return (
              <div key={index} className={style["show-goods-div"]}>
                <Row key={index} justify='start'>
                  <Col span={10} className={style['title-span']}>{good.title} </Col>
                  <Col span={5}>x{item.count} </Col>
                  <Col flex={1} className={style['money-span']}>${good.price * item.count} </Col>
                </Row>
              </div>
            )
          })}
        </Modal>
      </React.Fragment>
    );
  }
}

