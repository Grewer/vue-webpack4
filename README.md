# vue-webpack4

> A Vue.js project


## 修改过程

1. 使用最新的 webpack

一键更新插件:
```bash
npm i -D webpack@4.15.1 vue-loader@15.2.4 mini-css-extract-plugin html-webpack-plugin@3.2.0 webpack-cli@3.0.8 webpack-dev-server@3.1.4
```

2. 修改 webpack.prod.conf.js

去除 `const ExtractTextPlugin = require('extract-text-webpack-plugin')`
和


添加 `const MiniCssExtractPlugin = require('mini-css-extract-plugin')`
添加 `const VueLoaderPlugin = require('vue-loader/lib/plugin')`
这两个也要加在 webpack.dev.conf.js

如果你嫌麻烦,可以放在 webpack.base.conf.js 中


将 插件:
```js
new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true,
})
```
改为:
```js
new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
})
```
添加插件
```js
new VueLoaderPlugin()
```



删除所有 optimize.CommonsChunkPlugin 插件
```js
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    })
```
在 plugins 外部添加
```js
 optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        },
        styles: {
          name:'styles',
          test: (m) => m.constructor.name === 'CssModule',
          chunks: 'all',
          minChunks: 1,
          enforce: true,
          euseExistingChunk: true
         }
      }
    },
    runtimeChunk: {
      name: "manifest"
    },
  }
```



3. 修改build/utils.js

将
`const ExtractTextPlugin = require('extract-text-webpack-plugin')
`
改为
`const MiniCssExtractPlugin = require('mini-css-extract-plugin')`

大约48行左右:
```js
 if (options.extract) {
    return ExtractTextPlugin.extract({
            use: loaders,
            fallback: 'vue-style-loader'
    })
  } 
```
改为:
```js
if (options.extract) {
    return [MiniCssExtractPlugin.loader].concat(loaders)
} 
```

## build问题
1.
```js
var outputName = compilation.mainTemplate.applyPluginsWaterfall('asset-path', outputOptions.filename, {
```
解决:   
```bash
npm install html-webpack-plugin@3.2.0 --save-dev
```
 

2.
```bash
DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
```
解决:
```bash
npm install --save-dev mini-css-extract-plugin
```


3. 
```bash
Module build failed (from ./node_modules/vue-loader/index.js):
TypeError: Cannot read property 'vue' of undefined
```

解决: 引用新的vue-loader  
```bash
npm i -D vue-loader@15.2.4

```
prod.js添加  
```js
const VueLoaderPlugin = require('vue-loader/lib/plugin');
plugins: [
    new VueLoaderPlugin()
  ]
```



### 其他错误
如 eslint 报错,则需要下载最新版本的eslint-loader
`npm install eslint-loader@2.0.0 -D`

还有需要注意的是 webpack.base.conf.js 中的 loader 后缀不可省略


pug报错:
解决: 使用最新的 `pug-html-loader`  
```js
{
      test: /\.pug$/,
      loader: 'pug-html-loader'
}
```


### 警告

有关 postcss
解决:  
`npm i -D postcss-loader@2.1.5`




```bash
(node:93005) DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
```
该语句没有太大影响,仅仅是提现的作用


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
