'use strict'
/*eslint-disable arrow-parens */  // thanks, standard! :-)

const fs = require('fs')

// read 12 bytes of this file, print them, or print error if that happens
readFile(__filename, 12, result => {
  const err = result[0]
  const buff = result[1]

  if (err) return console.log(__filename, 'error:', err.stack)
  console.log(__filename, 'read:', buff.toString())
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
    result = yield fs.open(fileName, 'r', cbg)
    if (result[0]) return result

    const fd = result[1]

    // read the first bytes into buffer
    result = yield fs.read(fd, buff, 0, buff.length, 0, cbg)
    if (result[0]) return result
    if (process.env.BOOM === '1') return [new Error('BOOM 1')]

    const buff2 = result[2].slice(0, result[1])

    if (process.env.BOOM === '2') buff.boom()

    // close the file after reading it
    result = yield fs.close(fd, cbg)
    if (result[0]) return result

    return [null, buff2]
  }
}

function cbgen (gen, cbFinal) {
  const iter = gen(cb)
  cb()

  function cb () {
    const args = [].slice.call(arguments)
    const nextResult = iter.next(args)

    if (nextResult.done) cbFinal(nextResult.value)
  }
}
