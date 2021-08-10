const Router = require('koa-router')
const uuid = require('uuid')
const { check, catchError, generateOk } = require('../../lib/check')
const path = require('path')
let form = new Router()
const fs = require('fs')
const queryString = require('querystring')
const { uploadFile } = require('../../kit/upload')

form.post('/upload', async (ctx) => {
  try {
    let [reqPath, query] = ctx.req.url.split('?')
    let params = query ? queryString.parse(query) : {}
    console.log(params)
    let serverFilePath = path.join(__dirname, '../../static/images')
    let name = params.filename
    check(!!name)
    let ext = path.extname(name).toLowerCase()
    let newName = uuid.v4() + ext
    let stream = fs.createWriteStream(path.join(serverFilePath, newName))
    ctx.req.pipe(stream)
    ctx.body = generateOk({
      file: `/images/${newName}`,
    })
    // console.log(ctx)
  } catch (err) {
    catchError(err, ctx)
  }
})

form.post('/upload_v2', async (ctx) => {
  try {
    let res = await uploadFile(ctx)
    check(res.success, 'Upload_Success')
    ctx.body = generateOk({
      file: res.formData.url
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

module.exports = form
