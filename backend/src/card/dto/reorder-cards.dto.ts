import { Card } from '../entities/card.entity';

export class ReorderCardDto {
  boardId: number;
  cards: Card[];
}
