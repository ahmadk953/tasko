import { allBlogPosts } from 'content-collections';
import Image from 'next/image';
import Link from 'next/link';

const BlogPage = () => {
  return (
    <div className='min-h-screen px-4 py-12 sm:px-6 md:px-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-16 flex flex-col items-center'>
          <h1 className='text-center text-4xl font-bold sm:text-5xl md:text-6xl text-neutral-900 dark:text-neutral-50'>
            Blog
          </h1>
          <p className='mt-4 text-center text-lg text-neutral-600 dark:text-neutral-400'>
            Stay updated with the latest news and insights about Tasko
          </p>
        </div>

        {/* Blog Grid */}
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {allBlogPosts.map((post) => (
            <Link
              href={`blog/posts/${post._meta.path}`}
              key={post._meta.path}
              className='group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900'
            >
              <div className='relative overflow-hidden bg-neutral-100 dark:bg-neutral-800'>
                <Image
                  src={post.coverImage}
                  height={200}
                  width={400}
                  alt={post.title}
                  className='aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
              </div>
              <div className='flex flex-1 flex-col justify-between px-6 py-5'>
                <div className='space-y-2'>
                  <h2 className='text-lg font-semibold text-neutral-900 dark:text-neutral-50 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                    {post.title}
                  </h2>
                  <p className='text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3'>
                    {post.summary}
                  </p>
                </div>
                <div className='mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform'>
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {allBlogPosts.length === 0 && (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <p className='text-lg text-neutral-600 dark:text-neutral-400'>
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
