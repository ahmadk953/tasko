import { unsplash } from '@/lib/unsplash';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await unsplash.photos.getRandom({
      collectionIds: ['317099'],
      count: 9,
    });

    if (result?.response) {
      const newImages = result.response as Array<Record<string, any>>;
      return new NextResponse(JSON.stringify(newImages), { status: 200 });
    } else {
      return new NextResponse('Failed to get images', { status: 500 });
    }
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
