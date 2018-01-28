const isBook = require('../sync/isBook')()
// isBook is an odd case that doesn't need a client

module.exports = function (client) {
  return function (book, cb) {
    if (!isBook(book)) return cb(isBook.errors)

    client.publish(book, cb)
  }
}

