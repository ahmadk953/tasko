import { Card } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LazyLoad } from 'react-lazyload';

import { updateCard } from '@/actions/update-card';
import { deleteCard } from '@/actions/delete-card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

interface ListItemProps {
  card: Card;
}

export function ListItem({ card }: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: card.title,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await updateCard({
      id: card.id,
      title: values.title,
      boardId: card.boardId,
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
      description: 'Card updated.',
    });

    setIsEditing(false);
    router.refresh();
  }

  async function onDelete() {
    setIsLoading(true);

    const response = await deleteCard({
      id: card.id,
      boardId: card.boardId,
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
      description: 'Card deleted.',
    });

    router.refresh();
  }

  return (
    <LazyLoad height={200} offset={100}>
      <div className="p-4 border rounded-lg shadow-sm">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <span className="mr-2 h-4 w-4 animate-spin">🔄</span>}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="flex justify-between items-center">
            <span>{card.title}</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete} disabled={isLoading}>
                {isLoading && <span className="mr-2 h-4 w-4 animate-spin">🔄</span>}
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </LazyLoad>
  );
}
