import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
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
      password: [null, [Validators.required]],
    });
  }

  submitForm() {
    this.authService
      .login(this.validateForm.get('username')!.value, this.validateForm.get('password')!.value)
      .subscribe({
        next: res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login successful',
            life: 3000,
          });
          if (UserStorageService.isCustomerLoggedIn()) {
            this.router.navigateByUrl('customer/dashboard');
          } else if (UserStorageService.isVendorLoggedIn()) {
            this.router.navigateByUrl('vendor/dashboard');
          } else if (UserStorageService.isAdminLoggedIn()) {
            this.router.navigateByUrl('admin/transactions');
          }
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error || 'An unexpected error occurred',
            life: 3000,
          });
          console.error('Login error:', error);
        },
      });
  }
}
