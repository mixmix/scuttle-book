module.exports = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'title', 'authors'],
  properties: {
    type: {type: 'string', pattern: 'bookclub'},
    title: {type: 'string'},
    authors: {
      oneOf: [
        {type: 'string'},
        {type: 'array', items: {allOf: [{type: 'string'}]
        }}
      ]
    }
    // TODO add other fields
  }
}

