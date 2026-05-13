import { routes } from './app.routes';
import { Home } from './home/home';
import { PassengerInfoComponent } from './passenger-info/passenger-info';
import { PaymentComponent } from './payment/payment';
import { TicketCheckComponent } from './ticket-check/ticket-check';
import { TrainRoutesComponent } from './train-routes/train-routes';

describe('routes', () => {
  it('should map application paths to their components', () => {
    expect(routes).toContainEqual({ path: '', component: Home });
    expect(routes).toContainEqual({ path: 'trains', component: TrainRoutesComponent });
    expect(routes).toContainEqual({ path: 'passenger-info', component: PassengerInfoComponent });
    expect(routes).toContainEqual({ path: 'payment', component: PaymentComponent });
    expect(routes).toContainEqual({ path: 'ticket-check', component: TicketCheckComponent });
    expect(routes).toContainEqual({ path: '**', redirectTo: '' });
  });
});
