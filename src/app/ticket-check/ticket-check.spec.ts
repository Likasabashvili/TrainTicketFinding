import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { TicketCheckComponent } from './ticket-check';
import { Service } from '../service';
import { Ticket } from '../models/interfaces';

describe('TicketCheckComponent', () => {
  let component: TicketCheckComponent;
  let fixture: ComponentFixture<TicketCheckComponent>;
  let service: {
    checkTicketStatus: ReturnType<typeof vi.fn>;
    cancelTicket: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const ticket: Ticket = {
    id: 'T-1',
    phone: '+995555000000',
    email: 'test@example.com',
    date: '2026-05-13',
    ticketPrice: 35,
    trainID: 7,
    confirmed: true,
    train: {
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
    },
    persons: [],
  };

  beforeEach(async () => {
    service = {
      checkTicketStatus: vi.fn().mockReturnValue(of(ticket)),
      cancelTicket: vi.fn().mockReturnValue(of({ ...ticket, confirmed: false })),
    };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TicketCheckComponent],
      providers: [
        { provide: Service, useValue: service },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
    vi.unstubAllGlobals();
  });

  it('should require a ticket id before checking', () => {
    component.checkTicket();

    expect(service.checkTicketStatus).not.toHaveBeenCalled();
    expect(component.errorMessage).toContain('ბილეთის ID');
  });

  it('should load ticket details', () => {
    component.ticketId = 'T-1';

    component.checkTicket();

    expect(service.checkTicketStatus).toHaveBeenCalledWith('T-1');
    expect(component.ticket).toEqual(ticket);
    expect(component.isLoading).toBe(false);
  });

  it('should show an error when ticket lookup fails', () => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    service.checkTicketStatus.mockReturnValue(throwError(() => new Error('not found')));
    component.ticketId = 'missing';

    component.checkTicket();

    expect(component.errorMessage).toContain('ბილეთი არ მოიძებნა');
    expect(component.isLoading).toBe(false);
  });

  it('should cancel a ticket after confirmation', () => {
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
    component.ticket = ticket;

    component.cancelTicket();

    expect(service.cancelTicket).toHaveBeenCalledWith('T-1');
    expect(component.ticket?.confirmed).toBe(false);
    expect(component.successMessage).toContain('წარმატებით');
  });

  it('should not cancel when confirmation is rejected', () => {
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(false));
    component.ticket = ticket;

    component.cancelTicket();

    expect(service.cancelTicket).not.toHaveBeenCalled();
  });

  it('should reset search state and navigate home', () => {
    component.ticketId = 'T-1';
    component.ticket = ticket;
    component.errorMessage = 'error';
    component.successMessage = 'success';

    component.newSearch();
    component.goHome();

    expect(component.ticketId).toBe('');
    expect(component.ticket).toBeNull();
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
