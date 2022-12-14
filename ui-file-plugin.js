const { ConcatSource } = require("webpack-sources");

class UiFileResolver {
  constructor(options) {
    this.options = options || {};
  }

  apply (compiler) {

    // webpack 模块实例，可以通过 compiler 对象访问，
    // 这样确保使用的是模块的正确版本
    // （不要直接 require/import webpack）
    const { webpack } = compiler;

    // Compilation 对象提供了对一些有用常量的访问。
    const { Compilation } = webpack;

    compiler.hooks.thisCompilation.tap("UiFileResolver", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "UiFileResolver",
          // 用某个靠后的资源处理阶段，
          // 确保所有资源已被插件添加到 compilation
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        () => {
          for (const chunk of compilation.chunks) {
            if (!chunk.canBeInitial()) {
              continue;
            }


            for (const file of chunk.files) {
              console.error('check file', file)
              let isUiFile = false
              for (const module of compilation.chunkGraph.getChunkEntryModulesIterable(chunk)) {
                if (module._source && module._source._value.match(/^"ui";$/gm)) {
                  isUiFile = true
                  break
                }
              }
              if (isUiFile) {
                console.error(file + ' 源文件是"ui";文件');
                compilation.updateAsset(file, old => {
                  return new ConcatSource('"ui";\n', old);
                });
              } else {
                console.error(file + ' 源文件不是"ui";文件');
              }
            }
          }
        })
    })
  }
}

module.exports = UiFileResolver;