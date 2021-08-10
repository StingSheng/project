const Router = require('koa-router')
const auth = require('./auth')
const rich = require('./rich')
const order = require('./order')
const goods = require('./goods')
const form = require('./form')
let _console = new Router()

_console.use('/auth', auth.routes(), auth.allowedMethods())
_console.use('/rich', rich.routes(), rich.allowedMethods())
_console.use('/order', order.routes(), order.allowedMethods())
_console.use('/goods', goods.routes(), goods.allowedMethods())
_console.use('/form', form.routes(), form.allowedMethods())

module.exports = _console
