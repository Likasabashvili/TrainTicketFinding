import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { Service } from '../service';
import { AuthService } from '../auth.service';
import { AuthResponse } from '../models/interfaces';

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [CommonModule, FormsModule, RouterModule],

  templateUrl: './register.html',

  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  firstName = '';

  lastName = '';

  email = '';

  phoneNumber = '';

  password = '';

  errorMessage = '';

  successMessage = '';

  isLoading = false;

  constructor(
    private service: Service,
    private authService: AuthService,
    private router: Router,
  ) {}

  register() {
    if (!this.firstName || !this.lastName || !this.email || !this.phoneNumber || !this.password) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.service
      .register({
        firstName: this.firstName,

        lastName: this.lastName,

        email: this.email,

        phoneNumber: this.phoneNumber,

        password: this.password,

        role: 'User',
      })
      .subscribe({
        next: (response: AuthResponse) => {
          this.successMessage = 'რეგისტრაცია წარმატებულია! თქვენ ავტომატურად შეხვიდით.';

          // Auto-login after registration
          this.authService.setUser(response);

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },

        error: (err: HttpErrorResponse) => {
          console.error('Registration error:', err);
          this.errorMessage =
            (typeof err.error === 'string' ? err.error : err.error?.message) ||
            'რეგისტრაცია ვერ შესრულდა';
          this.isLoading = false;
        },
      });
  }
}
