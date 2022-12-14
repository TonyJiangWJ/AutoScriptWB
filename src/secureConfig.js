/*
 * @Author: TonyJiangWJ
 * @Date: 2019-12-09 20:42:08
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2022-12-16 20:36:16
 * @Description: 
 */
let config_instance = require('@/simpleConfig.js')
let { config, default_config } = config_instance
let securityFields = ['password', 'alipay_lock_password']
let AesUtil = require('@/lib/AesUtil.js')
let aesKey = device.getAndroidId()
Object.keys(default_config).forEach(key => {
  let configValue = config[key]
  if (typeof configValue !== 'undefined') {
    if (securityFields.indexOf(key) > -1) {
      configValue = AesUtil.decrypt(configValue, aesKey) || configValue
    }
    config[key] = configValue
  }
})
config_instance.securityFields = securityFields

module.exports = config_instance