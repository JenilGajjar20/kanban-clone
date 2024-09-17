import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login, Register, Response } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  login(login: Login): Observable<Response> {
    return this.http.post<Response>('/api/auth/login', login);
  }

  register(register: Register): Observable<Response> {
    return this.http.post<Response>('/api/auth/register', register);
  }
}
