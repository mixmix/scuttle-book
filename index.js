const inject = require('./inject')

const methods = {
  async: {
    comment: require('./async/comment'),
    create: require('./async/create'),
    get: require('./async/get'),
    isBookComment: require('./async/isBookComment'),
    isBookUpdate: require('./async/isBookUpdate'),
    update: require('./async/update'),
  },
  obs: {
    authors: require('./obs/authors'),
    book: require('./obs/book'),
    shelves: require('./obs/shelves'),
  },
  pull: {
    books: require('./pull/books'),
    comments: require('./pull/comments'),
    updates: require('./pull/updates'),
  },
  sync: {
    isBook: require('./isBook'), // << exception
  }
}

// Note : if you don't like this export pattern, there's no reason we can't add different mappings !!
//  e.g. book.validate.bookComment

module.exports = function Book (client, opts) {
  return inject(client, methods)
}


// auto-inject the ssb-client instance to all methods to reduce repition
function inject (client, methods) {
  for (var key in methods) {
    if (typeof methods[key] === 'function') {
      methods[key] = methods[key](client)

      // TODO skip isBook
    }
    else {
      methods[key] = inject(client, methods[key])
    }
  }

  return methods
}


