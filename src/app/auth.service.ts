import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string = '';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const url = environment.serviceUrl + '/usermodule/login/';
    const body = { username, password };
    return this.http.post(url, body);
  }

  setAccessToken(token: string) {
    localStorage.setItem('token', token);
  }

  getAccessToken(): string {
    return localStorage.getItem('token')
      ? JSON.stringify(localStorage.getItem('token'))
      : '';
  }
}
