'use strict'

const fs = require('fs')

exports.open = fss_open
exports.read = fss_read
exports.close = fss_close

// like fs.open(), returns promise on fd
function fss_open (path, flags, cbo) {
  fs.open(path, flags, (err, fd) =>
    cbo({ err: err, fd: fd })
  )
}

// like fs.read(fd, buff, 0, buff.len, 0), returns promise on returnedBuff.slice(bytesRead)
function fss_read (fd, buffer, offset, length, position, cbo) {
  fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) =>
    cbo({ err: err, bytesRead: bytesRead, buffer: buffer })
  )
}

// like fs.close(fd), returns promise on null
function fss_close (fd, cbo) {
  fs.close(fd, (err) =>
    cbo({ err: err })
  )
}
