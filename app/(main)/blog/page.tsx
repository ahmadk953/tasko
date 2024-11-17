import { allBlogPosts } from 'content-collections';
import Image from 'next/image';
import Link from 'next/link';

const BlogPage = () => {
  return (
    <div className='ml-4 mr-4 flex flex-col items-center space-y-10'>
      <h1 className='text-4xl font-semibold text-neutral-700'>Blog</h1>
      <div className='grid grid-cols-2 gap-20 sm:grid-cols-3 lg:grid-cols-4'>
        {allBlogPosts.map((post) => (
          <div className='space-y-4 text-center' key={post._meta.path}>
            <Link href={`blog/posts/${post._meta.path}`}>
              <Image
                src={post.coverImage}
                height={100}
                width={300}
                alt='post cover image'
                className='aspect-video w-full rounded-md object-cover'
              />
              <h2 className='text-lg font-semibold text-neutral-700'>
                {post.title}
              </h2>
              <p className='text-sm text-neutral-500'>{post.summary}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
