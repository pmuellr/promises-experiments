'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fsp = require('./lib/fs-promised')

// read 12 bytes of this file, print them, or print error if that happens
readFile(__filename, 12)
.then(s => console.log(__filename, 'read:', s.toString()))
.catch(e => console.log(__filename, 'error:', e.stack))

// return a promise to a Buffer len bytes long of first bytes of fileName
function readFile (fileName, len) {
  // allocate a buffer
  const buff = new Buffer(len)

  // get a promise on the open file
  const Δfd = fsp.open(fileName, 'r')

  // with the open file ...
  return Δfd.then(fd => {
    // read the first bytes into buffer
    const Δread = (process.env.BOOM === '1')
      ? Promise.reject(new Error('BOOM 1'))
      : fsp.read(fd, buff, 0, len, 0)

    if (process.env.BOOM === '2') buff.boom()

    // close the file after reading it
    const Δclosed = Δread.then(_ => fsp.close(fd))

    // after closing, return read buffer
    return Δclosed.then(_ => Δread)
  })
}
