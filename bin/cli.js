#!/usr/bin/env node
var url = process.argv[2]
var encoding = process.argv[3]
var wet = require('../')

wet(url, encoding, function(err, meta){
  if (err) {
    throw err
  }

  console.log(meta)
})
