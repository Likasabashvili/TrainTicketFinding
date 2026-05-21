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
  RegisterRequest,
  LoginRequest,
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
  private apiUrl = 'https://rentcar.stepprojects.ge/api';


  register(data: RegisterRequest): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/register`,
      data
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/users/login`,
      data
    );
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
