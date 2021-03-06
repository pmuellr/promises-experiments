'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fs = require('fs')

let countdown = 50000

readFile(__filename, 12, cbReadFile)

// ------------------------------------
function cbReadFile ($) {
  if ($.err) throw $.err
  if ($.buffer.toString() !== '\'use strict\'') throw new Error('oops')

  countdown--
  if (countdown <= 0) return

  readFile(__filename, 12, cbReadFile)
}

// ------------------------------------

// call cb on a Buffer len bytes long of first bytes of fileName
function readFile (fileName, len, cb) {
  yieldCallback(ΔreadFile, cb)

  // return, as a generator, a Buffer len bytes long of first bytes of fileName
  function * ΔreadFile (cbProps) {
    let $

    // allocate a buffer
    const buff = new Buffer(len)

    // open the file
    $ = yield fs.open(fileName, 'r', cbProps('err fd'))
    if ($.err) return $

    const fd = $.fd

    // read the first bytes into buffer
    $ = yield fs.read(fd, buff, 0, buff.length, 0, cbProps('err bytesRead buffer'))
    if ($.err) return $

    if (process.env.BOOM === '1') return { err: new Error('BOOM 1') }

    // set the outgoing callback parameter to the value we want
    const buffer = $.buffer.slice(0, $.bytesRead)

    if (process.env.BOOM === '2') buff.boom()

    // close the file after reading it
    $ = yield fs.close(fd, cbProps('err'))
    $.buffer = buffer

    return $
  }
}

function yieldCallback (gen, cb) {
  const iter = gen(cbProps)
  iter.next()

  function cbProps (vars) {
    vars = vars.trim().split(/\s+/)
    const varsLen = vars.length

    return function cbParmSetter (a, b, c, d, e) {
      const object = {}

      if (varsLen >= 1) { object[vars[0]] = a }
      if (varsLen >= 2) { object[vars[1]] = b }
      if (varsLen >= 3) { object[vars[2]] = c }
      if (varsLen >= 4) { object[vars[3]] = d }
      if (varsLen >= 5) { object[vars[4]] = e }

      const next = iter.next(object)
      if (next.done) cb(next.value)
    }
  }
}
