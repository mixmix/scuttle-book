const isBook = require('../sync/isBook')()
// isBook is an odd case that doesn't need a server

module.exports = function (server) {
  return function (book, cb) {
    if (!isBook(book)) return cb(isBook.errors)

    server.publish(book, cb)
  }
}

