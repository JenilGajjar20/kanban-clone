import { Swimlane } from './swimlane.model';
import { User } from './user.model';

export interface Card {
  id: number;
  title: string;
  content: string;
  order: number;
  assigne?: User;
  swimlaneId: number;
  swimlane: Swimlane;
}
