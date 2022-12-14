/*
 * @Author: TonyJiangWJ
 * @Date: 2020-12-30 20:16:48
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2022-12-07 21:19:26
 * @Description: 
 */
let { config } = require('@/simpleConfig.js')
let widgetUtils = require('@/lib/prototype/WidgetUtils')
let logUtils = require('@/lib/prototype/LogUtils')
let automator = require('@/lib/prototype/Automator')
module.exports = function (landscape) {
  let countDown = new java.util.concurrent.CountDownLatch(1)
  let requestSuccess = false
  let confirmWaitingThread = threads.start(function () {
    sleep(500)
    if (requestSuccess) {
      return
    }
    let confirmWidget = widgetUtils.widgetGetOne(config.capture_permission_button || 'START NOW|立即开始|允许')
    if (confirmWidget) {
      sleep(200)
      let remember = widgetUtils.widgetGetById("android:id/checkbox", 200)
      if (!remember) {
        remember = widgetUtils.widgetGetById("com.android.systemui:id/remember", 200)
      }
      if (remember) {
        logUtils.debugInfo('找到了记住按钮，点击记住')
        automator.clickCenter(remember)
        sleep(200)
      } else {
        logUtils.warnInfo('未找到记住按钮')
      }
      logUtils.debugInfo('点击允许截图权限')
      // 二次获取，理论上不会取不到
      confirmWidget = widgetUtils.widgetGetOne(config.capture_permission_button || 'START NOW|立即开始|允许', 200) || confirmWidget
      automator.clickCenter(confirmWidget)
    } else {
      logUtils.warnInfo(['未找到允许截图按钮，查找内容为：{}', config.capture_permission_button || 'START NOW|立即开始|允许'], true)
      countDown.countDown()
    }
  })
  let requestThread = threads.start(function () {
    requestSuccess = requestScreenCapture(landscape)
    countDown.countDown()
  })
  let waitResult = countDown.await(15, java.util.concurrent.TimeUnit.SECONDS)
  if (!waitResult) {
    logUtils.warnInfo('请求截屏权限超时')
  }
  logUtils.debugInfo('请求截屏权限结束：' + requestSuccess)
  confirmWaitingThread.interrupt()
  requestThread.interrupt()
  return requestSuccess
}