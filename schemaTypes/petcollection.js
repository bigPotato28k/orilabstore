import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'petcollection',
  title: 'Pet Collection / Series',
  type: 'document',
  fields: [
    defineField({
        name: 'name', 
        type: 'string', 
        validation: (r) => r.required()}),
    defineField({
        name: 'slug', 
        type: 'slug', 
        title: '網址路徑 (Slug)',
        options: {source: 'name'},
        validation: (r) => r.required().error('必須生成網址路徑')}),
    defineField({
      name: 'type', 
      title: '產品分類 (Type)', 
      type: 'string',
      options: {list: [
        {title: 'Book & Station 書冊文具', value: 'Book_Station'},
        {title: 'Phone Accessories 手機配件', value: 'Phone_Accessories'},
        {title: 'Personal Accessories 個人配件', value: 'Personal_Accessories'},
        {title: 'Lifestyle 生活雜貨', value: 'Lifestyle'},
      ]},
      validation: (r) => r.required(),
    }),
    defineField({
        name: 'season', 
        type: 'string', 
        title: 'Season(如 2026-11)'}),
    defineField({
        name: 'description', 
        type: 'text', 
        rows: 3}),
    defineField({
        name: 'coverImage', 
        title: 'Main Image', 
        type: 'image',
        options: {hotspot: true},
        fields: [{
            name: 'alt', type: 'string', title: '替代文字 (Alt Text)',
            description: '對無障礙環境與 SEO 至關重要。',
            validation: (r) => r.required(),
        }],
    }),
    defineField({
        name: 'tags', 
        title: '標籤 (Tags)', 
        type: 'array',
        of: [{type: 'string'}], 
        options: {layout: 'tags'},
    }),
    defineField({
        name: 'isActive', 
        type: 'boolean', 
        title: '是否銷售中', 
        initialValue: true}),
    defineField({
        name: 'sortOrder', 
        type: 'number'}),
    ],
    preview: {
        select: {
            name: 'name', 
            type: 'type', 
            media: 'coverImage', 
            isActive: 'isActive'},
        prepare({name, type, media, isActive}) {
        return {
            title: name,
            subtitle: `${type || '未分類'}${isActive ? '' : ' - 已下架'}`,
            media,
        }
    },
  },
})