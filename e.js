'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fss = require('./lib/fs-structured')

// read 12 bytes of this file, print them, or print error if that happens
readFile(__filename, 12, result => {
  if (result.err) return console.log(__filename, 'error:', result.err.stack)
  console.log(__filename, 'read:', result.buffer.toString())
})

// call cb on a Buffer len bytes long of first bytes of fileName
function readFile (fileName, len, cb) {
  cbgen(ΔreadFile, cb)

  // return, as a generator, a Buffer len bytes long of first bytes of fileName
  function * ΔreadFile (cbg) {
    let result

    // allocate a buffer
    const buff = new Buffer(len)

    // open the file
    result = yield fss.open(fileName, 'r', cbg)
    if (result.err) return result

    const fd = result.fd

    // read the first bytes into buffer
    result = yield fss.read(fd, buff, 0, buff.length, 0, cbg)
    if (result.err) return result
    if (process.env.BOOM === '1') return { err: new Error('BOOM 1') }

    const buff2 = result.buffer.slice(0, result.bytesRead)

    if (process.env.BOOM === '2') buff.boom()

    // close the file after reading it
    result = yield fss.close(fd, cbg)
    if (result.err) return result

    return { buffer: buff2 }
  }
}

function cbgen (gen, cbFinal) {
  const iter = gen(cb)
  cb()

  function cb (cbResult) {
    const nextResult = iter.next(cbResult)

    if (nextResult.done) cbFinal(nextResult.value)
  }
}
