'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fs = require('fs')

// read 12 bytes of this file, print them, or print error if that happens
readFile(__filename, 12, function (err, buffer) {
  if (err) return console.log(__filename, 'error:', err.stack)
  console.log(__filename, 'read:', buffer.toString())
})

// call cb on a Buffer len bytes long of first bytes of fileName
function readFile (fileName, len, cb) {
  cbsync(ΔreadFile)

  // return, as a generator, a Buffer len bytes long of first bytes of fileName
  function * ΔreadFile (sync) {
    let err
    let fd
    let buffer
    let bytesRead

    // allocate a buffer
    const buff = new Buffer(len)

    // open the file
    yield fs.open(fileName, 'r', sync(function (err_, fd_) {
      err = err_
      fd = fd_
    }))

    if (err) return cb(err)

    // read the first bytes into buffer
    yield fs.read(fd, buff, 0, buff.length, 0, sync(function (err_, bytesRead_, buffer_) {
      err = err_
      bytesRead = bytesRead_
      buffer = buffer_
    }))

    if (err) return cb(err)
    if (process.env.BOOM === '1') return cb(new Error('BOOM 1'))

    const buff2 = buffer.slice(0, bytesRead)

    if (process.env.BOOM === '2') buff.boom()

    // close the file after reading it
    yield fs.close(fd, sync(function (err_) {
      err = err_
    }))

    if (err) return cb(err)

    cb(null, buff2)
  }
}

function cbsync (gen) {
  const iter = gen(sync)
  iter.next()

  function sync (fn) {
    return function syncd () {
      const args = [].slice.call(arguments)
      fn.apply(null, args)
      iter.next()
    }
  }
}
