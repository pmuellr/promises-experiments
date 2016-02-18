promises-experiments
================================================================================

Imagine Node.js's `fs` module was wrapped with promises.  How would you use it
to read some number of bytes from the beginning of a file?

I have a number of implementations of this logic, as stand-alone programs
in this project.

One of the goals here is to see if we can take advantage of promises, without
their downside of "swallowing" runtime errors that would otherwise typically
"kill" your program if you were using callbacks.  That "killing" behavior is
typically desired, for Node.js programs, compared to "swallowing". Basically,
minimize the amount of "business logic" run as part of a promise's `then()` or
`catch()` callbacks.

Also to see if code that uses promises might be easier to both read and write,
compared to the typical *functional* style of promise programming.


fs-promised
--------------------------------------------------------------------------------

The experiments all use the same version of a "promised" `fs` module,
`fs-promised`, with the following API:

* **`fsp.open(path, flags)`**

  Calls [`fs.open(path, flags)`][fs.open], returns promise on `fd`

* **`fsp.read(fd, buff)`**

  Calls [`fs.read(fd, buff, 0, buff.len, 0)`][fs.read], returns promise on
  `returnedBuffer.slice(0, bytesRead)`

* **`fsp.close(fd)`**

  Calls [`fs.close(fd)`][fs.close], returns promise on null

[fs.open]: https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_open_path_flags_mode_callback
[fs.read]: https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback
[fs.close]: https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_close_fd_callback


experiments
================================================================================

In the source, I've named new *special* things, like variables that hold
promises, and generator functions, with an `Δ` prefix, like `Δfd` and
`ΔreadFile()`.

Additional packages used:

* [`co`](https://www.npmjs.com/package/co) - uses promises with generators
  to maybe make things a little easier to grok

All of the examples implement a function in the style `readFile(fileName, len)`,
which should return the first `len` bytes of the specified file, as a Buffer.
This function is then called to read the first 12 bytes of the program itself,
which should be the string `'use strict'`.

In addition, if you set the environment variable `BOOM` to anything, a runtime
error will be caused, by calling a function which doesn't exist, after the
file contents have been read.  Presumably, in midst of the "business logic".

You can run all the experiments via `npm test` and `BOOM=1 npm test`.


[experiment a](a.js)
--------------------------------------------------------------------------------

Promises all the way through.  The gold standard.


[experiment b](b.js)
--------------------------------------------------------------------------------

Use `co` to wrap a function to do the business logic with `yield`'d promises,
but still returns a promise at the end.


[experiment c](c.js)
--------------------------------------------------------------------------------

Use `co` to wrap a function to do the business logic with `yield`'d promises,
but function uses a callback at the end instead of a promise.
