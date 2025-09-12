import { buildTree } from '../TreeUtils'

// Test data interface
interface TestItem {
  id: string
  parentId: string | null
  name: string
}

describe('buildTree', () => {
  describe('Basic functionality', () => {
    it('should build a simple tree with root and one child', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Child' },
      ]

      const result = buildTree(items)

      expect(result).toEqual({
        id: '1',
        data: { id: '1', parentId: null, name: 'Root' },
        children: [
          {
            id: '2',
            data: { id: '2', parentId: '1', name: 'Child' },
            children: [],
          },
        ],
      })
    })

    it('should build a multi-level tree', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Level 1 - A' },
        { id: '3', parentId: '1', name: 'Level 1 - B' },
        { id: '4', parentId: '2', name: 'Level 2 - A1' },
        { id: '5', parentId: '2', name: 'Level 2 - A2' },
        { id: '6', parentId: '3', name: 'Level 2 - B1' },
      ]

      const result = buildTree(items)

      expect(result).toEqual({
        id: '1',
        data: { id: '1', parentId: null, name: 'Root' },
        children: [
          {
            id: '2',
            data: { id: '2', parentId: '1', name: 'Level 1 - A' },
            children: [
              {
                id: '4',
                data: { id: '4', parentId: '2', name: 'Level 2 - A1' },
                children: [],
              },
              {
                id: '5',
                data: { id: '5', parentId: '2', name: 'Level 2 - A2' },
                children: [],
              },
            ],
          },
          {
            id: '3',
            data: { id: '3', parentId: '1', name: 'Level 1 - B' },
            children: [
              {
                id: '6',
                data: { id: '6', parentId: '3', name: 'Level 2 - B1' },
                children: [],
              },
            ],
          },
        ],
      })
    })

    it('should build a deep tree', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Level 1' },
        { id: '3', parentId: '2', name: 'Level 2' },
        { id: '4', parentId: '3', name: 'Level 3' },
        { id: '5', parentId: '4', name: 'Level 4' },
      ]

      const result = buildTree(items)

      expect(result?.id).toBe('1')
      expect(result?.children).toHaveLength(1)
      expect(result?.children[0].id).toBe('2')
      expect(result?.children[0].children).toHaveLength(1)
      expect(result?.children[0].children[0].id).toBe('3')
      expect(result?.children[0].children[0].children).toHaveLength(1)
      expect(result?.children[0].children[0].children[0].id).toBe('4')
      expect(result?.children[0].children[0].children[0].children).toHaveLength(
        1,
      )
      expect(result?.children[0].children[0].children[0].children[0].id).toBe(
        '5',
      )
    })
  })

  describe('Edge cases', () => {
    it('should return null when no items are provided', () => {
      const result = buildTree([])
      expect(result).toBeNull()
    })

    it('should return null when no root node exists', () => {
      const items: TestItem[] = [
        { id: '1', parentId: '999', name: 'Child without root' },
        { id: '2', parentId: '1', name: 'Grandchild' },
      ]

      const result = buildTree(items)
      expect(result).toBeNull()
    })

    it('should handle a single root node with no children', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'Lonely Root' },
      ]

      const result = buildTree(items)

      expect(result).toEqual({
        id: '1',
        data: { id: '1', parentId: null, name: 'Lonely Root' },
        children: [],
      })
    })

    it('should handle orphaned nodes (children without existing parents)', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Valid Child' },
        { id: '3', parentId: '999', name: 'Orphaned Child' },
      ]

      const result = buildTree(items)

      expect(result).toEqual({
        id: '1',
        data: { id: '1', parentId: null, name: 'Root' },
        children: [
          {
            id: '2',
            data: { id: '2', parentId: '1', name: 'Valid Child' },
            children: [],
          },
        ],
      })
    })

    it('should handle multiple root candidates (takes first one)', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'First Root' },
        { id: '2', parentId: null, name: 'Second Root' },
        { id: '3', parentId: '1', name: 'Child of First' },
      ]

      const result = buildTree(items)

      expect(result?.id).toBe('1')
      expect(result?.data.name).toBe('First Root')
      expect(result?.children).toHaveLength(1)
      expect(result?.children[0].id).toBe('3')
    })

    it('should handle unordered input data', () => {
      const items: TestItem[] = [
        { id: '3', parentId: '2', name: 'Level 2' },
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Level 1' },
        { id: '4', parentId: '3', name: 'Level 3' },
      ]

      const result = buildTree(items)

      expect(result?.id).toBe('1')
      expect(result?.children[0].id).toBe('2')
      expect(result?.children[0].children[0].id).toBe('3')
      expect(result?.children[0].children[0].children[0].id).toBe('4')
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
      ]

      const result = buildTree(items)

      expect(result).toEqual({
        id: '1',
        data: { id: '1', parentId: null, value: 100, isActive: true },
        children: [
          {
            id: '2',
            data: { id: '2', parentId: '1', value: 50, isActive: false },
            children: [],
          },
        ],
      })
    })

    it('should preserve all original data properties', () => {
      const items = [
        {
          id: '1',
          parentId: null,
          name: 'Root',
          extraProp: 'extra',
          nestedObj: { foo: 'bar' },
        },
        {
          id: '2',
          parentId: '1',
          name: 'Child',
          extraProp: 'child-extra',
          nestedObj: { baz: 'qux' },
        },
      ]

      const result = buildTree(items)

      expect(result?.data).toEqual({
        id: '1',
        parentId: null,
        name: 'Root',
        extraProp: 'extra',
        nestedObj: { foo: 'bar' },
      })
      expect(result?.children[0].data).toEqual({
        id: '2',
        parentId: '1',
        name: 'Child',
        extraProp: 'child-extra',
        nestedObj: { baz: 'qux' },
      })
    })
  })

  describe('Data integrity', () => {
    it('should not mutate the original input array', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Child' },
      ]
      const originalItems = JSON.parse(JSON.stringify(items))

      buildTree(items)

      expect(items).toEqual(originalItems)
    })

    it('should handle duplicate IDs gracefully', () => {
      const items: TestItem[] = [
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Child 1' },
        { id: '2', parentId: '1', name: 'Child 2' }, // Duplicate ID
      ]

      const result = buildTree(items)

      expect(result?.id).toBe('1')
      expect(result?.children).toHaveLength(2)
      // Both items with duplicate IDs should be included
      expect(result?.children.map((c) => c.data.name)).toEqual([
        'Child 1',
        'Child 2',
      ])
    })
  })
})
