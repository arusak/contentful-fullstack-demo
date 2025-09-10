import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Link from 'next/link'
import { use } from 'react'
import type { Instruction } from '@/lib/types/ContentfulTypes'

async function getInstructionById(id: string): Promise<Instruction> {
  const response = await fetch(
    `${process.env.BASE_URL}/api/instruction/${id}`,
    {
      headers: {
        'X-User-Roles': 'Support',
      },
    },
  )
  if (!response.ok) throw new Error(`Error: ${response.status}`)
  return response.json()
}

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const instruction = use(getInstructionById(id))

  return (
    <div>
      <Link href="/">&lt; Back</Link>
      <h1>{instruction.title}</h1>
      <div>{documentToReactComponents(instruction.description)}</div>
    </div>
  )
}
