import Link from 'next/link'
import { baseUrl } from '@/lib/controllers/baseUrl'
import type { Instruction } from '@/lib/types/AppTypes'

export const dynamic = 'force-dynamic'

async function getInstructions(): Promise<Instruction[]> {
  const response = await fetch(`${baseUrl}/api/instruction`, {
    headers: {
      'X-User-Roles': 'Support',
    },
  })
  if (!response.ok)
    throw new Error(
      `Error getting list of instructions: ${response.status} ${response.statusText}`,
    )
  const data = await response.json()
  return data.items
}

export default async function Home() {
  const instructions = await getInstructions()

  return (
    <div>
      <h1>Instructions</h1>
      <ul>
        {instructions.map((instruction) => (
          <li key={instruction.id}>
            <h2>
              <Link href={`/instruction/${instruction.id}`}>
                {instruction.title}
              </Link>
            </h2>
          </li>
        ))}
      </ul>
    </div>
  )
}
