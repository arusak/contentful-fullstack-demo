/** biome-ignore-all lint/style/noNonNullAssertion: there are test man */

import type { TreeNode } from '@/lib/types/AppTypes'
import { buildTree, getPathToNode } from '../TreeUtils'

// Test data interface
interface TestItem {
  id: string
  parentId: string | null
  name: string
}

describe('getPathToNode', () => {
  // Helper function to create test tree
  const createTestTree = (): TreeNode<TestItem> => {
    const items: TestItem[] = [
      { id: '1', parentId: null, name: 'Root' },
      { id: '2', parentId: '1', name: 'Level 1 - A' },
      { id: '3', parentId: '1', name: 'Level 1 - B' },
      { id: '4', parentId: '2', name: 'Level 2 - A1' },
      { id: '5', parentId: '2', name: 'Level 2 - A2' },
      { id: '6', parentId: '3', name: 'Level 2 - B1' },
      { id: '7', parentId: '4', name: 'Level 3 - A1a' },
    ]
    return buildTree(items)!
  }

  describe('Basic functionality', () => {
    it('should return path to root node', () => {
      const tree = createTestTree()
      const path = getPathToNode(tree, '1')

      expect(path).toEqual([{ id: '1', parentId: null, name: 'Root' }])
    })

    it('should return path to direct child', () => {
      const tree = createTestTree()
      const path = getPathToNode(tree, '2')

      expect(path).toEqual([
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Level 1 - A' },
      ])
    })

    it('should return path to nested child', () => {
      const tree = createTestTree()
      const path = getPathToNode(tree, '4')

      expect(path).toEqual([
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Level 1 - A' },
        { id: '4', parentId: '2', name: 'Level 2 - A1' },
      ])
    })

    it('should return path to deeply nested child', () => {
      const tree = createTestTree()
      const path = getPathToNode(tree, '7')

      expect(path).toEqual([
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Level 1 - A' },
        { id: '4', parentId: '2', name: 'Level 2 - A1' },
        { id: '7', parentId: '4', name: 'Level 3 - A1a' },
      ])
    })

    it('should return path to node in different branch', () => {
      const tree = createTestTree()
      const path = getPathToNode(tree, '6')

      expect(path).toEqual([
        { id: '1', parentId: null, name: 'Root' },
        { id: '3', parentId: '1', name: 'Level 1 - B' },
        { id: '6', parentId: '3', name: 'Level 2 - B1' },
      ])
    })
  })

  describe('Edge cases', () => {
    it('should return null when node is not found', () => {
      const tree = createTestTree()
      const path = getPathToNode(tree, 'nonexistent')

      expect(path).toBeNull()
    })

    it('should handle single node tree', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'Single Node' },
      ]
      const tree = buildTree(items)!
      const path = getPathToNode(tree, '1')

      expect(path).toEqual([{ id: '1', parentId: null, name: 'Single Node' }])
    })

    it('should return null when searching in single node tree for non-existent node', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'Single Node' },
      ]
      const tree = buildTree(items)!
      const path = getPathToNode(tree, '999')

      expect(path).toBeNull()
    })

    it('should handle tree with no children', () => {
      const items: TestItem[] = [
        { id: 'root', parentId: null, name: 'Lonely Root' },
      ]
      const tree = buildTree(items)!
      const path = getPathToNode(tree, 'root')

      expect(path).toEqual([
        { id: 'root', parentId: null, name: 'Lonely Root' },
      ])
    })
  })

  describe('Path correctness', () => {
    it('should maintain correct order from root to target', () => {
      const tree = createTestTree()
      const path = getPathToNode(tree, '5')

      expect(path).toHaveLength(3)
      expect(path![0].name).toBe('Root')
      expect(path![1].name).toBe('Level 1 - A')
      expect(path![2].name).toBe('Level 2 - A2')
    })

    it('should return different paths for different nodes', () => {
      const tree = createTestTree()
      const pathToA1 = getPathToNode(tree, '4')
      const pathToA2 = getPathToNode(tree, '5')

      expect(pathToA1).toHaveLength(3)
      expect(pathToA2).toHaveLength(3)
      expect(pathToA1![2].name).toBe('Level 2 - A1')
      expect(pathToA2![2].name).toBe('Level 2 - A2')
    })

    it('should handle multiple nodes with same parent correctly', () => {
      const tree = createTestTree()
      const pathToChild2 = getPathToNode(tree, '2')
      const pathToChild3 = getPathToNode(tree, '3')

      expect(pathToChild2).toEqual([
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Level 1 - A' },
      ])
      expect(pathToChild3).toEqual([
        { id: '1', parentId: null, name: 'Root' },
        { id: '3', parentId: '1', name: 'Level 1 - B' },
      ])
    })
  })

  describe('Type safety and generics', () => {
    interface CustomItem {
      id: string
      parentId: string | null
      value: number
      isActive: boolean
    }

    it('should work with custom data types', () => {
      const items: CustomItem[] = [
        { id: '1', parentId: null, value: 100, isActive: true },
        { id: '2', parentId: '1', value: 50, isActive: false },
        { id: '3', parentId: '2', value: 25, isActive: true },
      ]
      const tree = buildTree(items)!
      const path = getPathToNode(tree, '3')

      expect(path).toEqual([
        { id: '1', parentId: null, value: 100, isActive: true },
        { id: '2', parentId: '1', value: 50, isActive: false },
        { id: '3', parentId: '2', value: 25, isActive: true },
      ])
    })

    it('should preserve all original data properties in path', () => {
      const items = [
        {
          id: '1',
          parentId: null,
          name: 'Root',
          extraProp: 'root-extra',
          metadata: { level: 0 },
        },
        {
          id: '2',
          parentId: '1',
          name: 'Child',
          extraProp: 'child-extra',
          metadata: { level: 1 },
        },
      ]
      const tree = buildTree(items)!
      const path = getPathToNode(tree, '2')

      expect(path).toEqual([
        {
          id: '1',
          parentId: null,
          name: 'Root',
          extraProp: 'root-extra',
          metadata: { level: 0 },
        },
        {
          id: '2',
          parentId: '1',
          name: 'Child',
          extraProp: 'child-extra',
          metadata: { level: 1 },
        },
      ])
    })
  })

  describe('Performance and traversal', () => {
    it('should handle deep trees efficiently', () => {
      // Create a deep linear tree
      const items: TestItem[] = []
      for (let i = 1; i <= 100; i++) {
        items.push({
          id: i.toString(),
          parentId: i === 1 ? null : (i - 1).toString(),
          name: `Level ${i}`,
        })
      }
      const tree = buildTree(items)!

      const start = performance.now()
      const path = getPathToNode(tree, '100')
      const end = performance.now()

      expect(path).toHaveLength(100)
      expect(path![0].name).toBe('Level 1')
      expect(path![99].name).toBe('Level 100')
      expect(end - start).toBeLessThan(50) // Should complete in under 50ms
    })

    it('should handle wide trees efficiently', () => {
      // Create a wide tree (1 root + 1000 direct children)
      const items: TestItem[] = [{ id: '0', parentId: null, name: 'Root' }]
      for (let i = 1; i <= 1000; i++) {
        items.push({
          id: i.toString(),
          parentId: '0',
          name: `Child ${i}`,
        })
      }
      const tree = buildTree(items)!

      const start = performance.now()
      const path = getPathToNode(tree, '500')
      const end = performance.now()

      expect(path).toHaveLength(2)
      expect(path![0].name).toBe('Root')
      expect(path![1].name).toBe('Child 500')
      expect(end - start).toBeLessThan(50) // Should complete in under 50ms
    })
  })

  describe('Data integrity', () => {
    it('should not mutate the tree structure', () => {
      const tree = createTestTree()
      const originalTree = JSON.parse(JSON.stringify(tree))

      getPathToNode(tree, '5')

      expect(tree).toEqual(originalTree)
    })

    it('should return immutable path array', () => {
      const tree = createTestTree()
      const path = getPathToNode(tree, '4')!
      const originalPath = [...path]

      // Attempt to mutate returned path
      path.push({ id: 'new', parentId: '4', name: 'Mutated' })

      // Original tree should be unchanged
      const newPath = getPathToNode(tree, '4')
      expect(newPath).toEqual(originalPath)
    })
  })
})
