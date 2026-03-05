import type { RegionsPayload } from '../types/regions'

export async function regionsLoader() {
  const response = await fetch('/data/indonesia_regions.json', {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Response('Failed to load region data', {
      status: response.status,
      statusText: response.statusText,
    })
  }

  return (await response.json()) as RegionsPayload
}
