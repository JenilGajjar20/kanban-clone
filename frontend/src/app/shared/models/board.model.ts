import { Swimlane } from './swimlane.model';
import { User } from './user.model';

export interface Board {
  id: number;
  name: string;
  users?: User[];
  swimlanes?: Swimlane[];
}

export interface CreateBoard {
  name: string;
}
