const { read, write } = require('../lib/read&write')

const __Rich = []
const RICHURL = '../data/richer.json'
function setRich(rich) {
  __Rich.push(rich)
  write(__Rich, RICHURL)
}

function editRich(rich) {
  __Rich.splice(
    __Rich.findIndex((item) => item.id == rich.id),
    1,
    rich,
  )
  write(__Rich, RICHURL)
}

function deleteRich(id) {
  let rich = __Rich.find((item) => item.id === id)
  __Rich.splice(
    __Rich.findIndex((item) => item.id == rich.id),
    1,
    { ...rich, status: -1 },
  )
  write(__Rich, RICHURL)
}

function getAllRicher() {
  let data = read(RICHURL)
  __Rich.push(...data)
}

function getRich(id) {
  return __Rich.find((item) => item.id === id)
}

module.exports = {
  richers: __Rich,
  getAllRicher,
  setRich,
  editRich,
  deleteRich,
  getRich,
}
