import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserStorageService } from '../services/storage/user-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = UserStorageService.getToken();
    const role = UserStorageService.getUserRole();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Add role-based route protection
    const currentUrl = this.router.url;
    if (currentUrl.includes('/vendor') && role !== 'VENDOR') {
      this.router.navigate(['/login']);
      return false;
    }
    if (currentUrl.includes('/admin') && role !== 'ADMIN') {
      this.router.navigate(['/login']);
      return false;
    }
    if (currentUrl.includes('/customer') && role !== 'CUSTOMER') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
