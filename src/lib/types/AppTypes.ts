import type { Document } from '@contentful/rich-text-types'

export interface Instruction {
  id: string
  title: string
  description: Document
  categories: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}
