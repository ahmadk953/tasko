import { MDXContent } from '@content-collections/mdx/react';
import { allBlogPosts } from 'content-collections';
import Image from 'next/image';
import Link from 'next/link';

interface PostPageProps {
  params: Promise<{ post: string }>;
}

const PostPage = async (props: PostPageProps) => {
  const params = await props.params;
  const post = allBlogPosts.find((post) => post._meta.path === params.post);

  if (!post) {
    return (
      <div className='flex min-h-screen items-center justify-center px-4'>
        <h1 className='text-center text-4xl font-bold text-neutral-900 sm:text-5xl dark:text-neutral-50'>
          Post not found
        </h1>
      </div>
    );
  }

  return (
    <article className='min-h-screen'>
      {/* Hero Image */}
      <div className='relative h-64 w-full overflow-hidden bg-neutral-100 sm:h-80 md:h-96 lg:h-[500px] dark:bg-neutral-900'>
        <Image
          src={post.coverImage}
          width={1200}
          height={600}
          alt={post.title}
          className='h-full w-full object-cover'
          priority
        />
      </div>

      {/* Article Content */}
      <div className='mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8'>
        {/* Title */}
        <header className='mb-8 md:mb-12'>
          <h1 className='text-3xl leading-tight font-bold text-neutral-900 sm:text-4xl md:text-5xl dark:text-neutral-50'>
            {post.title}
          </h1>
          <div className='mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400'>
            {(() => {
              const published = new Date(post.datePublished);
              if (!isFinite(published.getTime())) {
                return <time>Published on {post.datePublished}</time>;
              }
              return (
                <time dateTime={published.toISOString()}>
                  Published on{' '}
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'long',
                  }).format(published)}
                </time>
              );
            })()}
          </div>
        </header>

        {/* Prose Content */}
        <div className='prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-neutral-900 dark:prose-headings:text-neutral-50 prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline hover:prose-a:no-underline prose-strong:text-neutral-900 dark:prose-strong:text-neutral-50 prose-strong:font-semibold prose-code:text-sm prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-neutral-800 dark:prose-code:text-neutral-200 prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-800 prose-pre:overflow-x-auto prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:text-neutral-700 dark:prose-blockquote:text-neutral-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:text-neutral-700 dark:prose-ul:text-neutral-300 prose-ol:text-neutral-700 dark:prose-ol:text-neutral-300 prose-li:mb-2 max-w-none'>
          <MDXContent code={post.mdx} />
        </div>

        {/* Footer Divider */}
        <hr className='my-12 border-neutral-200 dark:border-neutral-800' />

        {/* Back Link */}
        <Link
          href='/blog'
          className='inline-flex items-center gap-2 font-medium text-blue-600 transition-all hover:gap-3 dark:text-blue-400'
        >
          ← Back to blog
        </Link>
      </div>
    </article>
  );
};

export default PostPage;
