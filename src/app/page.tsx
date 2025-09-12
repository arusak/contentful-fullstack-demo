import Link from 'next/link'
import { getInstructions } from '@/app/_services/InstructionService'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const instructions = await getInstructions()

  return (
    <div>
      <header>
        <h1>Instructions</h1>
      </header>
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
