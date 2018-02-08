const { Struct, Value, Array: MutantArray, Dict } = require('mutant')
const { isBlob } = require('ssb-ref')
const pull = require('pull-stream')
const get = require('lodash/get')
const forEach = require('lodash/forEach')
const merge = require('lodash/merge')
const mergeWith = require('lodash/mergeWith')
const isEmpty = require('lodash/isEmpty')


function Book (key) {
  return Struct({
    key,
    value: Value(),
    attributes: Dict(),
    latestAttributes: Dict(), // attributes according to each user
    errors: MutantArray(),
    sync: false
  })
}

module.exports = function (server) {
  return function (key) {
    // TODO take key or msg?

    const book = Book(key)
    server.get(key, (err, msgVal) => {
      if (err) return book.errors.push(err)
      book.value.set(msgVal)
      updateLatestAttributes(book, msgVal)

      pull(
        server.about.stream({live: true}),
        pull.drain(update => {

          const newLatest = mergeWith(book.latestAttributes(), update[key], (a, b) => {
            if (Array.isArray(a) && Array.isArray(b))
              return a[1] > b[1] ? a : b
          })
          book.latestAttributes.set(newLatest)
        })
      )

      // TODO run isBook?

      // TODO figure out where to put this
      // book.sync.set(true)
    })

    return book
  }
}

function updateLatestAttributes (book, msgVal) {
  // TODO check isBook / isBookUpdate?
  const { author: user, content, timestamp } = msgVal

  prune(content)
  normalizeImages(content)
  // timestamp the new values
  forEach(content, (val, key) => {
    content[key] = [val, timestamp]
  })

  const currentAttributes = book.latestAttributes.get(user) || {}
  const latestAttributes = merge({}, currentAttributes, content)

  book.latestAttributes.put(user, latestAttributes)
}

function prune (content) {
  // prune attributes we don't want in the final attributes
  delete content.type
  delete content.about

  Object.keys(content).forEach(k => {
    if (isEmpty(content[k])) delete content[k]
  })
}

function normalizeImages (content) {
  if (!content.image) return

  const blob = get(content, 'image.link', content.image)
  if (!isBlob(blob)) return delete content.image

  content.image = blob
}

