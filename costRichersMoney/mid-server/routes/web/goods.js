const Router = require('koa-router')
const { searchGoods, hasOne } = require('../../kit/goods')
const { catchError, check, generateOk } = require('../../lib/check')
const { getGoods } = require('../../model/goods')

let goods = new Router()

goods.post('/search', async (ctx) => {
  try {
    let { pageIndex, pageSize, keyword } = ctx.request.body
    check(pageIndex >= 0, 'Params_Is_Not_In_Rules')
    check(pageSize >= 0, 'Params_Is_Not_In_Rules')
    let data = searchGoods(pageIndex, pageSize, keyword)
    ctx.body = generateOk({
      items: data[0],
      total: data[1],
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

goods.post('/get', async (ctx) => {
  try {
    let { id } = ctx.request.body
    check(!!id, 'Id_Is_Empty')
    check(hasOne(id),'GoodsID_Not_Found')
    let data = getGoods(id)
    ctx.body = generateOk({
      info: data,
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

module.exports = goods
