import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Link from 'next/link'
import type { Instruction } from '@/lib/types/ContentfulTypes'

async function getInstructionById(id: string): Promise<Instruction> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/instruction/${id}`,
    {
      headers: {
        'X-User-Roles': 'Support',
      },
    },
  )
  if (!response.ok) throw new Error(`Error: ${response.status}`)
  return response.json()
}

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const instruction = await getInstructionById(id)

  return (
    <div>
      <Link href="/">&lt; Back</Link>
      <h1>{instruction.title}</h1>
      <div>{documentToReactComponents(instruction.description)}</div>
    </div>
  )
}
