const fs = require('fs')
const path = require('path')
const { check } = require('./check')

function read(url) {
  try {
    const _path = path.join(__dirname, url)
    check(fs.existsSync(_path))
    const data = JSON.parse(fs.readFileSync(_path, 'utf-8'))
    return data
  } catch (err) {
    console.trace(err)
    return null
  }
}

function write(data, url) {
  try {
    const _path = path.join(__dirname, url)
    check(fs.existsSync(_path))
    fs.writeFileSync(_path, JSON.stringify(data, null, 2))
  } catch (err) {
    console.trace(err)
  }
}

module.exports = {
  read,
  write,
}
