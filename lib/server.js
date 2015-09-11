
var phantomDriver = require('node-phantom-simple')
var phantomPath = require('phantomjs').path

var server = module.exports = {}
var browser = null
var initError = null

server.exitBrowser = exitBrowser
server.loadPage = loadPage

initBrowser()


function loadPage(url, callback) {
  ensureBrowser(function (err) {
    if (err) return callback(err)
    browser.createPage(function (err, page) {
      page.open(url, function (err, status) {
        // page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function (err) {
          // jQuery Loaded.
          // Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
          setTimeout(function () {
            return page.evaluate(function () {
              var ret = {}
              ret.url = location.href
              ret.html = document.body.parentElement.outerHTML
              return ret
            }, function (err, ret) {
              callback(err, ret)
            })
          }, 5000)
        // })
      })
    })
  })
}

function ensureBrowser(callback) {
  if (browser) return callback(null, browser)
  if (initError) return callback(initError)
  setTimeout(ensureBrowser, 1000, callback)
}

function initBrowser() {
  phantomDriver.create({ path: phantomPath }, function (err, _browser) {
    if (err) {
      initError = err
      return
    }
    browser = _browser
  })
}

function exitBrowser() {
  browser.exit()
}
