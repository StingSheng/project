const uuid = require('uuid')
const Busboy = require('busboy')
const path = require('path')
const fs = require('fs')

function uploadFile(ctx) {
  let req = ctx.req
  let res = ctx.res
  let busboy = new Busboy({ headers: req.headers })

  return new Promise((resolve, reject) => {
    console.log('文件上传中...')
    let result = {
      success: false,
      formData: {},
    }

    // 解析请求文件事件
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      let fileName = uuid.v4() + path.extname(filename).toLowerCase()
      let serverFilePath = path.join(__dirname, '../static/images')
      result.formData['url'] = `/images/${fileName}`
      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(path.join(serverFilePath, fileName)))

      // 文件写入事件结束
      file.on('end', function () {
        result.success = true
        result.message = '文件上传成功'
        resolve(result)
      })
    })

    // 解析表单中其他字段信息
    busboy.on(
      'field',
      function (
        fieldname,
        val,
        fieldnameTruncated,
        valTruncated,
        encoding,
        mimetype,
      ) {
        console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val))
        result.formData[fieldname] = inspect(val)
      },
    )

    // 解析结束事件
    busboy.on('finish', function () {
      console.log('文件上结束')
      resolve(result)
    })

    // 解析错误事件
    busboy.on('error', function (err) {
      console.log('文件上出错')
      reject(result)
    })

    req.pipe(busboy)
  })
}

module.exports = {
  uploadFile,
}
