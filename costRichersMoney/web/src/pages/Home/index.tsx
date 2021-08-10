import * as React from 'react'
import { observer } from 'mobx-react'
import store from '../../store/store'
import { RouteComponentProps } from 'react-router-dom'
import { searchRich } from '../../services/api'

import style from "./style.less"
import Rich from '../../components/Rich'
import MainHeader from '../../components/MainHeader'
import { getImgUrl } from '../../util/util'
import { IRich } from '../../store/type'


interface State {
  richers: IRich[]
}
@observer
export default class Home extends React.Component<RouteComponentProps> {

  state: State = {
    richers: []
  }
  //判断只有一个富豪的情况
  getRichers() {
    if (this.state.richers.length === 1) {
      store.cleanStore();
      console.log("store", store);
      store.setRich({
        id: this.state.richers[0].id,
        nickname: this.state.richers[0].nickname,
        avatar: getImgUrl(this.state.richers[0].avatar),
        worth: this.state.richers[0].worth
      })
      store.setDataFromSessionStorage();
      this.props.history.push('/spend')
    }
  }
  async loadRich() {
    let res = await searchRich({ pageIndex: 1, pageSize: 0, keyword: '' });
    if (res.stat === 'ok') {
      let data = res.data.items.filter(function (item) {
        return item.status === 0;
      });
      this.setState({
        richers: data
      }, () => {
        this.getRichers();
      })
    } else {
      console.error(res.msg)
    }
  }
  componentDidMount() {
    this.loadRich()
  }

  // componentWillUnmount() {
  //   store.getDataFromSessionStorage();
  // }

  render() {
    let len = this.state.richers.length;
    return (
      <React.Fragment>
        <MainHeader />
        {len === 0 && (
          <main className={style.richers}>
            <h1>富豪正在创建中...</h1>
          </main>
        )}
        {len > 1 && (
          <main className={style.richers}>
            <div className={style.list}>
              {/* 遍历富豪数组 */}
              {this.state.richers.map((richer, index) => {
                return <Rich key={index} richer={richer} />
              })}
            </div>
            <div className={style.selectRich}>请选择你的身份</div>
          </main>
        )}
      </React.Fragment>
    )
  }
}