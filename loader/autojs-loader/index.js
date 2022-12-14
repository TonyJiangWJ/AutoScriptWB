/*
 * @Author: 家
 * @QQ: 203118908
 * @QQ交流群: 1019208967
 * @bilibili: 晓宇小凡
 * @versioin: 1.0
 * @Date: 2020-05-03 14:40:27
 * @LastEditTime: 2020-09-20 22:35:50
 * @LastEditors: 家
 * @Description: 用于webpack的loader 预处理autojs格式的文件
 * @modify 支持已经`处理的floaty.layout等语法
 * @学习格言: 即用即学, 即学即用
 */

// const process = require('process')
const show_log = false
const Logger = function () {
  this.log = function() {
    if (show_log) {
      console.log('arguments length', arguments.length)
      console.log(null, arguments)
    }
  }
}
const logger = new Logger()
var 替换双花括号 = function() {
  logger.log(arguments);
  var str = arguments[0];
  logger.log("str=");
  logger.log(str);
  while (1) {
    if (/\{\{(?!this).*?\}\}/.test(str)) {
      logger.log("有 双  花括号");
      str = str.replace(/\{\{(?!this)(.*?)\}\}/, "$${$1}");
    } else {
      logger.log("没 双  花括号");
      break;
    }
  }
  return str;
};
var 替换双花括号_xml添加反引号 = function() {
  logger.log(arguments);
  var str = arguments[0];
  logger.log("str=");
  logger.log(str);
  while (1) {
    if (/<.*\/>(?!`)/.test(str)) {
      logger.log("有 双  花括号");
      str = str.replace(/(<.*\/>)/, "`$1`");
    } else {
      logger.log("没 双  花括号");
      break;
    }
  }
  logger.log(str)
  // TODO: 替换自定义控件
  // process.exit()
  return str;
};
var 去掉单引号 = function() {
  logger.log(arguments);
  var str = arguments[0];
  logger.log("str=");
  logger.log(str);
  while (1) {
    if (/'/.test(str)) {
      str = str.replace(/'/g, "");
    } else {
      break;
    }
  }
  while (1) {
    if (/['"]\s*<.*?>\s*['"]/.test(str)) {
      str = str.replace(/['"]\s*(<.*?>)\s*['"]/g, "$1");
    } else {
      break;
    }
  }
  return str;
};



var xml添加反引号 = function(content) {
  // return content.replace(/ui.layout\((.*?)\)/g, "ui.layout(`$1`)")
  logger.log("xml添加反引号  开始");

  var result = content;
  logger.log("添加美元符号之前, content=");
  logger.log(content);
  result = content;
  result = result.replace(/ui\.layout\([^()`]*?\)/gm, 替换双花括号);
  result = result.replace(/floaty\.rawWindow\([^()`]*?\)/gm, 替换双花括号);
  result = result.replace(/floaty\.window\([^()`]*?\)/gm, 替换双花括号);
  result = result.replace(/ui\.inflate\(([^()`]+?),([^()`]+?)\)/gm, 替换双花括号);
  result = result.replace(/ui\.inflate\(([^(,)`]+?)\)/gm, 替换双花括号);
  result = result.replace(/\.prototype\.render ?= ?function ?\(\) ?{([\s\S]*?)}/gm, 替换双花括号_xml添加反引号);
  logger.log("添加美元符号之后, result=");
  logger.log(result);

  result = result.replace(/ui\.layout\(([^()`]+?)\)/gm, "ui.layout(`$1`)");
  result = result.replace(/floaty\.rawWindow\(([^()`]+?)\)/gm, "floaty.rawWindow(`$1`)");
  result = result.replace(/floaty\.window\(([^()`]+?)\)/gm, "floaty.window(`$1`)");
  result = result.replace(/ui\.inflate\(([^()`]+?),([^()`]+?)\)/gm, "ui.inflate(`$1`,$2)");
  result = result.replace(/ui\.inflate\(([^(,)`]+?)\)/gm, "ui.inflate(`$1`)");

  logger.log("添加反引号之后, result=");
  logger.log(result);
  logger.log("xml添加反引号  结束");


  logger.log('将原本就是字符串的布局还原  开始')
  logger.log('result =')
  logger.log(result)

  var reg=/(ui\.inflate\(`\s*['"][^()`]*?)'\s*\+\s*([a-zA-Z_]+)\s*\+\s*'([^()`]*?['"]\s*`,[^()`]+?\))/
  while (1) {
    if (reg.test(result)) {
      result = result.replace(/(ui\.inflate\(`\s*['"][^()`]*?)'\s*\+\s*([a-zA-Z_]+)\s*\+\s*'([^()`]*?['"]\s*`,[^()`]+?\))/gm, "$1$${$2}$3");
    } else {

      result = result.replace(/ui\.inflate\(`\s*['"][^()`]*?`,[^()`]+?\)/gm, 去掉单引号);

      break;
    }
  }

  logger.log('将原本就是字符串的布局还原  结束')
  logger.log('result =')
  logger.log(result)




  return result;
};

var someAsyncOperation = function(content, callback) {
  var err = "";
  try {
    content = xml添加反引号(content);
  } catch (e) {
    err = e;
  }
  callback(err, content);
};

module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result) {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
  // logger.log = _o_log
};
