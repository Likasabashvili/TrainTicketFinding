// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { AuthResponse } from './models/interfaces';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
//   public currentUser$ = this.currentUserSubject.asObservable();

//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getToken());
//   public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

//   constructor() {}

//   private getUserFromStorage(): AuthResponse | null {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   getCurrentUser(): AuthResponse | null {
//     return this.currentUserSubject.value;
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }

//   setUser(user: AuthResponse): void {
//     localStorage.setItem('token', user.token);
//     localStorage.setItem('user', JSON.stringify(user));
//     this.currentUserSubject.next(user);
//     this.isAuthenticatedSubject.next(true);
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     this.currentUserSubject.next(null);
//     this.isAuthenticatedSubject.next(false);
//   }

//   getUserDisplayName(): string {
//     const user = this.getCurrentUser();
//     return user ? `${user.firstName} ${user.lastName}` : '';
//   }
// }
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AuthResponse } from './models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());

  currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getToken());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: AuthResponse): void {
    if (!user?.token) {
      this.logout();
      return;
    }

    localStorage.setItem('token', user.token);

    localStorage.setItem('user', JSON.stringify(user));

    this.currentUserSubject.next(user);

    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();

    this.currentUserSubject.next(null);

    this.isAuthenticatedSubject.next(false);
  }

  private getStoredUser(): AuthResponse | null {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      return null;
    }
  }
}
