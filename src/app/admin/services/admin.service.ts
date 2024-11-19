import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SystemConfiguration } from '../models/system-configuration.model';
import { UserStorageService } from '../../ticketing/services/storage/user-storage.service';
import { User } from '../models/user.model';

interface UpdateResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/v1/admin';

  constructor(private http: HttpClient) {}

  getSystemConfiguration(): Observable<SystemConfiguration> {
    const userId = UserStorageService.getUserId();
    const token = UserStorageService.getToken();

    if (!userId || !token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      userId: userId.toString(),
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<SystemConfiguration>(`${this.baseUrl}/system-configuration`, { headers });
  }

  updateSystemConfiguration(config: SystemConfiguration): Observable<UpdateResponse> {
    const token = UserStorageService.getToken();
    const userId = UserStorageService.getUserId();

    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      userId: userId,
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<UpdateResponse>(`${this.baseUrl}/system-configuration`, config, {
      headers,
    });
  }

  getSystemStatus(): Observable<{ running: boolean }> {
    const token = UserStorageService.getToken();

    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{ running: boolean }>(`${this.baseUrl}/system/status`, { headers });
  }

  updateSystemStatus(start: boolean): Observable<string> {
    const token = UserStorageService.getToken();

    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.baseUrl}/system`, start, {
      headers,
      responseType: 'text',
    });
  }

  getPoolStatus() {
    const token = UserStorageService.getToken();
    const userId = UserStorageService.getUserId();

    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Userid: userId.toString(),
    });

    return this.http.get<any>(`${this.baseUrl}/pool/status`, { headers });
  }

  getAllUsers(): Observable<User[]> {
    const token = UserStorageService.getToken();

    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User[]>(`${this.baseUrl}/users`, { headers });
  }

  deleteUser(userId: number): Observable<any> {
    const token = UserStorageService.getToken();

    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`${this.baseUrl}/users/${userId}`, {
      headers,
      responseType: 'text', // Specify that we expect a text response
    });
  }
}
