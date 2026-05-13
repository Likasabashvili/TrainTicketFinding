import { Routes } from '@angular/router';
import { Home } from './home/home';
import { TrainRoutesComponent } from './train-routes/train-routes';
import { PassengerInfoComponent } from './passenger-info/passenger-info';
import { PaymentComponent } from './payment/payment';
import { TicketCheckComponent } from './ticket-check/ticket-check';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'trains',
    component: TrainRoutesComponent,
  },
  {
    path: 'passenger-info',
    component: PassengerInfoComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'ticket-check',
    component: TicketCheckComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
