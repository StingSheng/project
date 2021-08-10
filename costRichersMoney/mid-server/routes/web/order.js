const Router = require('koa-router')
const { hasOne } = require('../../kit/rich')
const { catchError, check, generateOk } = require('../../lib/check')
const { getRich } = require('../../model/rich')
const goodsKit = require('../../kit/goods')
const { getGoods } = require('../../model/goods')
const uuid = require('uuid')
const { setOrder } = require('../../model/order')

let order = new Router()

order.post('/commit', async (ctx) => {
  try {
    let { richId, goodsIds } = ctx.request.body
    check(hasOne(richId),'Richer_Not_Found')
    goodsIds.map((item) => check(goodsKit.hasOne(item.id)))
    let _goods = goodsIds.map((item) => ({
      item: getGoods(item.id),
      count: item.count,
    }))
    let richer = getRich(richId)
    let total = _goods.reduce((a, b) => a + b.item.price * b.count, 0)
    check(total <= richer.worth, 'Worth_Not_Enough')
    let ctime = new Date().getTime()
    const id = uuid.v4()
    let obj = {
      richer,
      goods: _goods,
      ctime,
      id,
    }
    setOrder(obj)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})

module.exports = order
