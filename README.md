# wet

Grabbing metadata from webpages

```plain
# Use in terminal
$ npm i -g wet
$ wet https://www.baidu.com  # okay
$ wet https://baidu.com      # bug, needs improvement
$ wet http://baidu.com       # also
$ wet //baidu.com            # also
$ wet baidu.com              # also
$ wet www.wyu.cn gbk         # encodings specified
$ wet www.163.com gbk        # also
$ wet www.163.com            # also, would auto-detect
```

```js
// Use in node.js
var wet = require('wet')
wet('www.baidu.com', function(err, meta){
  console.log(meta)
})
wet('www.wyu.cn', 'gbk', function(err, meta){
  console.log(meta)
})
```

```js
// The output
{ title: '百度一下，你就知道',
  description: '搜索设置|百度首页|登录注册新闻　网页　贴吧　知道　音乐　图片　视
频　地图　文库　更多»输入法手写拼音关闭推荐 : 百度浏览器，打开网页快2秒！新闻h
ao123地图视频贴吧登录设置更多产品新 闻　网 页　贴 吧　知 道　音 乐　图 片
　视 频　地 图输入法手写拼音关闭百科　文库　',
  image: 'http://www.baidu.com/img/baidu_jgylogo3.gif' }
```
