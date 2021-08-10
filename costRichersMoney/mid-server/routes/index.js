const Router = require('koa-router')
const _console = require('./console')
const _web = require('./web')
let api = new Router()

api.use('/console', _console.routes(), _console.allowedMethods())
api.use('/web', _web.routes(), _web.allowedMethods())

module.exports = api
