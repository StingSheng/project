import * as React from 'react'
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom'

import Home from '../Home'
import Spend from '../Spend'

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Home}></Route>
          <Route path='/spend' component={Spend}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}