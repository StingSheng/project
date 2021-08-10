const Router = require('koa-router')
const uuid = require('uuid')
const { check, catchError, generateOk } = require('../../lib/check')
const admin = require('../../model/admin')
const { writeToken, hasToken, removeToken } = require('../../model/token')
let auth = new Router()

auth.post('/login', async (ctx) => {
  try {
    let data = ctx.request.body
    check(!!data.account,'Account_Is_Empty')
    check(!!data.pwd,'Pwd_Is_Empty')
    check(data.account === admin.account && data.pwd === admin.pwd, 'Not_Auth')
    let token = uuid.v4()
    // 记录token
    writeToken(token)
    // 写入头部
    ctx.cookies.set('token', token, {
      maxAge: 10 * 60 * 1000, // cookie有效时长
      expires: new Date('2022-02-15'), // cookie失效时间
      httpOnly: true, // 是否只用于http请求中获取
      overwrite: false, // 是否允许重写
    })
    ctx.body = generateOk({
      token,
      info: {
        nickname: 'admin',
      },
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

auth.post('/getUserInfo', async (ctx) => {
  try {
    // 解析header中的token
    let token = ctx.cookies.get("token") 
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    ctx.body = generateOk({
      nickname: 'admin',
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

auth.post('/logout', async (ctx) => {
  try {
    // 解析header中的token
    let token = ctx.cookies.get("token")
    check(!!token, 'User_Not_Login')
    check(hasToken(token), 'User_Login_Outdate')
    removeToken(token)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})

module.exports = auth
