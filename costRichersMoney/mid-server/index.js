const Koa = require('koa')
const logger = require('./middleware/logger')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const api = require('./routes')
const { init } = require('./lib')
const Router = require('koa-router')
const static = require('koa-static')
const route = new Router()
const path = require('path')

init()
const staticPath = './static'

app.use(bodyParser())
app.use(static(path.join(__dirname, staticPath)))

// app.use(logger())

route.use('/api', api.routes(), api.allowedMethods())

app.use(route.routes()).use(route.allowedMethods())

app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')
