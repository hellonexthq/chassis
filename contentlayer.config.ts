import {
  ComputedFields,
  defineDocumentType,
  makeSource
} from 'contentlayer/source-files'
import fs from 'fs'
import path from 'path'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrettyCode, { type Options } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

const rehypePrettyCodeOptions: Partial<Options> = {
  theme: 'one-dark-pro',
  tokensMap: {
    // VScode command palette: Inspect Editor Tokens and Scopes
    // https://github.com/Binaryify/OneDark-Pro/blob/47c66a2f2d3e5c85490e1aaad96f5fab3293b091/themes/OneDark-Pro.json
    fn: 'entity.name.function',
    objKey: 'meta.object-literal.key'
  },
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
    node.properties.className.push('syntax-line')
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push('syntax-line--highlighted')
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ['syntax-word--highlighted']
  }
}

const computedFields: ComputedFields = {
  readingTime: {
    type: 'json',
    resolve: (doc) => readingTime(doc.body.raw)
  },
  lastUpdatedAt: {
    type: 'string',
    resolve: (doc) => {
      return fs.statSync(
        path.join(path.resolve(), 'src/data', doc._raw.sourceFilePath)
      ).mtime
    }
  },
  wordCount: {
    type: 'number',
    resolve: (doc) => doc.body.raw.split(/\s+/gu).length
  },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, '')
  }
}

const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    publishedAt: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    image: { type: 'string' },
    category: { type: 'string' },
    rework: { type: 'string' },
    author: { type: 'string', required: true }
  },
  computedFields
}))

const Author = defineDocumentType(() => ({
  name: 'Author',
  filePathPattern: 'authors/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string', required: true },
    description: { type: 'string', required: false },
    occupation: { type: 'string', required: false },
    company: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' }
  }
}))

const contentLayerConfig = makeSource({
  contentDirPath: 'src/data',
  contentDirExclude: ['**/*.json', '**/manifesto.mdx'],
  documentTypes: [Blog, Author],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      rehypeCodeTitles,
      [rehypePrettyCode, rehypePrettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor']
          }
        }
      ]
    ]
  }
})

export default contentLayerConfig
