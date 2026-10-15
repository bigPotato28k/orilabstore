import { defineField, defineType } from "sanity";
export default defineType({
  name: 'blog',
  title: 'Blog / Series',
  type: 'document',
  // 1. 定義後台分組頁籤 (Groups)
  groups: [
    { name: 'content', title: '主要內容', default: true },
    { name: 'seo', title: 'SEO 行銷設定' },
  ],
  fields: [
    /* ==============================
       第一區塊：核心內容欄位 (Core)
       ============================== */
    defineField({
      name: 'title',
      title: '文章標題',
      type: 'string',
      group: 'content',
      validation: (r) => r.required().min(5).max(100).error('標題長度需在 5 到 100 字之間'),
    }),
    defineField({
      name: 'slug',
      title: '網址路徑 (Slug)',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (r) => r.required().error('必須生成網址路徑'),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true, // 開啟焦點裁切
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '替代文字 (Alt Text)',
          description: '對無障礙環境與 SEO 至關重要。',
          validation: (r) => r.required(),
        }
      ]
    }),
    defineField({
      name: 'body',
      title: '文章內文',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' }, // 標準富文本（段落、標題、清單）
        { type: 'image', options: { hotspot: true } }, // 允許內文插入圖片
      ],
    }),

    /* ==============================
       第二區塊：後設資料與排程 (Metadata)
       ============================== */
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(), // 預設帶入當前時間
    }),
    defineField({
      name: 'excerpt',
      title: '文章摘要 (Excerpt)',
      type: 'text',
      group: 'content',
      rows: 3,
      description: '顯示於部落格列表頁的簡短預覽文字。',
      validation: (r) => r.max(200).warning('摘要建議不要超過 200 字'),
    }),

    /* ==============================
       第三區塊：分類與標籤 (Taxonomy)
       ============================== */
    // defineField({
    //   name: 'categories',
    //   title: '文章分類',
    //   type: 'array',
    //   group: 'content',
    //   of: [{ type: 'reference', to: { type: 'category' } }], // 關聯至 category schema
    // }),
    defineField({
      name: 'tags',
      title: '標籤 (Tags)',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags', // 後台 UI 會變成像標籤一樣的藍色碎屑（Chips）外觀
      },
    }),
    defineField({
        name: 'sortOrder', 
        type: 'number'}),

    /* ==============================
       第四區塊：進階與 SEO (Advanced)
       ============================== */
    defineField({
      name: 'isFeatured',
      title: '是否置頂 / 精選文章',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO 搜尋標題',
      type: 'string',
      group: 'seo',
      description: '若不填寫，Google 搜尋將預設抓取「文章標題」。',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO 網頁描述',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('SEO 描述建議在 160 字內，以免在 Google 搜尋結果中被截斷'),
    }),
  ],

  // 後台列表預覽配置
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      isFeatured: 'isFeatured',
    },
    prepare(selection) {
      const { title, media, isFeatured } = selection
      return {
        title: isFeatured ? `📌 ${title}` : title, // 若置頂，標題前加上大頭針圖示
        media: media,
      }
    },
  },
})
