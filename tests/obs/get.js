const test = require('tape')
const Server = require('scuttle-testbot')
const ssbKeys = require('ssb-keys')
const { watch } = require('mutant')
const { isBlob } = require('ssb-ref')
const pull = require('pull-stream')

const keyMe = ssbKeys.generate()
const keyOther = ssbKeys.generate()

Server.use(require('ssb-about'))


const Get = require('../../obs/get')

test('obs.get - I publish a book and edit it', t => {
  const server = Server({name: 'test.obs.get', keys: keyMe})
  const get = Get(server)

  const feedMe = server.createFeed(keyMe)
  const feedOther = server.createFeed(keyOther)

  const book = {type: 'bookclub', title: 'The Disposessed', author: 'Ursula Le Guin'}

  const bookEdits = [ 
    { edit: {type: 'about', title: 'The Dispossessed' }, publish: feedMe.add }, // fix double letter spelling error
    { edit: {type: 'about', title: 'The Dispossessed: an ambiguous utopia' }, publish: feedOther.add } // another opinion about title
  ]


  feedMe.add(book, (err, bookMsg) => {
    var bookKey = bookMsg.key

    var step = 0

    watch(get(bookKey), bookState => {
      console.log(`step ${step}`, bookState)

      switch (step) {
        case 0:
          // t.deepEqual(bookState.latestAttributes.title[keyMe.id][0], 'The Disposessed', 'publish: get latestAttribute')
          break
        case 1:
          t.deepEqual(bookState.latestAttributes.title[keyMe.id][0], 'The Dispossessed', '1 edit: get latestAttribute')
          t.deepEqual(bookState.attributes, { title: 'The Disposessed', author: 'Ursula Le Guin' }, '1 edit: get attributes')
          break
        case 2:
          console.log('dog')
          server.close()
          t.end()
      }
      console.log('step increment')
      step++
    })

    pull(
      pull.values(bookEdits),
      pull.asyncMap((action, cb) => {
        const edit = Object.assign(action.edit, { about: bookKey })
        action.publish(edit, cb)
      }),
      pull.drain(val => {
      })
    )
  })
})


