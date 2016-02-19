'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fs = require('fs')

let countdown = 50000

readFile(__filename, 12, cbReadFile)

// ------------------------------------
function cbReadFile (result) {
  const err = result[0]
  const buff = result[1]

  if (err) throw err
  if (buff.toString() !== '\'use strict\'') throw new Error('oops')

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

    result = yield fs.open(fileName, 'r', cbg)
    if (result[0]) return result

    const fd = result[1]

    result = yield fs.read(fd, buff, 0, buff.length, 0, cbg)
    if (result[0]) return result

    const buff2 = result[2].slice(0, result[1])

    result = yield fs.close(fd, cbg)
    if (result[0]) return result

    return [null, buff2]
  }
}

// ------------------------------------
function cbgen (gen, cbFinal) {
  const iter = gen(cb)
  cb()

  function cb () {
    const nextResult = iter.next(arguments)

    if (nextResult.done) cbFinal(nextResult.value)
  }
}
