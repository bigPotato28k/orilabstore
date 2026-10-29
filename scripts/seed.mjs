// Seed script: creates test collections + products in Sanity (project qlfygbs7, dataset production)
// Uses the auth token from your local Sanity CLI login (~/.config/sanity/config.json).
// Run: node scripts/seed.mjs
import {createClient} from '@sanity/client'
import {readFileSync, createReadStream} from 'node:fs'
import {homedir} from 'node:os'
import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const token = JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken
if (!token) throw new Error('No Sanity authToken found — run `npx sanity login` first')

const client = createClient({
  projectId: 'qlfygbs7',
  dataset: 'production',
  apiVersion: '2026-10-01',
  useCdn: false,
  token,
})

const assetsDir = join(dirname(fileURLToPath(import.meta.url)), 'assets')

async function uploadImage(filename) {
  const asset = await client.assets.upload('image', createReadStream(join(assetsDir, filename)), {filename})
  console.log('  image uploaded:', filename, '→', asset._id)
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

// deterministic ids so re-running the script updates instead of duplicating
const PET_COLLECTIONS = [
  {_id: 'petcollection-book-station', name: 'Book & Station', slug: 'book-station', type: 'Book_Station', sortOrder: 1},
  {_id: 'petcollection-phone-accessories', name: 'Phone Accessories', slug: 'phone-accessories', type: 'Phone_Accessories', sortOrder: 2},
  {_id: 'petcollection-personal-accessories', name: 'Personal Accessories', slug: 'personal-accessories', type: 'Personal_Accessories', sortOrder: 3},
  {_id: 'petcollection-lifestyle', name: 'Lifestyle', slug: 'lifestyle', type: 'Lifestyle', sortOrder: 4},
]

const PATCH_COLLECTIONS = [
  {_id: 'patchcollection-animal-friends', name: 'Animal Friends', slug: 'animal-friends', theme: 'animals', sortOrder: 1},
]

const ref = (id) => ({_type: 'reference', _ref: id})
const block = (text, key) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: `${key}s`, text, marks: []}],
})

async function main() {
  console.log('Uploading images…')
  const [notebookImg, charmImg, patchImg] = await Promise.all([
    uploadImage('notebook.png'),
    uploadImage('charm.png'),
    uploadImage('patch.png'),
  ])

  console.log('Creating collections…')
  for (const c of PET_COLLECTIONS) {
    await client.createOrReplace({
      _id: c._id,
      _type: 'petcollection',
      name: c.name,
      slug: {_type: 'slug', current: c.slug},
      type: c.type,
      description: `Test collection: ${c.name}`,
      isActive: true,
      sortOrder: c.sortOrder,
    })
    console.log('  petcollection:', c.name)
  }
  for (const c of PATCH_COLLECTIONS) {
    await client.createOrReplace({
      _id: c._id,
      _type: 'patchcollection',
      name: c.name,
      slug: {_type: 'slug', current: c.slug},
      theme: c.theme,
      description: `Test collection: ${c.name}`,
      isActive: true,
      sortOrder: c.sortOrder,
    })
    console.log('  patchcollection:', c.name)
  }

  const PRODUCTS = [
    {
      _id: 'product-pet-journal-notebook',
      productname: 'Pet Journal Notebook',
      slug: 'pet-journal-notebook',
      sku: 'ORI-PET-001',
      img: notebookImg,
      alt: 'Pet Journal Notebook cover',
      collection: 'petcollection-book-station',
      shortDescription: 'A stitched pocket notebook for daily pet moments and tiny stories.',
      longDescription: 'Soft-touch cover with an embroidered pet motif.\n84 dotted pages, lays flat for easy writing.\nPerfect as a gift or retail counter add-on.',
      material: 'Recycled paper, embroidered cotton cover',
      size: 'A6 · 10.5 × 14.8 cm',
      isBestSell: true,
    },
    {
      _id: 'product-phone-charm-strap',
      productname: 'Phone Charm Strap',
      slug: 'phone-charm-strap',
      sku: 'ORI-PET-002',
      img: charmImg,
      alt: 'Phone Charm Strap',
      collection: 'petcollection-phone-accessories',
      shortDescription: 'Playful embroidered charm strap that keeps your phone close.',
      longDescription: 'Durable woven strap with embroidered character charm.\nFits most phone cases with a loop port.',
      material: 'Polyester weave, zinc alloy clasp',
      size: '22 cm strap',
      isBestSell: false,
    },
    {
      _id: 'product-cat-embroidered-patch',
      productname: 'Cat Embroidered Patch',
      slug: 'cat-embroidered-patch',
      sku: 'ORI-PATCH-001',
      img: patchImg,
      alt: 'Cat Embroidered Patch',
      collection: 'patchcollection-animal-friends',
      shortDescription: 'Iron-on cat patch, stitched in our own factory.',
      longDescription: 'High-density embroidery with heat-seal backing.\nIron on in 30 seconds, or sew for a permanent hold.',
      material: 'Cotton thread, heat-seal backing',
      size: '5 × 5 cm',
      isBestSell: true,
    },
  ]

  console.log('Creating products…')
  for (const p of PRODUCTS) {
    await client.createOrReplace({
      _id: p._id,
      _type: 'product',
      productname: p.productname,
      slug: {_type: 'slug', current: p.slug},
      sku: p.sku,
      coverImage: {...p.img, alt: p.alt},
      selectCollection: ref(p.collection),
      shortDescription: p.shortDescription,
      longDescription: [block(p.longDescription, `${p._id}-desc`)],
      material: p.material,
      size: p.size,
      isBestSell: p.isBestSell,
      status: 'published',
    })
    console.log('  product:', p.productname)
  }

  console.log('\nDone. Verifying counts…')
  const counts = await client.fetch(`{
    "pet": count(*[_type == "petcollection"]),
    "patch": count(*[_type == "patchcollection"]),
    "products": count(*[_type == "product" && status == "published"]),
    "bestSellers": count(*[_type == "product" && status == "published" && isBestSell == true])
  }`)
  console.log(counts)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
