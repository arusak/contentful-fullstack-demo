import Link from 'next/link'
import type { Instruction } from '@/lib/types/ContentfulTypes'

export const dynamic = 'force-dynamic'

async function getInstructions(): Promise<Instruction[]> {
  const response = await fetch(
    `https://${process.env.VERCEL_URL}/api/instruction`,
    {
      headers: {
        'X-User-Roles': 'Support',
      },
    },
  )
  if (!response.ok) throw new Error(`Error: ${response.status}`)
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
