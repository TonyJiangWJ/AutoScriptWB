/*
 * @Author: TonyJiangWJ
 * @Date: 2019-11-05 09:12:00
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2022-12-07 21:22:08
 * @Description: 
 */
// 针对当前项目的公共方法封装，方便不同项目之间直接同步BaseCommonFunction不用再对比内容
let _ProjectWidgetUtils = require('@/lib/ProjectWidgetUtils.js')

module.exports = new _ProjectWidgetUtils()