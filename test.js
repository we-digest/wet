var getMeta = require('./')
var assert = require('assert')
var _ = require('lodash')

var resultBaidu = { title: '百度一下，你就知道',
  description: '搜索设置|百度首页|登录注册新闻　网页　贴吧　知道　音乐　图片　视\
频　地图　文库　更多»输入法手写拼音关闭推荐 : 百度浏览器，打开网页快2秒！新闻h\
ao123地图视频贴吧登录设置更多产品新 闻　网 页　贴 吧　知 道　音 乐　图 片\
　视 频　地 图输入法手写拼音关闭百科　文库　',
  image: 'http://www.baidu.com/img/baidu_jgylogo3.gif' }

var resultWYU = { title: '五邑大学欢迎你',
  description: '五邑大学在培养高素质创新型人才、取得突破性科研进展，以及为国民经\
济发展和社会进步提供智力支持等方面都发挥着极其重要的作用。',
  image: 'http://www.wyu.cn/images/moving5.jpg' }


describe('#getMeta', function(){

  this.timeout(20000)

  it('http://www.wyu.cn (gbk)', function(done){

    getMeta('http://www.wyu.cn', 'gbk', function(err, meta){
      assert.deepEqual(meta, resultWYU)
      done()
    })

  })

  it('http://baidu.com', function(done){

    getMeta('http://baidu.com', function(err, meta){
      assert.deepEqual(meta, resultBaidu)
      done()
    })

  })

  it('//baidu.com', function(done){

    getMeta('//baidu.com', function(err, meta){
      assert.deepEqual(meta, resultBaidu)
      done()
    })

  })

  it('baidu.com', function(done){

    getMeta('baidu.com', function(err, meta){
      assert.deepEqual(meta, resultBaidu)
      done()
    })

  })

  it('+ https://baidu.com', function(done){

    getMeta('https://baidu.com', function(err, meta){
      assert.equal(meta.title, '百度一下，你就知道')
      assert.equal(meta.image, 'http://www.baidu.com/img/bdlogo.gif')
      done()
    })

  })

})
