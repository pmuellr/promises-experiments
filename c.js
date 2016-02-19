'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const co = require('co')
const fsp = require('./lib/fs-promised')

// read 12 bytes of this file, print them, or print error if that happens
readFile(__filename, 12, (err, buff) => {
  if (err) return console.log(__filename, 'error:', err.stack)
  console.log(__filename, 'read:', buff.toString())
})

// call cb on a Buffer len bytes long of first bytes of fileName
function readFile (fileName, len, cb) {
  promise2cb(co(ΔreadFile), cb)

  // return, as a generator, a Buffer len bytes long of first bytes of fileName
  function * ΔreadFile () {
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
}

function promise2cb (p, cb) {
  // easier: p.then(r => cb(null, r), e => cb(e))
  // except: calls callback in then()/catch(), so ... swallows runtime errors
  p.then(
    r => process.nextTick(_ => cb(null, r)),
    e => process.nextTick(_ => cb(e))
  )
}
