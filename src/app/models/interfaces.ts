// Station / Train Models
export interface Station {
  id: number;
  name: string;
  stationNumber: number;
}

export interface Seat {
  seatId: string;
  number: string;
  price: number;
  isOccupied: boolean;
  vagonId: number;
}

export interface Vagon {
  id: number;
  trainId: number;
  number: number;
  trainNumber: number;
  name: string;
  seats: Seat[];
}

export interface Train {
  id: number;
  number: number;
  name: string;
  date: string;
  from: string;
  to: string;
  departure: string;
  arrive: string;
  departureId: number;
  vagons: Vagon[];
}

export interface Departure {
  id: number;
  source: string;
  destination: string;
  date: string;
  trains: Train[];
}

// Ticket Models
export interface PersonDto {
  seatId: string;
  name: string;
  surname: string;
  idNumber: string;
  status: string;
  payoutCompleted: boolean;
}

export interface RegisterTicketConfig {
  trainId: number;
  date: Date;
  email: string;
  phoneNumber: string;
  people: PersonDto[];
}

export interface Person {
  id: number;
  ticketId: string;
  seat: Seat;
  name: string;
  surname: string;
  idNumber: string;
  status: string;
  payoutCompleted: boolean;
}

export interface Ticket {
  id: string;
  phone: string;
  email: string;
  date: string;
  ticketPrice: number;
  trainID: number;
  confirmed: boolean;
  train: Train;
  persons: Person[];
}

// UI Models
export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export interface PassengerData {
  name: string;
  surname: string;
  idNumber: string;
  seatId: string;
  seatNumber: string;
}

export interface BookingSession {
  searchParams: SearchParams;
  selectedDeparture: Departure;
  selectedTrain: Train;
  email: string;
  phoneNumber: string;
  passengers: PassengerData[];
  totalPrice: number;
}
