var fetchMeta = require('./')
var assert = require('assert')
var _ = require('lodash')

var resultBaidu = { url: 'http://baidu.com',
  finalUrl: 'https://www.baidu.com/',
  title: '百度一下，你就知道',
  description: '把百度设为主页把百度设为主页关于百度About  Baidu©2015 Baidu \
使用百度前必读 意见反馈 京ICP证030173号 ',
  image: 'http://www.baidu.com/img/bd_logo1.png' }

var resultWYU = { url: 'http://www.wyu.cn',
  finalUrl: 'http://www.wyu.cn/',
  title: '五邑大学欢迎你',
  description: '五邑大学在培养高素质创新型人才、取得突破性科研进展，以及为国民经\
济发展和社会进步提供智力支持等方面都发挥着极其重要的作用。',
  image: 'http://www.wyu.cn/images/moving4.jpg' }


describe('#fetchMeta', function(){

  this.timeout(20000)

  it('http://www.wyu.cn (gbk)', function(done){

    fetchMeta('http://www.wyu.cn', function(err, meta){
      assert.deepEqual(meta, resultWYU)
      done()
    })

  })

  it('http://baidu.com', function(done){

    fetchMeta('http://baidu.com', function(err, meta){
      assert.deepEqual(meta, resultBaidu)
      done()
    })

  })

  it('//baidu.com', function(done){

    fetchMeta('//baidu.com', function(err, meta){
      assert.deepEqual(meta, resultBaidu)
      done()
    })

  })

  it('baidu.com', function(done){

    fetchMeta('baidu.com', function(err, meta){
      assert.deepEqual(meta, resultBaidu)
      done()
    })

  })

  it('+ https://baidu.com', function(done){

    fetchMeta('https://baidu.com', function(err, meta){
      assert.deepEqual(meta, _.extend(resultBaidu, {
        url: resultBaidu.url.replace('http://', 'https://'),
        finalUrl: resultBaidu.finalUrl.replace('http://', 'https://'),
        image: resultBaidu.image.replace('http://', 'https://')
      }))
      done()
    })

  })

})
