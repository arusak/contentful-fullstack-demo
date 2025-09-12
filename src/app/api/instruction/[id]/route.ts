import type { NextRequest } from 'next/server'
import {
  errorResponse,
  getInstructionById,
} from '@/lib/controllers/instructionController'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rolesStr = request.headers.get('X-User-Roles')
    const roles = rolesStr ? rolesStr.split(',') : []
    const { id } = await params
    return getInstructionById(roles, id)
  } catch (error) {
    console.error(error)
    return errorResponse()
  }
}
