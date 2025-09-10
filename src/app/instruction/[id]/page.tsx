import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { headers } from 'next/headers'
import Link from 'next/link'
import { use } from 'react'
import type { Instruction } from '@/lib/types/ContentfulTypes'

async function getInstructionById(id: string): Promise<Instruction> {
  // When fetching on the server, an absolute URL is required.
  // In a real application, this should be an environment variable.
  const h = await headers()
  const host = h.get('host')
  const response = await fetch(`http://${host}/api/instruction/${id}`, {
    headers: {
      'X-User-Roles': 'Support',
    },
  })
  if (!response.ok) {
    // This will be caught by the nearest error boundary.
    throw new Error(`Error: ${response.status}`)
  }
  return response.json()
}

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const instruction = use(getInstructionById(id))
  console.log(instruction)

  return (
    <div>
      <Link href="/">&lt; Back</Link>
      <h1>{instruction.title}</h1>
      <div>{documentToReactComponents(instruction.description)}</div>
    </div>
  )
}
