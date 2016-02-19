'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fs = require('fs')

let countdown = 50000

readFile(__filename, 12, cbReadFile)

// ------------------------------------
function cbReadFile (err, buff) {
  if (err) throw err
  if (buff.toString() !== '\'use strict\'') throw new Error('oops')

  countdown--
  if (countdown <= 0) return

  readFile(__filename, 12, cbReadFile)
}

// ------------------------------------
function readFile (fileName, len, cb) {
  const buff = new Buffer(len)
  let fd
  let result

  fs.open(fileName, 'r', cbOpened)

  // ----------------------------------
  function cbOpened (err, fdResult) {
    if (err) return cb(err)

    fd = fdResult

    fs.read(fd, buff, 0, buff.length, 0, cbRead)
  }

  // ----------------------------------
  function cbRead (err, bytesRead, buffer) {
    if (err) return cb(err)

    result = buffer.slice(0, bytesRead)

    fs.close(fd, cbClosed)
  }

  // ----------------------------------
  function cbClosed (err) {
    if (err) return cb(err)

    cb(null, result)
  }
}
