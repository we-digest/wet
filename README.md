# wet

Grabbing metadata from webpages

For lagancy version without phantomjs see [branch 0.0.x](https://github.com/fritx/wet/tree/0.0.x)

## New Branch 0.1.x with [phantomjs](https://github.com/ariya/phantomjs) & [node-phantom-simple](https://github.com/baudehlo/node-phantom-simple)

Currently it gets slower (WIP), because:

- Page rendered in phantomjs
- Browser has to be created
- Extra 5s delay is given to load

```plain
# Use in terminal
$ npm i -g wet
$ wet https://www.baidu.com  # okay
$ wet https://baidu.com      # also
$ wet http://baidu.com       # also
$ wet //baidu.com            # also
$ wet baidu.com              # also
```

```js
// Use in node.js
var wet = require('wet')
wet('www.baidu.com', function(err, meta){
  console.log(meta)
})
```

```plain
// The output
{ url: 'http://baidu.com',
  finalUrl: 'https://www.baidu.com/',
  title: '百度一下，你就知道',
  description: '把百度设为主页把百度设为主页关于百度About  Baidu©2015 Baidu 
使用百度前必读 意见反馈 京ICP证030173号 ',
  image: 'http://www.baidu.com/img/bd_logo1.png' }
```

## Todo

- [ ] More accurate image detected
- [ ] More accurate title/description detected
- [ ] Returned html is not completely correct?
- [ ] Make phantomjs server isolated & public
- [x] Render page via phantomjs
