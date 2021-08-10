let __tokens = new Set()

function writeToken(token) {
  __tokens.add(token)
}

function hasToken(token) {
  return __tokens.has(token)
}

function removeToken(token) {
  __tokens.delete(token)
}

module.exports = { tokens: __tokens, writeToken, hasToken, removeToken }
