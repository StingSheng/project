import * as React from 'react'
import style from './style.less'
import { observer } from 'mobx-react'

import store from '../../store/store'
import {toThousands} from '../../util/util'

interface Props {
  money: number
}
@observer
export default class ContentHeader extends React.Component<Props> {
  componentDidMount() {
    
  }
  render() {
    return (
      <React.Fragment>
        <h1>
          <img alt="" src={store.rich.avatar} className={style.richer} />
          {store.rich.nickname}
        </h1>
        <div className={style.worth} id="worth">
          ${toThousands(Math.round(this.props.money))}
        </div>
      </React.Fragment>
    )
  }
}