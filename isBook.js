const validator = require('is-my-json-valid')
const schema = require('./schemas/book')

module.exports = validator(schema)

