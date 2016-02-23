'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fss = require('../lib/fs-structured')

let countdown = 50000

readFile(__filename, 12, cbReadFile)

// ------------------------------------
function cbReadFile (result) {
  if (result.err) throw result.err
  if (result.buffer.toString() !== '\'use strict\'') throw new Error('oops')

  countdown--
  if (countdown <= 0) return

  readFile(__filename, 12, cbReadFile)
}

// ------------------------------------
function readFile (fileName, len, cb) {
  cbgen(ΔreadFile, cb)

  // ----------------------------------
  function * ΔreadFile (cbg) {
    let result

    const buff = new Buffer(len)

    result = yield fss.open(fileName, 'r', cbg)
    if (result.err) return result

    const fd = result.fd

    result = yield fss.read(fd, buff, 0, buff.length, 0, cbg)
    if (result.err) return result

    const buff2 = result.buffer.slice(0, result.bytesRead)

    result = yield fss.close(fd, cbg)
    if (result.err) return result

    return { buffer: buff2 }
  }
}

// ------------------------------------
function cbgen (gen, cbFinal) {
  const iter = gen(cb)
  cb()

  function cb (cbResult) {
    const nextResult = iter.next(cbResult)

    if (nextResult.done) cbFinal(nextResult.value)
  }
}
