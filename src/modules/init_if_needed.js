/*
 * @Author: TonyJiangWJ
 * @Date: 2020-09-18 13:40:43
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2022-12-07 21:52:47
 * @Description: 免费版专用
 */
module.exports = function (runtime, scope) {

  if (context.getPackageName() !== 'org.autojs.autojspro') {
    require('@/modules/__$zip__.js')(runtime, scope)
    require('@/modules/__$base64__.js')(runtime, scope)
    require('@/modules/__$crypto__.js')(runtime, scope)
    require('@/modules/__$power_manager__.js')(runtime, scope)
    require('@/modules/__mDialogs__.js')(runtime, scope)
  }

}
