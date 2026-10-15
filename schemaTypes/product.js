import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    groups: [
        {name: 'productdetail', title: '產品內容', default: true},
        {name: 'seo', title: 'SEO 設定'},
        ],
    fields: [
        defineField({
            name: 'productname', 
            type: 'string', 
            title: '產品名稱',
            group: 'productdetail', 
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'slug', 
            title: '網址路徑 (Slug)', 
            type: 'slug', 
            group: 'productdetail',
            options: {source: 'productname'},
            validation: (r) => r.required().error('必須生成網址路徑'),
        }),
        defineField({
            name: 'sku', 
            title: '產品 SKU Number', 
            type: 'string', 
            group: 'productdetail'}),
        defineField({
            name: 'coverImage', 
            title: 'Main Image', 
            type: 'image', 
            group: 'productdetail',
            options: {hotspot: true},
            fields: [{
                name: 'alt', 
                type: 'string', 
                title: '替代文字 (Alt Text)',
                validation: (r) => r.required(),
            }],
        }),
        defineField({
            name: 'images', 
            title: '其他照片', 
            group: 'productdetail', 
            type: 'array',
            of: [{
                type: 'image',
                options: {hotspot: true},
                fields: [{
                name: 'alt', type: 'string', title: '替代文字 (Alt Text)',
                validation: (r) => r.required(),
            }],
            }],
        }),
        defineField({
            name: 'selectCollection', 
            title: '產品系列選取', 
            group: 'productdetail',
            type: 'reference', 
            to: [
                {type: 'petcollection'}, 
                {type: 'patchcollection'}
            ],
        }),
        defineField({
            name: 'shortDescription', 
            title: '簡短描述', 
            group: 'productdetail', 
            type: 'text', 
            rows: 4}),
        defineField({
            name: 'longDescription', 
            title: '長描述', 
            group: 'productdetail',
            type: 'array', 
            of: [{type: 'block'}],
        }),
        defineField({
            name: 'material', 
            title: '物料描述', 
            type: 'string', 
            group: 'productdetail'}),
        defineField({
            name: 'size', 
            title: '尺寸', 
            type: 'string', 
            group: 'productdetail'}),
        defineField({
            name: 'isBestSell', 
            title: '熱銷中?', 
            type: 'boolean', 
            group: 'productdetail', 
            initialValue: false}),
        defineField({
            name: 'status', 
            type: 'string', 
            group: 'productdetail', 
            initialValue: 'draft',
            options: {list: ['draft', 'published', 'archived']},
        }),
        defineField({
            name: 'seoTitle', 
            title: 'SEO 搜尋標題', 
            type: 'string', 
            group: 'seo',
            description: '若不填寫,Google 搜尋將預設抓取「產品名稱」。',
        }),
        defineField({
            name: 'seoDescription', 
            title: 'SEO 網頁描述', 
            type: 'text', 
            group: 'seo', 
            rows: 3,
            validation: (r) => r.max(160).warning('SEO 描述建議在 160 字內'),
            }),
        ],
    preview: {
        select: {title: 'productname', subtitle: 'sku', status: 'status', media: 'coverImage'},
        prepare({title, subtitle, status, media}) {
        const statusLabels = {draft: '草稿', published: '已發佈', archived: '已封存'}
        const skuText = subtitle ? `SKU: ${subtitle}` : '無 SKU'
        return {
            title: title || '未命名產品',
            subtitle: `${skuText} | ${statusLabels[status] || status || '未知狀態'}`,
            media,
        }
        },
    },
    })