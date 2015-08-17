var request = require('request')
var cheerio = require('cheerio')
var urllib = require('url')

module.exports = getMeta


function getMeta(url, callback){
  // make '//baidu.com' to 'baidu.com'
  url = url.replace(/^\/\//, '')
  // make 'baidu.com' (default) to 'http://baidu.com'
  if (!/^(https?:)?\/\//.test(url)) {
    url = 'http://' + url
  }

  ensureLoad(url, function(err, html){
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
      meta.description = $('body').text().slice(0, 140)
    }

    // image holder
    var imageSrc
    var $images = $('img')
    if ($images.length >= 1) {
      // todo: more intellegent
      // image-size, ajax-load, background-image, etc?
      // to deal with google.com
      imageSrc = $images.first().attr('src')
      imageSrc = urllib.resolve(baseUrl, imageSrc)
      meta.image = imageSrc
    }


    callback(null, meta)
  })
}


function ensureLoad(url, callback){
  // auto take refresh to ensure page load
  request(url, function(err, res, html){
    if (err) {
      return callback(err)
    }

    var $ = cheerio.load(html)
    var $refresh = $('meta[http-equiv=refresh]')

    if ($refresh.length >= 1) {
      // todo: also take <base href="xx">?
      // need research
      var content = $refresh.attr('content') || ''
      var match = content.match(/;url=(.+)?;?/)
      if (match) {
        var nextUrl = match[1]
        return ensureLoad(nextUrl, callback)
      }
    }

    callback(null, html)
  })
}
