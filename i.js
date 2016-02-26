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
  function * ΔreadFile (cbResult) {
    let $

    // allocate a buffer
    const buff = new Buffer(len)

    // open the file

    $ = {err: 0, fd: 0}
    yield fs.open(fileName, 'r', cbResult($))
    if ($.err) return $

    const fd = $.fd

    // read the first bytes into buffer
    $ = {err: 0, bytesRead: 0, buffer: 0}
    yield fs.read(fd, buff, 0, buff.length, 0, cbResult($))
    if ($.err) return $

    if (process.env.BOOM === '1') return { err: new Error('BOOM 1') }

    // set the outgoing callback parameter to the value we want
    const buffer = $.buffer.slice(0, $.bytesRead)

    if (process.env.BOOM === '2') buff.boom()

    // close the file after reading it
    $ = {err: 0}
    yield fs.close(fd, cbResult($))
    $.buffer = buffer

    return $
  }
}

function cbsync (gen, cb) {
  const iter = gen(setCallbackResult)
  iter.next()

  function setCallbackResult (vars) {
    let outerObject = null

    if (typeof vars === 'string') {
      vars = vars.trim().split(/\s+/)
    } else {
      outerObject = vars
      vars = Object.keys(vars)
    }

    return function cbParmSetter () {
      const result = outerObject || {}
      for (let i = 0; i < vars.length; i++) {
        result[vars[i]] = arguments[i]
      }
      const next = iter.next(result)
      if (next.done) cb(next.value)
    }
  }
}
