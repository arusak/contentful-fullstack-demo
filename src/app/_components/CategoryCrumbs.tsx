import { getCategoriesTree } from '@/app/_services/CategoryService'
import { getPathToNode } from '@/app/_utils/TreeUtils'

type Props = { id: string }

export const CategoryCrumbs = async ({ id }: Props) => {
  const categories = await getCategoriesTree()

  if (!categories) return null

  const path = getPathToNode(categories, id)

  if (!path) return null

  return <div>{path.map((n) => n.name).join(' · ')}</div>
}
