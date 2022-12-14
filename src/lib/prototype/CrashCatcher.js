/*
 * @Author: TonyJiangWJ
 * @Date: 2020-05-27 23:08:29
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2022-12-16 20:49:42
 * @Description: AutoJS崩溃自启
 */

let { storage_name, config } = require('@/simpleConfig.js')
let lockableStorages = require('@/lib/prototype/LockableStorage')
let logUtils = require('@/lib/prototype/LogUtils')
let fileUtils = require('@/lib/prototype/FileUtils')
let timers = require('@/lib/prototype/Timers')

const RUN_STATE_STORAGE = lockableStorages.create(storage_name + '_crash_catch')

function CrashCatcher () {
  this.currentSource = engines.myEngine().getSource() + ''
  this.setOnRunning = function () {
    logUtils.debugInfo('设置脚本状态为执行中')
    RUN_STATE_STORAGE.put('running', true)
    RUN_STATE_STORAGE.put('running_source', this.currentSource)
  }
  this.setDone = function () {
    logUtils.debugInfo('设置脚本状态为执行完毕')
    RUN_STATE_STORAGE.put('running', false)
  }
  this.restartIfCrash = function () {
    if (!config.auto_restart_when_crashed) {
      return
    }
    let runningStatus = RUN_STATE_STORAGE.get('running')
    if (runningStatus === 'true' || runningStatus === true) {
      let source = RUN_STATE_STORAGE.get('running_source') || fileUtils.getRealMainScriptPath()
      logUtils.warnInfo('AutoJs可能异常崩溃且已重启，重新执行脚本:' + source)
      engines.execScriptFile(source, { path: source.substring(0, source.lastIndexOf('/')) })
    } else {
      logUtils.debugInfo('AutoJs可能异常崩溃且已重启，但脚本已正常走完流程，不重新执行')
    }
  }
  this.init = function () {
    if (!config.auto_restart_when_crashed) {
      return
    }
    let intentTask = {
      isLocal: true,
      path: fileUtils.getCurrentWorkPath() + '/handler/CrashCatcher.js',
      action: getOnStartAction()
    }
    let existTask = timers.queryIntentTasks(intentTask)
    if (!existTask || existTask.length === 0) {
      logUtils.debugInfo('创建异常终止后的重启任务')
      threads.start(function () {
        timers.addIntentTask(intentTask)
      })
    } else {
      logUtils.debugInfo(['异常终止的重启任务已存在: {}', JSON.stringify(existTask)])
    }
  }

  this.init()

  function getOnStartAction () {
    let is_modify = Object.prototype.toString.call(org.autojs.autojsm.timing.TimedTask).match(/Java(Class|Object)/)
    if (is_modify) {
      return "org.autojs.autojsm.action.startup"
    } else {
      return "org.autojs.autojs.action.startup"
    }
  }
}
module.exports = new CrashCatcher()