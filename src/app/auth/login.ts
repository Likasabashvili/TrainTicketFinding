// import { Component } from '@angular/core';

// import { CommonModule } from '@angular/common';

// import { FormsModule } from '@angular/forms';

// import { Router, RouterModule } from '@angular/router';
// import { Service } from '../service';
// import { AuthResponse } from '../models/interfaces';
// import { AuthService } from '../auth.service';

// @Component({
//   selector: 'app-login',

//   standalone: true,

//   imports: [CommonModule, FormsModule, RouterModule],

//   templateUrl: './login.html',

//   styleUrls: ['./login.css'],
// })
// export class LoginComponent {
//   phoneNumber = '';

//   password = '';

//   errorMessage = '';

//   isLoading = false;

//   constructor(
//     private service: Service,
//     private authService: AuthService,
//     private router: Router,
//   ) {}

//   login() {
//     if (!this.phoneNumber || !this.password) {
//       this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';

//     this.service
//       .login({
//         phoneNumber: this.phoneNumber,

//         password: this.password,
//       })
//       .subscribe({
//         next: (response: AuthResponse) => {
//           this.authService.setUser(response);
//           this.router.navigate(['/']);
//         },

//         error: (error) => {
//           console.error('Login error:', error);
//           this.errorMessage = 'მომხმარებელი ვერ მოიძებნა ან პароლი არასწორია';
//           this.isLoading = false;
//         },
//       });
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Service } from '../service';
import { AuthService } from '../auth.service';
import { AuthResponse } from '../models/interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  phoneNumber = '';
  password = '';

  errorMessage = '';
  isLoading = false;

  constructor(
    private service: Service,
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    if (!this.phoneNumber || !this.password) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.service
      .login({
        phoneNumber: this.phoneNumber,
        password: this.password,
      })
      .subscribe({
        next: (response: AuthResponse) => {
          this.isLoading = false;

          this.authService.setUser(response);

          this.router.navigate(['/']);
        },

        error: (err) => {
          this.isLoading = false;

          console.error(err);

          this.errorMessage = err.error?.message || err.error || 'მომხმარებელი ან პაროლი არასწორია';
        },
      });
  }
}
