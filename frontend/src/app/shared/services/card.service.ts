import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  http = inject(HttpClient);

  createCard(createCard: Partial<Card>): Observable<Card> {
    return this.http.post<Card>('/api/card', createCard);
  }

  updateCardOrdersAndSwimlanes(
    boardId: number,
    cards: Card[]
  ): Observable<Card[]> {
    return this.http.put<Card[]>('/api/card/update-order', { boardId, cards });
  }

  updateCard(id: number, createCard: Partial<Card>): Observable<Card> {
    return this.http.patch<Card>(`/api/card/${id}`, createCard);
  }
}
