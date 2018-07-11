# vue-webpack4

> 时至今日(2018-7-11),vue-cli 任然为支持至webpack4,所以我自己来创建已个 vue 模板
> 不过大致的原因我也能猜到,因为很多插件仍然是一个不稳定的点,比如我在创建中也遇到了,至今未有解决的方案

## webpack 4 优点:
总结来说就是 加快了 dev 模式下的编译速度,和 prod 模式下的打包速度
还有 ` optimize.CommonsChunkPlugin` 会换成另一种写法
还有一个比较小的优点,相信很多人都没说,就是他会压缩 es6 代码,也许很多人都会问🤔 我们不是打包为es5的代码吗,为什么要用到这个特性?

这个原因我会在后面几篇博客中说明(￣▽￣)"

## 修改过程


### 1.使用最新的 webpack  

一键更新插件:
```bash
npm i -D webpack@4.15.1 vue-loader@15.2.4 mini-css-extract-plugin html-webpack-plugin@3.2.0 webpack-cli@3.0.8 webpack-dev-server@3.1.4
```

### 2.修改 webpack.prod.conf.js  

去除 `const ExtractTextPlugin = require('extract-text-webpack-plugin')`
添加 `const MiniCssExtractPlugin = require('mini-css-extract-plugin')`
添加 `const VueLoaderPlugin = require('vue-loader/lib/plugin')`
VueLoaderPlugin也要加在 webpack.dev.conf.js

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



### 3.修改build/utils.js  

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

4.添加mode
在 webpack.dev.conf.js 中 添加 `mode:'development',`
同样的在 webpack.prod.conf.js 中添加 ` mode: 'production',`
*具体可查看我之后给出的项目*

## build问题

question:   
```js
var outputName = compilation.mainTemplate.applyPluginsWaterfall('asset-path', outputOptions.filename, {
```
解决:   
```bash
npm install html-webpack-plugin@3.2.0 --save-dev
```
 
---

question:    
```bash
DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
```
解决:
```bash
npm install --save-dev mini-css-extract-plugin
```

---

question:  
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

---

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

---

```bash
(node:93005) DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
```
该语句没有太大影响,仅仅是提醒的作用

---

我刚刚在引言里说的,至今未解决的问题,就在于异步组件块的css 上
首先要清楚 现在css 也是和异步组件一样的异步加载,除非插件更新,改变这种模式
但是,很多人都会觉得这种方法并不是很好,想要将 css 文件合并成一个,缺没法合并
如果按我刚刚的配置来改,那么改出来的确实是会将css 合并但是,他会有副作用 ---> 会产生一个无用的chunk文件,并且他不能被删除,而且他会作为入口文件之一

这个问题至今是仍然未解决,具体详情可以浏览该issue:
<a href="https://github.com/webpack-contrib/mini-css-extract-plugin/issues/113" target="_block">https://github.com/webpack-contrib/mini-css-extract-plugin/issues/113</a>
放上我的项目地址,如果有需要可以查看:
<a href="https://github.com/Grewer/vue-webpack4" target="_block">https://github.com/Grewer/vue-webpack4</a>

--- 

总结一下,其实相对于有一点体量的项目来说,其实速度的加快并没有多少
比如我之前项目经常是在30S左右,升级到webpack 4后,时间大概在25-32s左右
文件的压缩有了一点效果,但是影响不是很多,比如之前 113K的文件 升级后 会压缩大概至 109K (╯▽╰)

现在插件还未稳定下来,如果喜欢折腾的话可以试试,不然还是持观望为主,等官方升级为好😑

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
