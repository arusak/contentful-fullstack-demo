import { buildTree } from '@/app/_utils/TreeUtils'
import { baseUrl } from '@/lib/controllers/baseUrl'
import type { Category, TreeNode } from '@/lib/types/AppTypes'

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${baseUrl}/api/category`)
  if (!response.ok)
    throw new Error(
      `Error getting list of categories: ${response.status} ${response.statusText}`,
    )
  const data = await response.json()
  return data.items
}

export async function getCategoriesTree(): Promise<TreeNode<Category> | null> {
  const categories = await fetchCategories()
  return buildTree(categories)
}
