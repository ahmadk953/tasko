import { Card, List } from '@/generated/prisma/client';

export type ListWithCards = List & {
  cards: Card[];
};

export type CardWithList = Card & {
  list: List;
};
