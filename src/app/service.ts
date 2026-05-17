import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class Service {
  private apiUrl = 'https://railway.stepprojects.ge/api';

  constructor(private http: HttpClient) {}

  // Auth
  register(config: RegisterUserConfig): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/register`, config);
  }

  login(config: LoginConfig): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/login`, config);
  }

  // Stations
  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.apiUrl}/stations`);
  }

  // Trains
  getTrains(): Observable<Train[]> {
    return this.http.get<Train[]>(`${this.apiUrl}/trains`);
  }

  getTrainById(id: number): Observable<Train> {
    return this.http.get<Train>(`${this.apiUrl}/trains/${id}`);
  }

  // Vagons
  getVagons(): Observable<Vagon[]> {
    return this.http.get<Vagon[]>(`${this.apiUrl}/vagons`);
  }

  getVagonById(id: number): Observable<Vagon> {
    return this.http.get<Vagon>(`${this.apiUrl}/getvagon/${id}`);
  }

  // Departures
  getDepartures(): Observable<Departure[]> {
    return this.http.get<Departure[]>(`${this.apiUrl}/departures`);
  }

  searchDepartures(from: string, to: string, date: string): Observable<Departure[]> {
    return this.http.get<Departure[]>(`${this.apiUrl}/getdeparture`, {
      params: { from, to, date },
    });
  }

  // Tickets
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`);
  }

  registerTicket(config: RegisterTicketConfig): Observable<string> {
    return this.http.post(`${this.apiUrl}/tickets/register`, config, {
      responseType: 'text',
    });
  }

  // checkTicketStatus(ticketId: string): Observable<Ticket> {
  //   return this.http.get<Ticket>(`${this.apiUrl}/tickets/checkstatus/${ticketId}`);
  // }

  // confirmTicket(ticketId: string): Observable<Ticket> {
  //   return this.http.get<Ticket>(`${this.apiUrl}/tickets/confirm/${ticketId}`);
  // }

  // cancelTicket(ticketId: string): Observable<Ticket> {
  //   return this.http.delete<Ticket>(`${this.apiUrl}/tickets/cancel/${ticketId}`);
  // }

  // cancelAllTickets(): Observable<Seat> {
  //   return this.http.delete<Seat>(`${this.apiUrl}/tickets/cancelAll`);
  // }

  // // Seats
  // getSeat(seatId: string): Observable<Seat> {
  //   return this.http.get<Seat>(`${this.apiUrl}/seat/${seatId}`);
  // }
  checkTicketStatus(ticketId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tickets/checkstatus/${ticketId}`, {
      responseType: 'text',
    });
  }

  confirmTicket(ticketId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tickets/confirm/${ticketId}`, {
      responseType: 'text',
    });
  }

  cancelTicket(ticketId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tickets/cancel/${ticketId}`, {
      responseType: 'text',
    });
  }
}
