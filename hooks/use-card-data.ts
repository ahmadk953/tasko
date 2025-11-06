import { useQuery } from '@tanstack/react-query';
import { AuditLog } from '@prisma/client';

import { CardWithList } from '@/types';
import { fetcher } from '@/lib/fetcher';

interface UseCardDataResult {
  cardData: CardWithList | undefined;
  auditLogs: AuditLog[] | undefined;
  isLoadingCard: boolean;
  isLoadingLogs: boolean;
  isError: boolean;
  cardError: Error | null;
  logsError: Error | null;
}

export const useCardData = (id: string | null | undefined): UseCardDataResult => {
  const {
    data: cardData,
    isLoading: isLoadingCard,
    error: cardError,
    isError: isCardError,
  } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: !!id,
    retry: 1,
  });

  const {
    data: auditLogs,
    isLoading: isLoadingLogs,
    error: logsError,
    isError: isLogsError,
  } = useQuery<AuditLog[]>({
    queryKey: ['card-logs', id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
    enabled: !!id,
    retry: 1,
  });

  return {
    cardData,
    auditLogs,
    isLoadingCard,
    isLoadingLogs,
    isError: isCardError || isLogsError,
    cardError: (cardError as Error) || null,
    logsError: (logsError as Error) || null,
  };
};
