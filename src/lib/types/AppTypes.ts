import type { Document } from '@contentful/rich-text-types'

export type Instruction = {
  id: string
  title: string
  description: Document
  categories: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: string
  name: string
  parentId: string | null
}

export type TreeNode<T> = {
  id: string
  data: T
  children: TreeNode<T>[]
}
