const validator = require('is-my-json-valid')
const schema = require('../schemas/bookComment')

module.exports = validator(schema)

