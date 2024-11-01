import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserStorageService } from '../../ticketing/services/storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  constructor(private http: HttpClient) {}

  addTicket(ticketDTO: FormData): Observable<any> {
    const userId = UserStorageService.getUserId();
    const token = UserStorageService.getToken();

    if (!userId || !token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log('Request Headers:', headers);
    console.log('UserId:', userId);
    console.log('FormData:', ticketDTO.get('title'));

    return this.http.post(`${BASIC_URL}vendor/ticket/${userId}`, ticketDTO, { headers }).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }
}
