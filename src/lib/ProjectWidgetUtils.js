let { config: _config, storage_name: _storage_name } = require('@/simpleConfig.js')
let {
  debugInfo, debugForDev, logInfo, infoLog, warnInfo, errorInfo
} = require('@/lib/prototype/LogUtils')
let _commonFunctions = require('@/lib/prototype/CommonFunction')

let _BaseWidgetUtils = require('@/lib/BaseWidgetUtils.js')

const ProjectWidgetUtils = function () {
  _BaseWidgetUtils.call(this)
  // 自定义的控件操作写在此处

}
ProjectWidgetUtils.prototype = Object.create(_BaseWidgetUtils.prototype)
ProjectWidgetUtils.prototype.constructor = ProjectWidgetUtils

module.exports = ProjectWidgetUtils