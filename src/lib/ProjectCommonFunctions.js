/**
 * 每个项目里面新增或者修改的方法集合
 */

let storageFactory = require('@/lib/prototype/StorageFactory')
let BaseCommonFunction = require('@/lib/BaseCommonFunctions.js')

/**
 * 项目新增的方法写在此处
 */
const ProjectCommonFunction = function () {
  BaseCommonFunction.call(this)

  this.keyList = []

}

ProjectCommonFunction.prototype = Object.create(BaseCommonFunction.prototype)
ProjectCommonFunction.prototype.constructor = ProjectCommonFunction

/**
 * 初始化存储
 */
ProjectCommonFunction.prototype.initStorageFactory = function () {
  // 初始化值
  // storageFactory.initFactoryByKey($key, $defaultVal)
}

module.exports = ProjectCommonFunction