import { sanity } from './sanity.js'

export const marketLines = {
  pet: { title: 'Pet Collection Market', collectionType: 'petcollection', route: '/pet-collection', filterLabel: 'Collection', cover: '/images/market/pet-collection-cover.webp' },
  patch: { title: 'Patch Collection Market', collectionType: 'patchcollection', route: '/patch-collection', filterLabel: 'Theme', cover: '/images/market/patch-collection-cover.webp' },
}

const productFields = `
  _id, _createdAt, productname, slug, sku, coverImage, images, shortDescription,
  material, size, "collection": selectCollection->{_id,_type,name,slug,type,theme}
`

export async function getMarketData(line) {
  const config = marketLines[line]
  const collections = await sanity.fetch(`*[_type == $type && isActive != false] | order(sortOrder asc, name asc){_id,_type,name,slug,type,theme}`, { type: config.collectionType })
  const products = await sanity.fetch(`*[_type == "product" && status == "published" && selectCollection->_type == $type] | order(_createdAt desc){${productFields}}`, { type: config.collectionType })
  return { config, collections, products }
}

export async function getProductSlugs() {
  return sanity.fetch(`*[_type == "product" && status == "published" && defined(slug.current)]{ "slug": slug.current }`)
}

export async function getProduct(slug) {
  return sanity.fetch(`*[_type == "product" && status == "published" && slug.current == $slug][0]{${productFields},seoTitle,seoDescription,ogImage,"longDescriptionText":pt::text(longDescription)}`, { slug })
}

export async function getRelatedProducts(collectionId, productId) {
  return sanity.fetch(`*[_type == "product" && status == "published" && selectCollection._ref == $collectionId && _id != $productId] | order(_createdAt desc)[0...4]{${productFields}}`, { collectionId, productId })
}
