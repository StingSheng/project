import * as React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Login from '../../pages/Login'
import Goods from '../../views/Goods'
import Order from '../../views/Order'
import Richers from '../../views/Richers'
import myLayout from '../Layout'

export default class App extends React.Component {
  render() {
    return (
      // 路由信息
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Login}></Route>
          <Route exact path='/Richers' component={myLayout}></Route>
          <Route exact path='/goods' component={myLayout}></Route>
          <Route exact path='/order' component={myLayout}></Route>
          <Route render={() => <div>404</div>}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}