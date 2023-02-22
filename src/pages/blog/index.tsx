import { allBlogs, Blog } from 'contentlayer/generated'
import Link from 'next/link'

export default function BlogPage({ posts }: { posts: Blog[] }) {
  return (
    <section>
      <h1 className='font-bold text-3xl font-serif mb-5'>Blog</h1>
      {posts
        .map((post) => (
          <Link
            key={post.slug}
            className='flex flex-col space-y-1 mb-4'
            href={`/blog/${post.slug}`}
          >
            <div className='w-full flex flex-col'>
              <p>{post.title}</p>
            </div>
          </Link>
        ))}
    </section>
  )
}


export function getStaticProps() {
  const posts = allBlogs.sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
  )

  return { props: { posts } }
}
