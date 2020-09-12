import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public fluenceServerURL = '';
  public currentUser: string;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post(`${this.fluenceServerURL}/users`, { email, password },
    { observe: 'response' }).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body._id, res.body.email, res.headers.get('fluence-access-token'), res.headers.get('fluence-refresh-token'));
        this.currentUser = res.body.email;
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post(`${this.fluenceServerURL}/users/login`, { email, password },
      { observe: 'response' }).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body._id, res.body.email, res.headers.get('fluence-access-token'), res.headers.get('fluence-refresh-token'));
        this.currentUser = res.body.email;
      })
    );
  }

  logout() {
    this.removeSession();

    this.router.navigate(['/login']);
  }

  private setSession(userId: string, email: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('fluence-user-email', email);
    localStorage.setItem('fluence-access-token', accessToken);
    localStorage.setItem('fluence-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('fluence-user-email');
    localStorage.removeItem('fluence-access-token');
    localStorage.removeItem('fluence-refresh-token');
  }

  getAccessToken() {
    return localStorage.getItem('fluence-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('fluence-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  getUserEmail() {
    return localStorage.getItem('fluence-user-email');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('fluence-access-token', accessToken)
  }

  getNewAccessToken() {
    return this.http.get(`${this.fluenceServerURL}/users/me/access-token`, {
      headers: {
        'fluence-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('fluence-access-token'));
      })
    );
  }
}
