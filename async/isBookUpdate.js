const validator = require('is-my-json-valid')
const schema = require('../schemas/bookUpdate')

module.exports = validator(schema)

