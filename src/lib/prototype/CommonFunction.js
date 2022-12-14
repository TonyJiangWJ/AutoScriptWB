/*
 * @Author: TonyJiangWJ
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2022-12-07 21:11:27
 * @Description: 通用工具
 */
let FileUtils = require('@/lib/prototype/FileUtils')
let CommonFunctions = require('@/lib/BaseCommonFunctions.js')
// 针对当前项目的公共方法封装，方便不同项目之间直接同步BaseCommonFunction不用再对比内容
let _ProjectCommonFunctions = files.exists(FileUtils.getCurrentWorkPath() + '/lib/ProjectCommonFunctions.js') ? require('@/lib/ProjectCommonFunctions.js') : null
let customizeFunctions = files.exists(FileUtils.getCurrentWorkPath() + '/extends/CommonFunction.js') ? eval('require')(FileUtils.getCurrentWorkPath() + '/extends/CommonFunction.js') : null
let innerFunctions = _ProjectCommonFunctions === null ? new CommonFunctions() : new _ProjectCommonFunctions()
if (customizeFunctions) {
  innerFunctions = customizeFunctions(innerFunctions)
}
module.exports = innerFunctions
