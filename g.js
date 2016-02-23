'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fs = require('fs')

// read 12 bytes of this file, print them, or print error if that happens
readFile(__filename, 12, function ($) {
  if ($.err) return console.log(__filename, 'error:', $.err.stack)
  console.log(__filename, 'read:', $.buffer.toString())
})

// call cb on a Buffer len bytes long of first bytes of fileName
function readFile (fileName, len, cb) {
  cbsync(ΔreadFile, cb)

  // return, as a generator, a Buffer len bytes long of first bytes of fileName
  function * ΔreadFile (cbProps) {
    const $ = {}

    // allocate a buffer
    const buff = new Buffer(len)

    // open the file
    yield fs.open(fileName, 'r', cbProps($, 'err fd'))
    if ($.err) return $

    // read the first bytes into buffer
    yield fs.read($.fd, buff, 0, buff.length, 0, cbProps($, 'err bytesRead buffer'))
    if ($.err) return $

    if (process.env.BOOM === '1') return { err: new Error('BOOM 1') }

    // set the outgoing callback parameter to the value we want
    $.buffer = $.buffer.slice(0, $.bytesRead)

    if (process.env.BOOM === '2') buff.boom()

    // close the file after reading it
    yield fs.close($.fd, cbProps($, 'err'))
    return $
  }
}

function cbsync (gen, cb) {
  const iter = gen(cbProps)
  iter.next()

  function cbProps (object, vars) {
    vars = vars.trim().split(/\s+/)

    return function cbParmSetter () {
      for (let i = 0; i < vars.length; i++) {
        object[vars[i]] = arguments[i]
      }
      const next = iter.next()
      if (next.done) cb(next.value)
    }
  }
}
