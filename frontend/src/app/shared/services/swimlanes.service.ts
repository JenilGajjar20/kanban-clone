import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateSwimlane, Swimlane } from '../models/swimlane.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwimlanesService {
  http = inject(HttpClient);

  createSwimlane(createSwimlane: CreateSwimlane): Observable<Swimlane> {
    return this.http.post<Swimlane>('/api/swimlane', createSwimlane);
  }

  deleteSwimlane(swimlaneId: number): Observable<void> {
    return this.http.delete<void>(`/api/swimlane/${swimlaneId}`);
  }
}
