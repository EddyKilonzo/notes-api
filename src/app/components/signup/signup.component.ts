import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupData = { email: '', password: '', name: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    if (type === 'success') {
      this.successMessage = text;
      this.errorMessage = '';
    } else {
      this.errorMessage = text;
      this.successMessage = '';
    }
  }

  onSubmit(): void {
    if (this.signupData.email && this.signupData.password && this.signupData.name) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.signup(this.signupData).subscribe({
        next: () => {
          this.showMessage('Account created successfully! Redirecting...', 'success');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          this.showMessage(error.error?.message || 'Signup failed. Please try again.', 'error');
        }
      });
    } else {
      this.showMessage('Please fill in all fields', 'error');
    }
  }
} 