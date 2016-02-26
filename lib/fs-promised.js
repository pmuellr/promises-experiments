'use strict'

const fs = require('fs')

exports.open = fsp_open
exports.read = fsp_read
exports.close = fsp_close

// like fs.open(), returns promise on fd
function fsp_open (path, flags) {
  return new Promise(fulfiller)

  function fulfiller (resolve, reject) {
    fs.open(path, flags, function cb (err, fd) {
      if (err) return reject(err)
      resolve(fd)
    })
  }
}

// like fs.read(fd, buff, 0, buff.len, 0), returns promise on returnedBuff.slice(bytesRead)
function fsp_read (fd, buffer, offset, length, position) {
  return new Promise(fulfiller)

  function fulfiller (resolve, reject) {
    fs.read(fd, buffer, offset, length, position, function cb (err, bytesRead, buffR) {
      if (err) return reject(err)
      resolve(buffR.slice(0, bytesRead))
    })
  }
}

// like fs.close(fd), returns promise on null
function fsp_close (fd) {
  return new Promise(fulfiller)

  function fulfiller (resolve, reject) {
    fs.close(fd, function cb (err) {
      if (err) return reject(err)
      resolve(null)
    })
  }
}
