import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const sanity = createClient({
  projectId: 'qlfygbs7',
  dataset: 'production',
  apiVersion: '2026-10-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(sanity)
export const urlFor = (source) => builder.image(source)
