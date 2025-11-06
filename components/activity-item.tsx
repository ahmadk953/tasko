import { format } from 'date-fns';
import { AuditLog } from '@prisma/client';

import { generateLogMessage } from '@/lib/generate-log-message';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ActivityItemProps {
  data: AuditLog;
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
  // Get initials from user name for fallback
  const initials = data.userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <li className='group border-border bg-card/50 hover:bg-card rounded-lg border p-3 transition-all hover:shadow-sm'>
      <div className='flex items-start gap-x-3'>
        <Avatar className='mt-0.5 h-8 w-8 flex-shrink-0'>
          <AvatarImage src={data.userImage} />
          <AvatarFallback className='text-xs font-semibold'>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className='flex min-w-0 flex-1 flex-col space-y-1'>
          <div className='flex flex-col gap-y-0.5'>
            <p className='text-sm leading-relaxed'>
              <span className='text-foreground font-semibold lowercase'>
                {data.userName}
              </span>{' '}
              <span className='text-muted-foreground'>
                {generateLogMessage(data)}
              </span>
            </p>
          </div>
          <p className='text-muted-foreground text-xs'>
            {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>
    </li>
  );
};
