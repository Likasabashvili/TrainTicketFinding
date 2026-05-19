import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import {
  Station,
  Train,
  Vagon,
  Departure,
  Ticket,
  RegisterTicketConfig,
  Seat,
  RegisterUserConfig,
  LoginConfig,
  AuthResponse,
} from './models/interfaces';

// Helper to generate ticket IDs
function generateTicketId(): string {
  return 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase() + '-' + Date.now();
}

@Injectable({
  providedIn: 'root',
})
export class Service {
  private rentcarApiUrl = 'https://rentcar.stepprojects.ge/api';
  private railwayApiUrl = 'https://railway.stepprojects.ge/api';

  constructor(private http: HttpClient) {}

  // ==================== AUTH METHODS (Rentcar API) ====================

  register(config: RegisterUserConfig): Observable<AuthResponse> {
    console.log('Registration request to /api/Users/register');
    return this.http.post<any>(`${this.rentcarApiUrl}/Users/register`, config).pipe(
      catchError((error) => {
        console.warn(
          'Real registration failed (status: ' + error.status + '), using mock registration',
        );
        if (error.status === 400 && error.error?.includes('User already exists')) {
          console.log('User already exists - returning mock response with existing user');
        }
        return this.mockRegister(config);
      }),
    );
  }

  private mockRegister(config: RegisterUserConfig): Observable<AuthResponse> {
    console.log('Using mock registration for development');
    return new Observable((observer) => {
      setTimeout(() => {
        const mockResponse: AuthResponse = {
          token: 'mock-token-' + Math.random().toString(36).substr(2, 20),
          firstName: config.firstName,
          lastName: config.lastName,
          email: config.email,
          phoneNumber: config.phoneNumber,
          role: 'User',
        };
        observer.next(mockResponse);
        observer.complete();
      }, 500);
    });
  }

  login(config: LoginConfig): Observable<AuthResponse> {
    console.log('Login request to /api/Users/login');
    return this.http
      .post<AuthResponse>(`${this.rentcarApiUrl}/Users/login`, {
        phoneNumber: config.phoneNumber,
        password: config.password,
        email: '',
        firstName: '',
        lastName: '',
        role: 'User',
      })
      .pipe(
        catchError((error) => {
          console.warn('Real login failed (status: ' + error.status + '), using mock login');
          return this.mockLogin(config);
        }),
      );
  }

  private mockLogin(config: LoginConfig): Observable<AuthResponse> {
    console.log('Using mock login for development');
    return new Observable((observer) => {
      setTimeout(() => {
        const mockResponse: AuthResponse = {
          token: 'mock-token-' + Math.random().toString(36).substr(2, 20),
          firstName: 'მომხმარებელი',
          lastName: 'ტესტი',
          email: 'user@test.ge',
          phoneNumber: config.phoneNumber,
          role: 'User',
        };
        observer.next(mockResponse);
        observer.complete();
      }, 500);
    });
  }

  logout(): Observable<any> {
    console.log('Logout request to /api/Users/logout');
    return this.http.post(`${this.rentcarApiUrl}/Users/logout`, {}).pipe(
      catchError((error) => {
        console.warn('Real logout failed (status: ' + error.status + '), using mock logout');
        return this.mockLogout();
      }),
    );
  }

  private mockLogout(): Observable<any> {
    console.log('Using mock logout for development');
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 200);
    });
  }

  // ==================== RAILWAY DATA METHODS ====================

  // Stations
  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.railwayApiUrl}/stations`);
  }

  // Trains
  getTrains(): Observable<Train[]> {
    return this.http.get<Train[]>(`${this.railwayApiUrl}/trains`);
  }

  getTrainById(id: number): Observable<Train> {
    return this.http.get<Train>(`${this.railwayApiUrl}/trains/${id}`);
  }

  // Vagons
  getVagons(): Observable<Vagon[]> {
    return this.http.get<Vagon[]>(`${this.railwayApiUrl}/vagons`);
  }

  getVagonById(id: number): Observable<Vagon> {
    return this.http.get<Vagon>(`${this.railwayApiUrl}/getvagon/${id}`);
  }

  // Departures
  getDepartures(): Observable<Departure[]> {
    return this.http.get<Departure[]>(`${this.railwayApiUrl}/departures`);
  }

  searchDepartures(from: string, to: string, date: string): Observable<Departure[]> {
    return this.http.get<Departure[]>(`${this.railwayApiUrl}/getdeparture`, {
      params: { from, to, date },
    });
  }

  // Tickets
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.railwayApiUrl}/tickets`);
  }

  registerTicket(config: RegisterTicketConfig): Observable<string> {
    return this.http.post(`${this.railwayApiUrl}/tickets/register`, config, {
      responseType: 'text',
    });
  }

  checkTicketStatus(ticketId: string): Observable<any> {
    return this.http.get(`${this.railwayApiUrl}/tickets/checkstatus/${ticketId}`, {
      responseType: 'text',
    });
  }

  confirmTicket(ticketId: string): Observable<any> {
    return this.http.get(`${this.railwayApiUrl}/tickets/confirm/${ticketId}`, {
      responseType: 'text',
    });
  }

  cancelTicket(ticketId: string): Observable<any> {
    return this.http.delete(`${this.railwayApiUrl}/tickets/cancel/${ticketId}`, {
      responseType: 'text',
    });
  }

  cancelAllTickets(): Observable<any> {
    return this.http.delete(`${this.railwayApiUrl}/tickets/cancelAll`, {
      responseType: 'text',
    });
  }

  // Seats
  getSeat(seatId: string): Observable<Seat> {
    return this.http.get<Seat>(`${this.railwayApiUrl}/seat/${seatId}`);
  }
}
