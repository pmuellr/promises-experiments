'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fs = require('fs')
const yieldCB = require('./lib/yieldCB')

// read 12 bytes of this file, print them, or print error if that happens
yieldCB(readFileGen, __filename, 12, function readFileGenCB ($) {
  if ($.err) return console.log(__filename, 'error:', $.err.stack)
  console.log(__filename, 'read:', $.buffer.toString())
})

// return a Buffer len bytes long of first bytes of fileName
function * readFileGen (fileName, len, cbProps) {
  // holds our callback values
  let $

  // open the file
  $ = yield fs.open(fileName, 'r', cbProps('err fd'))
  if ($.err) return $

  // need the fd for the remaining calls
  const fd = $.fd

  // allocate a buffer
  const buff = new Buffer(len)

  // read the first bytes into buffer
  $ = yield fs.read(fd, buff, 0, buff.length, 0, cbProps('err bytesRead buffer'))
  if ($.err) return $

  // get the buffer we want to return
  const result = $.buffer.slice(0, $.bytesRead)

  // close the file after reading it
  $ = yield fs.close(fd, cbProps('err'))
  if ($.err) return $

  // return the buffer
  return { buffer: result }
}
