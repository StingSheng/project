const Router = require('koa-router')
const { searchOrder, hasOne } = require('../../kit/order')
const { check, catchError, generateOk } = require('../../lib/check')
const { getOrder } = require('../../model/order')
const { hasToken } = require('../../model/token')
let order = new Router()

order.post('/search', async (ctx) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    let { pageIndex, pageSize, keyword } = ctx.request.body
    check(pageIndex >= 0, 'Params_Is_Not_In_Rules')
    check(pageSize >= 0, 'Params_Is_Not_In_Rules')
    let data = searchOrder(pageIndex, pageSize, keyword)
    ctx.body = generateOk({
      items: data[0],
      total: data[1],
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

order.post('/get', async (ctx) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    let { id } = ctx.request.body
    check(hasOne(id), 'OrderId_Not_Found')
    let data = getOrder(id)
    ctx.body = generateOk({ info: data })
  } catch (err) {
    catchError(err, ctx)
  }
})

module.exports = order
