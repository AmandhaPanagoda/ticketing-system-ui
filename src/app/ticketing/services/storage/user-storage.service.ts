import { Injectable } from '@angular/core';

const USER = 's_user';
const TOKEN = 's_token';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  constructor() {}

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.setItem(TOKEN, token);
  }

  static getToken(): string | null {
    return sessionStorage.getItem(TOKEN);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER);
    window.sessionStorage.setItem(USER, JSON.stringify(user));
  }

  static getUser(): any {
    const userStr = sessionStorage.getItem(USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  static getUserId(): string {
    const user = this.getUser();
    if (user) {
      return user.userId;
    }
    return '';
  }

  static getUserRole(): string {
    const user = this.getUser();
    if (user) {
      return user.role;
    }
    return '';
  }

  static isCustomerLoggedIn(): boolean {
    if (!this.getToken()) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'CUSTOMER';
  }

  static isVendorLoggedIn(): boolean {
    if (!this.getToken()) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'VENDOR';
  }

  static isAdminLoggedIn(): boolean {
    if (!this.getToken()) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'ADMIN';
  }

  static signOut(): void {
    window.sessionStorage.removeItem(USER);
    window.sessionStorage.removeItem(TOKEN);
  }
}
