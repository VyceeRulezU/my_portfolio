import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isPrivate',
      title: 'Private Project (Gated)',
      type: 'boolean',
      initialValue: false,
      description: 'If enabled, users will see a lock screen and must contact you for access.',
    }),
    defineField({
      name: 'password',
      title: 'Case Study Password',
      type: 'string',
      hidden: ({document}) => !document?.isPrivate,
      description: 'Optional: If you want to give a password to specific people.',
    }),

    defineField({
      name: 'img',
      title: 'Main Image (Thumbnail)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'num',
      title: 'Project Number',
      type: 'string',
      description: 'e.g. 01, 02',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Live', value: 'live'},
          {title: 'Case Study', value: 'case'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'processImages',
      title: 'Process Images (Gallery)',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      options: {
        layout: 'grid',
      },
    }),



    defineField({
      name: 'overview',
      title: 'Project Overview - Context & Brief',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'overviewImages',
      title: 'Overview Section Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      options: { layout: 'grid' },
    }),

    defineField({
      name: 'problem',
      title: 'The Problem - Problem Space',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'problemImages',
      title: 'Problem Section Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'solution',
      title: 'The Solution - Design Approach',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'solutionImages',
      title: 'Solution Section Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'impact',
      title: 'Results & Impact - Outcomes & Impact',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'impactImages',
      title: 'Impact Section Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      options: { layout: 'grid' },
    }),




    defineField({
      name: 'url',
      title: 'Project URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'img',
    },
  },
})
