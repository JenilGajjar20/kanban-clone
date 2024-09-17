import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Board, CreateBoard } from '../models/board.model';
import { Observable } from 'rxjs';

export interface ReorderSwimlaneDto {
  boardId: number;
  items: ReorderSwimlaneItemDto[];
}
export interface ReorderSwimlaneItemDto {
  id: number;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  http = inject(HttpClient);

  createBoard(createBoard: CreateBoard): Observable<Board> {
    return this.http.post<Board>('/api/board', createBoard);
  }

  updateSwimlaneOrder(reorder: ReorderSwimlaneDto): Observable<void> {
    return this.http.put<void>('/api/swimlane/update-order', reorder);
  }

  updateBoard(id: number, createBoard: CreateBoard): Observable<Board> {
    return this.http.patch<Board>(`/api/board/${id}`, createBoard);
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`/api/board/${id}`);
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>('/api/board');
  }

  getBoardById(id: number): Observable<Board> {
    return this.http.get<Board>(`/api/board/${id}`);
  }
}
