import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserStorageService } from '../../ticketing/services/storage/user-storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/api/v2/customer';

  constructor(private http: HttpClient) {}

  // used for initial pool status
  getPoolStatus(): Observable<{ currentTicketCount: number }> {
    const token = UserStorageService.getToken();
    const userId = UserStorageService.getUserId();

    if (!token || !userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Userid: userId,
    });

    return this.http.get<{ currentTicketCount: number }>(`${this.baseUrl}/pool/status`, {
      headers,
    });
  }

  buyTickets(ticketCount: number): Observable<any> {
    const token = UserStorageService.getToken();
    const userId = UserStorageService.getUserId();

    if (!token || !userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Userid: userId,
    });

    const url = `${this.baseUrl}/tickets/${ticketCount}`;

    return this.http
      .post(url, null, {
        headers: headers,
        responseType: 'text',
        observe: 'response',
      })
      .pipe(
        map(response => {
          if (response.status === 202 || response.status === 200) {
            return response.body;
          }
          throw new Error('Unexpected response');
        })
      );
  }

  getTicketSummaries(): Observable<any[]> {
    const token = UserStorageService.getToken();
    const userId = UserStorageService.getUserId();

    if (!token || !userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Userid: userId,
    });

    return this.http.get<any[]>(`${this.baseUrl}/tickets`, { headers });
  }
}
