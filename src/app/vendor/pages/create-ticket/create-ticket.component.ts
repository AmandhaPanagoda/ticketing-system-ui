import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VendorService } from '../../services/vendor.service';
import { UserStorageService } from '../../../ticketing/services/storage/user-storage.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss',
})
export class CreateTicketComponent implements OnInit {
  ticketForm: FormGroup;
  poolStatus: any = { currentTicketCount: 0 };
  loading = false;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private messageService: MessageService
  ) {
    this.ticketForm = this.fb.group({
      ticketCount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.refreshPoolStatus();
  }

  refreshPoolStatus() {
    this.vendorService.getPoolStatus().subscribe({
      next: status => {
        this.poolStatus = status;
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch pool status',
        });
      },
    });
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      this.loading = true;
      const ticketCount = this.ticketForm.get('ticketCount')?.value;

      this.vendorService.addTickets(ticketCount).subscribe({
        next: response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: typeof response === 'string' ? response : 'Tickets release request processed',
          });
          this.refreshPoolStatus();
          this.ticketForm.reset();
          this.loading = false;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || error?.message || 'Failed to release tickets',
          });
          this.loading = false;
          this.refreshPoolStatus();
          this.ticketForm.reset();
        },
      });
    }
  }
}
