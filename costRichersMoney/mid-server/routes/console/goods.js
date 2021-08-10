const Router = require('koa-router')
const uuid = require('uuid')
const { searchGoods, hasOne } = require('../../kit/goods')
const { check, catchError, generateOk } = require('../../lib/check')
const {
  setGoods,
  editGoods,
  deleteGoods,
  getGoods,
} = require('../../model/goods')
const { hasToken } = require('../../model/token')
let goods = new Router()

goods.post('/search', async (ctx) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
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

goods.post('/add', async (ctx) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    let { title, price, cover, limit } = ctx.request.body
    check(!!title, 'Title_Is_Empty')
    check(price > 0, 'Price_Is_Not_In_Rules')
    check(!!cover, 'Cover_Is_Empty')
    check(limit >= 0, 'Limit_Is_Not_In_Rules')
    let id = uuid.v4()
    let ctime = new Date().getTime()
    let obj = {
      title,
      price: price * 100,
      cover,
      id,
      status: 1,
      limit,
      weight: 0,
      ctime,
    }
    setGoods(obj)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})

goods.post('/set', async (ctx) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    let { id, title, price, cover, limit } = ctx.request.body
    check(hasOne(id), "GoodsID_Not_Found")
    let goods = getGoods(id)
    let obj = {
      ...goods,
      title,
      price: price * 100,
      cover,
      limit,
    }
    editGoods(obj)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})

goods.post('/setweight', async (ctx) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    let { id, weight } = ctx.request.body
    check(weight >= 0, 'Weight_Is_Not_In_Rules')
    check(hasOne(id), 'GoodsID_Not_Found')
    let goods = getGoods(id)
    let obj = {
      ...goods,
      weight,
    }
    editGoods(obj)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})

goods.post('/up', async (ctx) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    let { id } = ctx.request.body
    check(hasOne(id),'GoodsID_Not_Found')
    let goods = getGoods(id)
    let obj = {
      ...goods,
      status: 1,
    }
    editGoods(obj)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})

goods.post('/down', async (ctx) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    let { id } = ctx.request.body
    check(hasOne(id),'GoodsID_Not_Found')
    let goods = getGoods(id)
    let obj = {
      ...goods,
      status: 2,
    }
    editGoods(obj)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})

goods.post('/delete', async (ctx) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    let { id } = ctx.request.body
    check(hasOne(id),'GoodsID_Not_Found')
    deleteGoods(id)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})

module.exports = goods
