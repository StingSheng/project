import { observer } from "mobx-react";
import * as React from "react";
import {Link, RouteComponentProps} from "react-router-dom"
import style from "./style.less"
import store from '../../store/store'
import {getImgUrl} from '../../util/util'
import {IRich} from '../../store/type'

interface Props {
  richer: IRich
}
@observer
export default class Rich extends React.Component<Props> {

  setRich() {
    store.cleanStore();
    store.setRich({...this.props.richer,avatar:getImgUrl(this.props.richer.avatar)})
    store.setDataFromSessionStorage();
  }

  render() {
    //获取页面传来的富豪信息
    let {richer} = this.props;
    return (
      <React.Fragment>
          {/* 点击到购买页面并发送点击的数据 */}
          <Link to={"/spend"} className={style.listRich} onClick={this.setRich.bind(this)}>
              <div className={style.listImg}>
                  <img className={style.richImg} src={getImgUrl(richer.avatar)} alt="" />
              </div>
              <div className={style.richName}>{richer.nickname}</div>
          </Link>
      </React.Fragment>
    )
}
}