import { createClient } from 'contentful'

if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('Contentful credentials are not set')
}

console.info(
  'Using Contentful vars',
  process.env.CONTENTFUL_SPACE_ID?.length,
  process.env.CONTENTFUL_ACCESS_TOKEN?.length,
)

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  logHandler: (level, data) => {
    if (level === 'error') console.error('Contentful-SDK', data)
    else console.log('Contentful-SDK', data)
  },
})
