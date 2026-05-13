import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { HeaderComponent } from './header';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: { url: string; navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    router = { url: '/', navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: Router, useValue: router }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should detect active pages', () => {
    expect(component.isHomePage()).toBe(true);
    expect(component.isTicketCheckPage()).toBe(false);

    router.url = '/ticket-check';

    expect(component.isHomePage()).toBe(false);
    expect(component.isTicketCheckPage()).toBe(true);
  });

  it('should navigate from header actions', () => {
    component.goHome();
    component.goToTicketCheck();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(router.navigate).toHaveBeenCalledWith(['/ticket-check']);
  });
});
