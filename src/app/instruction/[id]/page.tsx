import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Link from 'next/link'
import { CategoryCrumbs } from '@/app/_components/CategoryCrumbs'
import { baseUrl } from '@/lib/controllers/baseUrl'
import type { Instruction } from '@/lib/types/AppTypes'

async function getInstructionById(id: string): Promise<Instruction> {
  const response = await fetch(`${baseUrl}/api/instruction/${id}`, {
    headers: {
      'X-User-Roles': 'Support',
    },
  })
  if (!response.ok)
    throw new Error(
      `Error getting instruction by id: ${response.status} ${response.statusText}`,
    )
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
      <header>
        <Link href="/">&lt; Back</Link>
        <h1>{instruction.title}</h1>
        <p>{new Date(instruction.updatedAt).toLocaleString()}</p>
      </header>
      <div>{documentToReactComponents(instruction.description)}</div>
      <footer>
        <hr />
        {instruction.categories[0] ? (
          <CategoryCrumbs id={instruction.categories[0]} />
        ) : null}
      </footer>
    </div>
  )
}
