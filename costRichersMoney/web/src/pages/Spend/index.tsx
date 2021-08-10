import * as React from 'react'
import { observer } from 'mobx-react'
import { Layout } from 'antd';
import style from './style.less'
import { RouteComponentProps } from 'react-router-dom'
import { getGoods, searchGoods } from '../../services/api'

import store from '../../store/store'

import MainHeader from '../../components/MainHeader';
import ContentHeader from '../../components/ContentHeader';
import Good from '../../components/Good'
import InfiniteScroll from "react-infinite-scroll-component";
import Item from 'antd/lib/list/Item';
import Avatar from 'antd/lib/avatar/avatar';
import { getImgUrl } from '../../util/util';

const { Header, Footer, Content } = Layout;

// let goods = data;
interface State {
  // name: string
  money: number
  goods: any
  index: number
  total: number
}
@observer
export default class Spend extends React.Component<RouteComponentProps> {
  state: State = {
    money: 0,
    goods: [],
    index: 1,
    total: 0
  }

  componentDidMount() {
    this.loadGoods(this.state.index);
    this.setState({
      money: store.rich.worth
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async loadGoods(index) {
    let res = await searchGoods({
      pageIndex: index,
      pageSize: 6,
      keyword: "",
    });
    if (res.stat === 'ok') {
      let arr = res.data.items.filter(item => item.status == true);
      this.setState({
        goods: [...this.state.goods, ...arr],
        total: res.data.total
      });
    }
  }

  getData = async () => {
    if (this.state.total === this.state.goods.length) {
      return;
    }
    this.setState({
      index: this.state.index + 1,
    })
    this.loadGoods(this.state.index);
  };

  timer
  //type 为1 表示出售  为-1 表示购买
  changeMoney(num: number, type: number) {
    let stop = store.rich.worth + (type * num);
    store.setWorth(stop)
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      if (this.state.money !== store.rich.worth) {
        this.setState({
          money: this.state.money + 0.2 * (store.rich.worth - this.state.money)
        })
      }
    }, 50)
  }

  render() {
    store.getDataFromSessionStorage();
    return (
      <Layout style={{ height: '100%', overflow: "auto" }}>
        <InfiniteScroll
          height={950}
          dataLength={this.state.goods.length}
          next={this.getData.bind(this)}
          hasMore={true}
          loader={<h4></h4>}
        >
          <Header style={{ width: '100%', background: 'white', height: 96, padding: 0, marginBottom: 25 }}>
            <MainHeader />
          </Header>
          <Content style={{ width: '100%', height: '100%' }}>
            <div className={style.content}>
              <ContentHeader money={this.state.money} />
              <div className={style.goods}>
                {this.state.goods.map((good, index) => <Good key={index} good={good} changeMoney={this.changeMoney.bind(this)} />)}
              </div>
            </div>
          </Content>
        </InfiniteScroll>
        <Footer style={{ position: 'fixed', bottom: 0, zIndex: 1, width: '100%', background: 'white', height: 60 }}>
        </Footer>
      </Layout>
    )
  }
}