const test = require('tape')
const validator = require('is-my-json-valid')

const isBook = require('../isBook.js')

test('isBoot / book schema', t => {

  const simpleBook = {
    type: 'bookclub',
    authors: 'Ursula le Guin',
    title: 'The Dispossessed'
  }
  t.ok(isBook(simpleBook), 'validates simple book')

  const incompleteBook = {
    type: 'bookclub',
    authors: 'Ursula le Guin',
  }
  t.notOk(isBook(incompleteBook), 'invalidates incompleteBook book')
  t.equal(isBook.errors[0].message, 'is required', 'provides error messages')

  const multiAuthorBook = {
    type: 'bookclub',
    authors: ['Ursula le Guin', 'Terry Pratchett'],
    title: 'The Dispossessed'
  }
  t.ok(isBook(multiAuthorBook), 'validates multi-author book')

  t.end()
})

