import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';

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
          this.router.navigate(['/']);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid credentials. Please try again.',
            life: 3000,
          });
          console.error('Login error:', error);
        },
      });
  }
}
