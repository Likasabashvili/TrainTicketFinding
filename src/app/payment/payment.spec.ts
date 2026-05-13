import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PaymentComponent } from './payment';
import { Service } from '../service';
import { SearchParams, Ticket, Train } from '../models/interfaces';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let service: {
    registerTicket: ReturnType<typeof vi.fn>;
    confirmTicket: ReturnType<typeof vi.fn>;
  };
  let router: { getCurrentNavigation: ReturnType<typeof vi.fn>; navigate: ReturnType<typeof vi.fn> };
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const searchParams: SearchParams = {
    from: 'თბილისი',
    to: 'ბათუმი',
    date: '2026-05-13',
    passengers: 1,
  };

  const selectedTrain: Train = {
    id: 7,
    number: 812,
    name: 'თბილისი-ბათუმი',
    date: 'ოთხშაბათი',
    from: 'თბილისი',
    to: 'ბათუმი',
    departure: '00:35',
    arrive: '05:47',
    departureId: 3,
    vagons: [],
  };

  const ticket: Ticket = {
    id: 'T-1',
    phone: '+995555000000',
    email: 'test@example.com',
    date: '2026-05-13',
    ticketPrice: 35,
    trainID: 7,
    confirmed: true,
    train: selectedTrain,
    persons: [],
  };

  beforeEach(async () => {
    service = {
      registerTicket: vi.fn().mockReturnValue(of(ticket)),
      confirmTicket: vi.fn().mockReturnValue(of(ticket)),
    };
    router = {
      getCurrentNavigation: vi.fn().mockReturnValue({
        extras: {
          state: {
            searchParams,
            selectedTrain,
            selectedDeparture: null,
            email: 'test@example.com',
            phoneNumber: '+995555000000',
            passengers: [
              {
                name: 'ანა',
                surname: 'აბაშიძე',
                idNumber: '01001001001',
                seatId: 'seat-1',
                seatNumber: '1A',
              },
            ],
            totalPrice: 35,
          },
        },
      }),
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PaymentComponent],
      providers: [
        { provide: Service, useValue: service },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
  });

  it('should load booking state from navigation', () => {
    expect(component.selectedTrain).toEqual(selectedTrain);
    expect(component.email).toBe('test@example.com');
    expect(component.totalPrice).toBe(35);
  });

  it('should validate card fields', () => {
    expect(component.isPaymentFormValid()).toBe(false);

    component.cardName = 'Ana Abashidze';
    component.cardNumber = '1234567812345678';
    component.expiryDate = '12/30';
    component.cvv = '123';

    expect(component.isPaymentFormValid()).toBe(true);
  });

  it('should register and confirm a ticket on successful payment', () => {
    component.cardName = 'Ana Abashidze';
    component.cardNumber = '1234567812345678';
    component.expiryDate = '12/30';
    component.cvv = '123';

    component.processPayment();

    expect(service.registerTicket).toHaveBeenCalledWith({
      trainId: 7,
      date: new Date('2026-05-13'),
      email: 'test@example.com',
      phoneNumber: '+995555000000',
      people: [
        {
          seatId: 'seat-1',
          name: 'ანა',
          surname: 'აბაშიძე',
          idNumber: '01001001001',
          status: 'confirmed',
          payoutCompleted: true,
        },
      ],
    });
    expect(service.confirmTicket).toHaveBeenCalledWith('T-1');
    expect(component.ticket).toEqual(ticket);
    expect(component.paymentSuccess).toBe(true);
    expect(component.isProcessing).toBe(false);
  });

  it('should show an error for invalid payment fields', () => {
    component.processPayment();

    expect(service.registerTicket).not.toHaveBeenCalled();
    expect(component.errorMessage).toContain('საკრედიტო ბარათის');
  });

  it('should show an error when ticket registration fails', () => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    service.registerTicket.mockReturnValue(throwError(() => new Error('payment failed')));
    component.cardName = 'Ana Abashidze';
    component.cardNumber = '1234567812345678';
    component.expiryDate = '12/30';
    component.cvv = '123';

    component.processPayment();

    expect(component.errorMessage).toContain('გადახდის დროს შეცდომა');
    expect(component.isProcessing).toBe(false);
    expect(component.paymentSuccess).toBe(false);
  });

  it('should navigate back and home', () => {
    component.goBack();
    component.goHome();

    expect(router.navigate).toHaveBeenCalledWith(['/passenger-info']);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
