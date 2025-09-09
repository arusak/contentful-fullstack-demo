import type { Entry, EntryCollection, EntryFieldTypes } from 'contentful'

export interface ContentfulInstruction {
  contentTypeId: 'instruction'
  fields: {
    title: EntryFieldTypes.Text
    description: EntryFieldTypes.RichText
  }
}

// Response types for Contentful API
export type InstructionEntry = Entry<ContentfulInstruction>
export type InstructionCollection = EntryCollection<ContentfulInstruction>

export interface Instruction {
  id: string
  title: string
  content: string[]
}
