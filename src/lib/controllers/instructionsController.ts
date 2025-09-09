import { client } from '@/lib/config/contentfulClient'
import type { ContentfulInstruction } from '@/lib/types/ContentfulTypes'
import { roleMapping } from '../config/roleMapping'

// Utility function to map roles to tags
export function toTags(roles: string[]) {
  return [...new Set(roles.flatMap((role) => roleMapping[role] || []))]
}

// Helper function for error handling
export function errorResponse(status = 500, message = 'Internal Server Error') {
  return new Response(JSON.stringify({ code: status, error: message }), {
    status,
    statusText: message,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function jsonResponse(body: object, status = 200, statusText = 'OK') {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
    statusText,
  })
}

export async function getInstructions(roles: string[]) {
  try {
    const roleTags = toTags(roles)

    console.log('requested tags:', roleTags)

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
) {
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
      content: entry.fields.description.content.map((c) =>
        // @ts-expect-error
        c.content.map((cc) => cc.value),
      ),
      tags: entryTags,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
    })
  } catch (err) {
    console.error(err)
    return errorResponse()
  }
}
