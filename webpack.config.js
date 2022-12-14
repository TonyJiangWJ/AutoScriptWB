const path = require('path');
const UiFilePlugin = require('./ui-file-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const JavascriptObfuscator = require("webpack-obfuscator");
const obfusConfig = require('./obfusConfig.js');

module.exports = (env, argv) => {
  let isProd = argv.mode == 'production'
  return {
    entry: {
      "可视化配置": './src/可视化配置.js',
      "查看日志": './src/查看日志.js',
      'handler/CrashCatcher': './src/handler/CrashCatcher.js',
      'main': './src/main.js',
      '独立工具/布局分析悬浮窗': './src/独立工具/布局分析悬浮窗.js',
      '独立工具/挂起所有脚本': './src/独立工具/挂起所有脚本.js',
      '独立工具/灰度取色': './src/独立工具/灰度取色.js',
      'update/检测更新': './src/update/检测更新.js',
      'update/历史版本下载': './src/update/历史版本下载.js',
      '定时任务备份与恢复/备份所有的定时任务': './src/定时任务备份与恢复/备份所有的定时任务.js',
      '定时任务备份与恢复/清空所有的定时任务': './src/定时任务备份与恢复/清空所有的定时任务.js',
      '定时任务备份与恢复/重载备份的定时任务': './src/定时任务备份与恢复/重载备份的定时任务.js',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
    externals: [
      {
        result_adapter: "require('result_adapter')",
      },
      function ({ context, request }, callback) {
        if (/^__\w+__(.js)?$/.test(request)) {
          // 使用 request 路径，将一个 commonjs 模块外部化
          return callback(null, "require('" + request + "')");
        }
        // 继续下一步且不外部化引用
        callback();
      },
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      minimize: isProd,
    },
    devtool: false,
    plugins: [
      isProd ? new JavascriptObfuscator(obfusConfig) : null,
      new CopyPlugin({
        patterns: [
          {
            from: '**/*',
            context: path.resolve(__dirname, "src", "dex"),
            to: 'dex/'
          },
          {
            from: '**/*',
            context: path.resolve(__dirname, 'src', 'vue_configs'),
            to: 'vue_configs/'
          },
          'src/project.json',
          'src/version.json',
          {
            from: 'src/lib/webview_bridge.js',
            to: 'lib/'
          },
          {
            from: 'src/simpleConfig.js',
            to: 'config.js'
          }
        ],
      }),
      new UiFilePlugin(),
    ].filter(v=>!!v),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
            {
              // 自定义loader，webpack-autojs-loader 有缺陷，进行了部分修复
              loader: "./loader/autojs-loader",
            },
          ],
        },
      ],
    },
  }
}