var request = require('request')
var cheerio = require('cheerio')
var iconv = require('iconv-lite')
var chardet = require('jschardet')
var urllib = require('url')

module.exports = getMeta


function getMeta(url, encoding, callback){
  // also getMeta(url, callback)
  if (arguments.length === 2) {
    callback = encoding
    encoding = null
  }

  // make '//baidu.com' to 'baidu.com'
  url = url.replace(/^\/\//, '')
  // make 'baidu.com' (default) to 'http://baidu.com'
  if (!/^(https?:)?\/\//.test(url)) {
    url = 'http://' + url
  }

  ensureLoad(url, encoding, function(err, html){
    if (err) {
      return callback(err)
    }

    var meta = {}
    var $ = cheerio.load(html)

    var baseUrl = url
    var $base = $('base')
    if ($base.length >= 1) {
      baseUrl = urllib.resolve(url, $base.attr('href') || '')
    }

    // title
    var $title = $('title')
    if ($title.length >= 1) {
      meta.title = $title.text()
    }

    // description
    var $decription = $('meta[name=description]')
    if ($decription.length >= 1) {
      meta.description = $decription.attr('content') || ''
    }
    if (!meta.description) {
      // todo: more intellegent analyzing
      meta.description = $('p').text().slice(0, 140)
    }

    // image holder
    var imageSrc
    var $images = $('img')
    if ($images.length >= 1) {
      // todo: more intellegent
      // image-size, ajax-load, background-image, etc?
      // to deal with google.com
      // maybe using **search engine** to get a main image????
      imageSrc = $images.first().attr('src')
      imageSrc = urllib.resolve(baseUrl, imageSrc)
      meta.image = imageSrc
    }


    callback(null, meta)
  })
}

/*
function baiduSearch(keyword, callback){
  request({
    url: 'https://www.baidu.com/s',
    query: {
      'wd': keyword,
      'ie': 'utf-8'
    },
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
    }
  }, function(err, res, html){ // already utf8
    if (err) {
      return callback(err)
    }

    var meta = {}
    var $ = cheerio.load(html)
    var $list = $('.c-container')

    // 有则取官网 无则取第一条
    var $result = $list.filter(function(i, el){
      return $(el).find('h3 .OP_LOG_LINK').text() === '官网'
    }).first()
    if ($result.length <= 0) {
      $result = $list.first()
    }

    var $abstract = $result.find('.c-abstract')
    if ($abstract.length >= 1) {
      meta.description = $abstract.text()
    }

    var $image = $result.find('.c-img')
    if ($image.length >= 1) {
      meta.image = $image.attr('src') // already full url
    }

    callback(null, meta)
  })
}
*/

function ensureLoad(url, encoding, callback){
  // auto take refresh to ensure page load
  request({
    url: url,
    headers: {
      // make sure visit allowed
      'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
    },
    encoding: null // means buffer
  }, function(err, res, buf){
    if (err) {
      return callback(err)
    }

    if (!encoding) {
      // auto charset detect
      var det = chardet.detect(buf)
      if (det) {
        if (det.encoding === 'ascii') {
          encoding = 'utf8'
        } else {
          encoding = det.encoding
        }
      }
    }

    var html = encoding === 'utf8' ? buf.toString() : toUtf8(buf, encoding)
    var $ = cheerio.load(html)
    var $refresh = $('meta[http-equiv=refresh]')

    if ($refresh.length >= 1) {
      // todo: also take <base href="xx">?
      // need research
      var content = $refresh.attr('content') || ''
      var match = content.match(/;url=(.+)?;?/)
      if (match) {
        var nextUrl = match[1]
        return ensureLoad(nextUrl, encoding, callback)
      }
    }

    callback(null, html)
  })
}

function toUtf8(buf, encoding) {
  return iconv.decode(buf, encoding)
}
