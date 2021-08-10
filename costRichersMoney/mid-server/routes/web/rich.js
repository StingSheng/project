const Router = require('koa-router')
const { searchRich, hasOne } = require('../../kit/rich')
const { catchError, check, generateOk } = require('../../lib/check')
const { getRich } = require('../../model/rich')

let rich = new Router()

rich.post('/search', async (ctx) => {
  try {
    let { pageIndex, pageSize, keyword } = ctx.request.body
    check(pageIndex >= 0, 'Params_Is_Not_In_Rules')
    check(pageSize >= 0, 'Params_Is_Not_In_Rules')
    let data = searchRich(pageIndex, pageSize, keyword)
    ctx.body = generateOk({
      items: data[0],
      total: data[1],
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

rich.post('/get', async (ctx) => {
  try {
    let { id } = ctx.request.body
    check(!!id,'Id_Is_Empty')
    check(hasOne(id),'Richer_Not_Found')
    let data = getRich(id)
    ctx.body = generateOk({
      info: data,
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

module.exports = rich