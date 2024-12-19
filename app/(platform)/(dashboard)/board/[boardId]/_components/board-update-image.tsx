import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateBoard } from '@/actions/update-board';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { images } from '@/constants/images';

const formSchema = z.object({
  image: z.string().min(1, {
    message: 'Image is required',
  }),
});

interface BoardUpdateImageProps {
  boardId: string;
  image: string;
}

export function BoardUpdateImage({ boardId, image }: BoardUpdateImageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await updateBoard({
      id: boardId,
      image: values.image,
    });

    setIsLoading(false);

    if (response?.error) {
      return toast({
        title: 'Something went wrong.',
        description: response.error,
        variant: 'destructive',
      });
    }

    toast({
      description: 'Board image updated.',
    });

    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} />
                  <img
                    src={field.value}
                    alt="Board Image"
                    className="mt-4 w-full h-auto rounded-lg"
                    loading="lazy"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <span className="mr-2 h-4 w-4 animate-spin">🔄</span>
          )}
          Update Image
        </Button>
      </form>
    </Form>
  );
}
