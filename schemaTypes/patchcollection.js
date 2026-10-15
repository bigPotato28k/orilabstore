import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'patchcollection',
    title: 'Patch Collection / Series',
    type: 'document',
    fields: [
    defineField({
        name: 'name', 
        title: '徽章系列標題 (Collection)', 
        type: 'string',
        validation: (r) => r.required().max(70).error('系列標題長度需要在70字以內'),
    }),
    defineField({
        name: 'slug', 
        title: '網址路徑 (Slug)', 
        type: 'slug',
        options: {source: 'name'},
        validation: (r) => r.required().error('必須生成路徑'),
    }),
    defineField({
        name: 'coverImage', 
        title: '徽章系列主圖', 
        type: 'image',
        options: {hotspot: true},
        fields: [{
            name: 'alt', 
            type: 'string', 
            title: '替代文字 (Alt Text)',
            validation: (r) => r.required(),
        }],
    }),
    defineField({
        name: 'description', 
        type: 'text', 
        title: '系列簡短描述', 
        rows: 3}),
    defineField({
        name: 'theme', 
        title: '主題 (Theme)', 
        type: 'string',
        options: {
            list: [
            {title: 'Animals 動物', value: 'animals'},
            {title: 'Food 食物', value: 'food'},
            {title: 'Festival 節慶', value: 'festival'},
            {title: 'Nature 自然', value: 'nature'},
            ],
            layout: 'radio',
        },
        validation: (r) => r.required().error('必須選擇主題'),
    }),
    defineField({
        name: 'tags', 
        title: '系列標籤', 
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
    select: {name: 'name', theme: 'theme', media: 'coverImage'},
    prepare({name, theme, media}) {
      return {title: name, subtitle: theme ? `Theme: ${theme}` : '未設主題', media}
    },
  },
})