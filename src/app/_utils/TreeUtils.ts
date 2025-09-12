import type { TreeNode } from '@/lib/types/AppTypes'

export const buildTree = <T extends { id: string; parentId: string | null }>(
  list: T[],
): TreeNode<T> | null => {
  const childMap = new Map<string | null, T[]>()
  list.forEach((item) => {
    childMap.set(item.parentId, [...(childMap.get(item.parentId) ?? []), item])
  })
  const root = childMap.get(null)?.[0]
  if (!root) return null

  return addChildren(root, childMap)
}

const addChildren = <T extends { id: string; parentId: string | null }>(
  data: T,
  childMap: Map<string | null, T[]>,
): TreeNode<T> => {
  const node: TreeNode<T> = {
    id: data.id,
    data,
    children: [],
  }

  const childrenData = childMap.get(data.id)

  if (!childrenData || childrenData?.length === 0) return node

  return {
    ...node,
    children: childrenData.map((child) => addChildren(child, childMap)),
  }
}

export const getPathToNode = <T>(
  tree: TreeNode<T>,
  nodeId: string,
): T[] | null => {
  if (tree.id === nodeId) {
    return [tree.data]
  }

  for (const child of tree.children) {
    const path = getPathToNode(child, nodeId)
    if (path) {
      path.unshift(tree.data)
      return path
    }
  }

  return null
}
