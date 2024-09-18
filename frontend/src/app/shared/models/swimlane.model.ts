import { Board } from './board.model';
import { Card } from './card.model';

export interface Swimlane {
  id: number;
  name: string;
  order: number;
  boardId: number;
  board: Board;
  cards?: Card[];
}

export interface CreateSwimlane {
  name: string;
  order: number;
  boardId: number;
}

export interface UpdateSwimlane {
  id: number;
  name: string;
}
