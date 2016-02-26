'use strict'

module.exports = yieldCB

// call with (generatorFn, arg1, arg2, ..., cb)
function yieldCB (gen) {
  // get arguments to generator
  const genArgs = [].slice.call(arguments, 1)

  // take the cb off the argument list
  const cb = genArgs.pop()

  // add cbProps to the argument list
  genArgs.push(cbProps)

  // call the generator
  const iter = gen.apply(null, genArgs)

  // proceed to first yield
  iter.next()

  // code in generatorFn calls this with names of callback arguments
  function cbProps (vars) {
    // split into individual "variable" names
    vars = vars.trim().split(/\s+/)

    // this function will be the fn passed as a callback
    return function cbParmSetter () {
      // create the object returned from the yield
      const object = {}

      // set the callback arguments as properties of the object
      for (let i = 0; i < vars.length; i++) {
        object[vars[i]] = arguments[i]
      }

      // return the object from yield, continue to next yield
      const next = iter.next(object)

      // if we're done, call the callback with the value returned
      if (next.done) cb(next.value)
    }
  }
}
