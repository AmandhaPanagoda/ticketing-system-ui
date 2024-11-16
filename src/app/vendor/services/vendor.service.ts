import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserStorageService } from '../../ticketing/services/storage/user-storage.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private baseUrl = 'http://localhost:8080/api/v2/vendor';

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

  addTickets(ticketCount: number): Observable<any> {
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
        }),
        catchError(error => {
          if (error.error instanceof ErrorEvent) {
            return throwError(() => new Error('Network error occurred'));
          } else {
            const errorMessage = error.error || error.message || 'An error occurred';
            return throwError(() => ({ message: errorMessage }));
          }
        })
      );
  }
}
