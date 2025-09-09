import type { NextRequest } from 'next/server'
import {
  errorResponse,
  getInstructions,
} from '@/lib/controllers/instructionsController'

export function GET(request: NextRequest) {
  try {
    const rolesStr = request.headers.get('X-User-Roles')
    const roles = rolesStr ? rolesStr.split(',') : []

    return getInstructions(roles)
  } catch (error) {
    console.error(error)
    return errorResponse()
  }
}
