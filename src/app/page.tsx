import Link from 'next/link'
import { use } from 'react'
import type { Instruction } from '@/lib/types/ContentfulTypes'

async function getInstructions(): Promise<Instruction[]> {
  const response = await fetch(`${process.env.BASE_URL}/api/instruction`, {
    headers: {
      'X-User-Roles': 'Support',
    },
  })
  if (!response.ok) throw new Error(`Error: ${response.status}`)
  const data = await response.json()
  return data.items
}

export default function Home() {
  const instructions = use(getInstructions())

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
