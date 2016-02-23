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

In addition, if you set the environment variable `BOOM` to simulate errors.
Setting to '1' will cause the `fs.read()` call to simulate an error result
instead of a valid result.  Setting to '2' will call a function that doesn't
exist, and so simulate a "runtime" error (eg, typo) in your "business logic".

You can run all the experiments via:

    npm test
    BOOM=1 npm test
    BOOM=2 npm test`


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


[experiment d](d.js)
--------------------------------------------------------------------------------

Well wait.  If we can use `co` with promises and generators, and we dummied up
promises for `fs` with it's existing callbacks, why can't we get generators and
callbacks to work nicely.  We can!  Kinda icky, in the current incantation, as
I return the callback arguments as an array for the yield statements.  Ideally
you'd like callbacks be passed a single argument - an object - which you could
unpack with destructuring.  Some day!


[experiment e](e.js)
--------------------------------------------------------------------------------

This experiment is the same as d, but we use an `fs` module which **does**
return a "structured" value in it's callbacks, instead of a list of arguments.


[experiment f](f.js)
--------------------------------------------------------------------------------

This experiment is turns async callbacks in node into sync ones.  As usual,
the meat of the function is wrapped in a generator.  Instead of just providing
a function as a callback to your node function, provide the result of calling
`sync()` (provided to the generator) instead.  This function will then be
called synchronously when the node function callback is run.  Your callback
will basically consist of setting local vars declared in a higher scope
equal to the callback arguments.
