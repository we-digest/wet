var server = require('./server')
var cheerio = require('cheerio')
var urllib = require('url')

module.exports = fetchMeta


function fetchMeta(url, callback){
  
  // make '//baidu.com' to 'baidu.com'
  url = url.replace(/^\/\//, '')
  // make 'baidu.com' (default) to 'http://baidu.com'
  if (!/^(https?:)?\/\//.test(url)) {
    url = 'http://' + url
  }

  server.loadPage(url, function (err, ret) {

    if (err) {
      return callback(err)
    }

    var meta = {}
    meta.url = url
    meta.finalUrl = ret.url
    var $ = cheerio.load(ret.html)

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
