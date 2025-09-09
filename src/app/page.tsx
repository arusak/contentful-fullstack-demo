'use client'

import { useEffect, useState } from 'react'
import type { Instruction } from '@/lib/types/ContentfulTypes'

export default function Home() {
  const [instructions, setInstructions] = useState<Instruction[]>([])
  const [error, setError] = useState(null)

  // todo refactor to use()
  useEffect(() => {
    async function fetchInstructions() {
      try {
        const response = await fetch('/api/instruction', {
          headers: {
            'X-User-Roles': 'Support',
          },
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const data = await response.json()
        setInstructions(data.items)
      } catch (err) {
        setError((err as any).message)
      }
    }

    fetchInstructions()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Instructions</h1>
      <ul>
        {instructions.map((instruction) => (
          <li key={instruction.id}>
            <h2>{instruction.title}</h2>
          </li>
        ))}
      </ul>
    </div>
  )
}
