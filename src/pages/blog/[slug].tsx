import { allAuthors, allBlogs, Author, Blog } from 'contentlayer/generated'
import { GetStaticProps } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks'

import { MDXComponents } from '../../components/mdx'

export default function BlogPage({
  post
}: {
  post: Blog & { authorInfo: Author }
}) {
  const Component = useMDXComponent(post.body.code)

  return (
    <section>
      <h1 className='font-bold text-3xl font-serif max-w-[650px]'>
        {post.title}
      </h1>
      <div className='grid grid-cols-[auto_1fr_auto] items-center mt-4 mb-8 font-mono text-sm max-w-[650px]'>
        <div className='bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1 tracking-tighter'>
          {post.publishedAt}
        </div>
        <div className='h-[0.2em] bg-neutral-50 dark:bg-neutral-800 mx-2' />
      </div>
      <Component components={MDXComponents} />
    </section>
  )
}

export async function getStaticPaths() {
  return {
    paths: allBlogs.map((p) => ({ params: { slug: p.slug } })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = allBlogs.find((post) => post.slug === params?.slug)
  const author = allAuthors.find(
    (author) => author._id === `authors/${post?.author || 'karthik'}.mdx`
  )
  return { props: { post: { ...post, authorInfo: author || {} } } }
}
