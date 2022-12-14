module.exports = function (scope, libName, buildLib) {
  if (typeof scope[libName] == "undefined") {
    console.log('bind lib:', libName)
    scope[libName] = buildLib()
  }
}