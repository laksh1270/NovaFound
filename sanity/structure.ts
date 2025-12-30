import type { StructureResolver } from 'sanity/structure'

// Simple structure — DO NOT define actions here
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('startup').title('Startups'),
    ])
