import createImageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const imageBuilder = createImageUrlBuilder(client as any)

export const urlForImage = (source: any) =>
  imageBuilder.image(source).auto('format').fit('max')
