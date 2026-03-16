export const categoriesSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['success', 'data', 'meta'],
  properties: {
    success: {
      type: 'boolean',
    },
    data: {
      type: 'array',
      items: {
        type: 'object',
        required: ['category', 'count', 'displayName'],
        properties: {
          category: {
            type: 'string',
          },
          count: {
            type: 'integer',
            minimum: 0,
          },
          displayName: {
            type: 'string',
          },
        },
      },
    },
    meta: {
      type: 'object',
      required: ['requestId', 'timestamp', 'version'],
      properties: {
        requestId: {
          type: 'string',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
        version: {
          type: 'string',
        },
      },
    },
  },
}
