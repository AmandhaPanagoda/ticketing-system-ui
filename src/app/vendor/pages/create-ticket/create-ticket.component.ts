import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VendorService } from '../../services/vendor.service';
import { UserStorageService } from '../../../ticketing/services/storage/user-storage.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss',
})
export class CreateTicketComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });

    console.log('Token:', UserStorageService.getToken());
    console.log('UserId:', UserStorageService.getUserId());
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  addTicket() {
    if (this.validateForm.invalid) {
      return;
    }

    const formData: FormData = new FormData();

    formData.append('title', this.validateForm.get('title')?.value);
    formData.append('description', this.validateForm.get('description')?.value);
    formData.append('price', this.validateForm.get('price')?.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.vendorService.addTicket(formData).subscribe({
      next: res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Ticket created successfully',
        });
        this.router.navigate(['/vendor/tickets']);
      },
      error: err => {
        const errorMessage = err.error?.message || 'An error occurred while creating the ticket';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      },
    });
  }
}
