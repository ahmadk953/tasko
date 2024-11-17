import type { NextConfig } from 'next';

import { withContentCollections } from '@content-collections/next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

const withMDX = createMDX({});

export default withContentCollections(withMDX(nextConfig));
