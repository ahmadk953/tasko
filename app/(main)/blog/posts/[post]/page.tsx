import { MDXContent } from '@content-collections/mdx/react';
import { allBlogPosts } from 'content-collections';
import Image from 'next/image';

interface PostPageProps {
  params: Promise<{ post: string }>;
}

const PostPage = async (props: PostPageProps) => {
  const params = await props.params;
  const post = allBlogPosts.find((post) => post._meta.path === params.post);

  if (!post) {
    return (
      <h1 className='text-6xl font-semibold text-neutral-900'>
        Post not found
      </h1>
    );
  }

  return (
    <div className='mx-auto ~/lg:~p-4/8'>
      <Image
        className='mb-2 w-full rounded-md object-cover ~/md:~h-64/[31rem]'
        src={post.coverImage}
        width={1200}
        height={600}
        alt='post cover image'
      />
      <h1 className='mb-12 text-center text-6xl font-bold text-neutral-900'>
        {post.title}
      </h1>{' '}
      <div className='container prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-p:text-xl dark:prose-headings:text-white'>
        <MDXContent code={post.mdx} />
      </div>
    </div>
  );
};

export default PostPage;
