import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const BASIC_URL = 'http://localhost:8080/api/v1/auth';

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
}
