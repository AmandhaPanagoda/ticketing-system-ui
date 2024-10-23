import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup-customer',
  templateUrl: './signup-customer.component.html',
  styleUrl: './signup-customer.component.scss',
})
export class SignupCustomerComponent {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      phoneNumber: [null],
      firstName: [null],
      lastName: [null],
    });
  }

  submitForm(): void {
    this.authService.registerCustomer(this.validateForm.value).subscribe({
      next: res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User registered successfully',
          life: 3000,
        });
        this.router.navigate(['/login']);
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Registration failed. Please try again.',
          life: 3000,
        });
        console.error('Registration error:', error);
      },
    });
  }
}