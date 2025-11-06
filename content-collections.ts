import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { z } from 'zod';

const posts = defineCollection({
  name: 'BlogPosts',
  directory: 'app/(main)/blog/posts',
  include: '*.mdx',
  schema: z.object({
    title: z
      .string()
      .min(3, { message: 'Title must be at least 3 characters' })
      .max(30, { message: 'Title must be at most 30 characters' }),
    summary: z
      .string()
      .min(10, { message: 'Summary must be at least 10 characters' })
      .max(50, { message: 'Summary must be at most 50 characters' }),
    coverImage: z.string(),
    datePublished: z.string(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
