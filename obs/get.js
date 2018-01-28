const { Struct, Value, Array: MutantArray, Dict } = require('mutant')
const { isBlob } = require('ssb-ref')

function Book (key) {
  return Struct({
    key,
    value: Value(),
    latestAttributes: Dict(), // attributes according to each user
    errors: MutantArray (),
    sync: false
  })
}

module.exports = function (server) {
  return function (key) {

    // TODO take key or msg?

    const book = Book(key)
    server.get(key, (err, msgVal) => {
      if (err) return book.errors.push(err)

      // TODO run isBook?
      book.value.set(msgVal)
      updateLatestAttributes(book, msgVal)

      // TODO figure out where to put this
      book.sync.set(true)
    })

    return book
  }
}

function updateLatestAttributes (book, msgVal) {
  // TODO check isBook / isBookUpdate?
  const { author: user, content } = msgVal

  prune(content)
  normalizeImages(content)

  const currentAttributes = book.latestAttributes.get(user) || {}
  const latestAttributes = Object.assign({}, currentAttributes, content)

  book.latestAttributes.put(user, latestAttributes)
}

function prune (content) {
  // prune attributes we don't want in the final attributes
  delete content.type
  delete content.about
}

function normalizeImages (content) {
  if (!content.image) return

  var blob
  if (typeof content.image === 'string') blob = content.image
  if (content.image && content.image.link) blob = content.image.link

  if (!isBlob(blob)) return delete content.image

  content.image = blob
}
