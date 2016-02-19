'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const co = require('co')
const fsp = require('./lib/fs-promised')

const readFile = co.wrap(ΔreadFile)

// read 12 bytes of this file, print them, or print error if that happens
readFile(__filename, 12)
.then(s => console.log(__filename, 'read:', s.toString()))
.catch(e => console.log(__filename, 'error:', e.stack))

// return, as a generator, a Buffer len bytes long of first bytes of fileName
function * ΔreadFile (fileName, len) {
  // allocate a buffer
  const buff = new Buffer(len)

  // open the file
  const fd = yield fsp.open(fileName, 'r')

  // read the first bytes into buffer
  const buff2 = yield (process.env.BOOM === '1')
    ? Promise.reject(new Error('BOOM 1'))
    : fsp.read(fd, buff)

  if (process.env.BOOM === '2') buff.boom()

  // close the file after reading it
  yield fsp.close(fd)

  return buff2
}
