import { NextResponse } from 'next/server'
import { client } from '@/lib/config/contentfulClient'
import { roleMapping } from '@/lib/config/roleMapping'
import type { ErrorBody } from '@/lib/types/ApiTypes'
import type { Instruction } from '@/lib/types/AppTypes'
import type { ContentfulInstruction } from '@/lib/types/ContentfulTypes'

// Utility function to map roles to tags
export function toTags(roles: string[]) {
  return [...new Set(roles.flatMap((role) => roleMapping[role] || []))]
}

// Helper function for error handling
export function errorResponse(
  status = 500,
  message = 'Internal Server Error',
): NextResponse<ErrorBody> {
  return new NextResponse(JSON.stringify({ code: status, error: message }), {
    status,
    statusText: message,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function jsonResponse<T extends object>(
  body: T,
  status = 200,
  statusText = 'OK',
): NextResponse<T> {
  return new NextResponse(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
    statusText,
  })
}

export async function getInstructions(roles: string[]) {
  try {
    const roleTags = toTags(roles)

    if (!roleTags.length) return jsonResponse({ items: [] })

    const entries = await client.getEntries({
      content_type: 'instruction',
      'metadata.tags.sys.id[in]': roleTags,
      select: ['sys.id', 'fields', 'metadata.tags', 'sys.createdAt'],
      order: ['-sys.createdAt'],
      limit: 100,
      include: 3,
    })

    const items = entries.items.map((entry) => ({
      id: entry.sys.id,
      title: entry.fields.title,
      summary: entry.fields.summary,
      tags: (entry.metadata.tags || []).map((tag) => JSON.stringify(tag)),
      createdAt: entry.sys.createdAt,
    }))

    return jsonResponse({ items })
  } catch (err) {
    console.error(err)

    return errorResponse()
  }
}

export async function getInstructionById(
  roles: string[],
  instructionId: string,
): Promise<NextResponse<Instruction | ErrorBody>> {
  const userTags = toTags(roles)

  try {
    const entry = await client.getEntry<ContentfulInstruction>(instructionId, {
      include: 2,
    })
    const entryTags = (entry.metadata.tags || []).map((tag) => tag.sys.id)
    const hasAccess = entryTags.some((tag) => userTags.includes(tag))
    if (!hasAccess) return errorResponse(403, 'Access denied')

    return jsonResponse({
      id: entry.sys.id,
      title: entry.fields.title,
      description: entry.fields.description,
      tags: entryTags,
      createdAt: new Date(entry.sys.createdAt),
      updatedAt: new Date(entry.sys.updatedAt),
      categories:
        entry.metadata.concepts?.map((concept) => concept.sys.id) ?? [],
    })
  } catch (err) {
    console.error(err)
    return errorResponse()
  }
}
