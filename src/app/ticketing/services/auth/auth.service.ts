import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
const BASIC_URL = 'http://localhost:8080/api/v1/auth';
export const AUTH_HEADER = 'Authorization';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registerCustomer(signupDTO: any): Observable<any> {
    return this.http.post(`${BASIC_URL}/signup`, signupDTO);
  }

  registerVendor(signupDTO: any): Observable<any> {
    return this.http.post(`${BASIC_URL}/vendor/signup`, signupDTO);
  }

  login(username: string, password: string) {
    return this.http
      .post(`${BASIC_URL}/authenticate`, { username, password }, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<any>) => {
          localStorage.setItem('user', JSON.stringify(res.body));
          const tokenLength = res.headers.get(AUTH_HEADER)?.length;
          const bearerToken = res.headers.get(AUTH_HEADER)?.substring(7, tokenLength);
          if (bearerToken) {
            localStorage.setItem('token', bearerToken);
          }
          return res.body;
        })
      );
  }
}
