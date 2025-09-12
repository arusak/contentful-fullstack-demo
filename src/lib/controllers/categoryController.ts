import type { NextResponse } from 'next/server'
import { client } from '@/lib/config/contentfulClient'
import {
  errorResponse,
  jsonResponse,
} from '@/lib/controllers/instructionController'
import type { ErrorBody } from '@/lib/types/ApiTypes'
import type { Category } from '@/lib/types/AppTypes'

export async function getCategories(): Promise<
  NextResponse<{ items: Category[] } | ErrorBody>
> {
  try {
    const { items } = await client.getConcepts({
      limit: 999,
      conceptScheme: 'customerInstructionsMenu',
    })

    const categories = items.map((item) => ({
      id: item.sys.id,
      name: item.prefLabel['en-US'],
      parentId: item.broader?.map((b) => b.sys.id)[0] ?? null,
    }))

    return jsonResponse({ items: categories })
  } catch (err) {
    console.error(err)

    return errorResponse()
  }
}
