const test = require('tape')
const Client = require('ssb-client')
const { watch } = require('mutant')
const { isBlob } = require('ssb-ref')
const Get = require('../../obs/get')

test('obs.get', t => {
  Client((err, server) => {
    if (err) throw err

    const get = Get(server)

    const key = '%0ANsrEUsgCEzA+mVHgFH+oX2aHa3vHdSSIqW27moJNk=.sha256'
    const postedBy = '@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519'
    // The Dispossessed, posted by mix : @ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519

    const book = get(key)

    // book(state => console.log('***UPDATE***', '\n', state, '\n', '\n'))

    watch(book.sync, (done) => {
      if (!done) return

      const myAttributes = book.latestAttributes.get(postedBy)
      t.equal(myAttributes.authors, 'Ursula Le Guin', "collects mix's opinion about author")
      t.equal(myAttributes.title, 'The Disposessed', "collects mix's opinion about title")
      t.ok(isBlob(myAttributes.image), "collects mix's opinion about image")

      server.close()
      t.end()
    })
  })

})


