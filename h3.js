'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fs = require('fs')

// read 12 bytes of this file, print them, or print error if that happens
readFile(__filename, 12, function (err, buffer) {
  if (err) return console.log(__filename, 'error:', err.stack)
  console.log(__filename, 'read:', buffer.toString())
})

// return a Buffer len bytes long of first bytes of fileName
function readFile (fileName, len, cb) {
  fs.open(fileName, 'r', function (err, fd) {
    if (err) return cb(err)

    // allocate a buffer
    const buff = new Buffer(len)

    // read the first bytes into buffer
    fs.read(fd, buff, 0, buff.length, 0, function (err, bytesRead, buffer) {
      if (err) return cb(err)

      // get the buffer we want to return
      const result = buffer.slice(0, bytesRead)

      fs.close(fd, function (err) {
        if (err) return cb(err)

        cb(null, result)
      })
    })
  })
}
