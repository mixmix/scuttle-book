module.exports = function (client) {
  return function (id, text, cb) {
    // lookup the book and existing messages attached (just comments?)
    // calculate the correct branch (using ssb-sort ?)

    // create a correctly formed message
    // publish it
    // callback with the error / newly created message
  }
}

