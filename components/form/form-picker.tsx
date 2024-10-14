'use client';

import DOMPurify from 'dompurify';
import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Check, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { defaultImages } from '@/constants/images';
import { FormErrors } from './form-errors';

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();

  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/unsplash');
        if (response.ok) {
          const newImages = await response.json();
          setImages(newImages);
        } else {
          console.error('Failed to fetch images');
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-6'>
        <Loader2 className='h-6 w-6 animate-spin text-sky-700' />
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='mb-2 grid grid-cols-3 gap-2'>
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              'group relative aspect-video cursor-pointer bg-muted transition hover:opacity-75',
              pending && 'cursor-auto opacity-50 hover:opacity-50'
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
          >
            <input
              type='radio'
              id={id}
              name={id}
              className='hidden'
              checked={selectedImageId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}|${image.links.download_location}`}
            />
            <Image
              src={image.urls.thumb}
              alt='Unsplash image'
              className='rounded-sm object-cover'
              fill
            />
            {selectedImageId === image.id && (
              <div className='absolute inset-y-0 flex h-full w-full items-center justify-center bg-black/30'>
                <Check className='h-4 w-4 text-white' />
              </div>
            )}
            <Link
              href={
                DOMPurify.sanitize(image.user.links.html) +
                '?utm_source=Tasko&utm_medium=referral'
              }
              target='_blank'
              className='absolute bottom-0 w-full truncate bg-black/50 p-1 text-[10px] text-white opacity-0 hover:underline group-hover:opacity-100'
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id='image' errors={errors} />
    </div>
  );
};
