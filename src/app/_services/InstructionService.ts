import { baseUrl } from '@/lib/controllers/baseUrl'
import type { Instruction } from '@/lib/types/AppTypes'

export async function getInstructions(): Promise<Instruction[]> {
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
