import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import React from 'react'

const PortfolioIcon = () => (
  React.createElement('img', { src: '/favicon.png', alt: 'Portfolio Icon', style: { width: '100%', height: '100%', objectFit: 'contain' } })
)

export default defineConfig({
  name: 'default',
  title: 'Portfolio Studio',
  icon: PortfolioIcon,

  projectId: '9hecsvz8',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
