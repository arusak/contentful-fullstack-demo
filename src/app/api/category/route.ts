import { getCategories } from '@/lib/controllers/categoryController'
import { errorResponse } from '@/lib/controllers/instructionController'

export function GET() {
  try {
    console.log('GET categories')

    return getCategories()
  } catch (error) {
    console.error(error)
    return errorResponse()
  }
}
