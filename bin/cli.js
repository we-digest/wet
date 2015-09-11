#!/usr/bin/env node
var url = process.argv[2]
var wet = require('../')

wet(url, function(err, meta){
  if (err) {
    throw err
  }

  console.log(meta)
})
