let { config } = require('@/simpleConfig.js')
let logUtils = require('@/lib/prototype/LogUtils')
let paddleOcrUtil = require('@/lib/prototype/PaddleOcrUtil')
let mlkitOcrUtil = require('@/lib/prototype/MlkitOcrUtil')
let localOcr = null
logUtils.debugInfo(['当前本地OCR优先级为：{}', config.local_ocr_priority])
if (config.local_ocr_priority == 'mlkit' || config.local_ocr_priority == 'auto') {
  localOcr = mlkitOcrUtil.enabled ? mlkitOcrUtil : paddleOcrUtil.enabled ? paddleOcrUtil : null
} else if (config.local_ocr_priority == 'paddle') {
  if (!paddleOcrUtil.initialized) {
    paddleOcrUtil.init()
  }
  localOcr = paddleOcrUtil.enabled ? paddleOcrUtil : mlkitOcrUtil.enabled ? mlkitOcrUtil : null
}
if (localOcr == null) {
  localOcr = {
    enabled: false,
    type: '不受支持',
    recognize: () => '',
    recognizeWithBounds: () => []
  }
}

logUtils.debugInfo(['当前启用的OCR为：{} 是否支持：{}', localOcr.type, localOcr.enabled])

module.exports = localOcr