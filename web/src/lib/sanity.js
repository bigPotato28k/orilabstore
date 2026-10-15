import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanity = createClient({
  projectId: 'qlfygbs7',
  dataset: 'production',
  apiVersion: '2026-10-01',
  useCdn: true,
})

const builder = imageUrlBuilder(sanity)
export const urlFor = (source) => builder.image(source)