import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'Example: DC Drop Shoulder 01',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'price',
      title: 'Price (Taka only - numbers only)',
      type: 'number',
      description: 'Example: 1699 (do not add ৳ symbol)',
      validation: Rule => Rule.required().positive()
    }),
    defineField({
      name: 'description',
      title: 'Product Description',
      type: 'text',
      rows: 4,
      description: 'Short description shown on product card'
    }),
    defineField({
      name: 'tag',
      title: 'Product Badge/Tag',
      type: 'string',
      description: 'Small badge shown on photo. Example: Drop 01, Limited, Archive',
      options: {
        list: [
          { title: 'Drop 01', value: 'Drop 01' },
          { title: 'Limited', value: 'Limited' },
          { title: 'Archive', value: 'Archive' },
          { title: 'New', value: 'New' },
          { title: 'Sold Out', value: 'Sold Out' },
        ]
      }
    }),
    defineField({
      name: 'image',
      title: 'Product Photo',
      type: 'image',
      description: 'Upload the product photo here. JPG or PNG.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      description: 'Tick all sizes available for this product',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
        ],
        layout: 'grid'
      }
    }),
    defineField({
      name: 'colours',
      title: 'Available Colours',
      type: 'array',
      description: 'Tick all colours available for this product',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Acid Wash Black', value: 'Acid Wash Black' },
          { title: 'Washed Ash Grey', value: 'Washed Ash Grey' },
          { title: 'Vintage White', value: 'Vintage White' },
          { title: 'Stone Brown', value: 'Stone Brown' },
          { title: 'Jet Black', value: 'Jet Black' },
        ],
        layout: 'grid'
      }
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock?',
      type: 'boolean',
      description: 'Turn OFF to hide this product from the website',
      initialValue: true
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: '1 = first, 2 = second etc.',
      initialValue: 1
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'price'
    },
    prepare(selection) {
      return {
        ...selection,
        subtitle: `৳${selection.subtitle}`
      }
    }
  }
})
