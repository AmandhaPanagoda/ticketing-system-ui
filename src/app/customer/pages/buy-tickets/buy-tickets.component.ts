import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface PoolStatus {
  currentTicketCount: number;
  isFull?: boolean;
  isEmpty?: boolean;
}

@Component({
  selector: 'app-buy-tickets',
  templateUrl: './buy-tickets.component.html',
  styleUrl: './buy-tickets.component.scss',
  providers: [MessageService],
})
export class BuyTicketsComponent implements OnInit {
  ticketForm: FormGroup;
  poolStatus?: PoolStatus;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private messageService: MessageService
  ) {
    this.ticketForm = this.fb.group({
      ticketCount: ['1', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.refreshPoolStatus();
  }

  refreshPoolStatus() {
    this.customerService.getPoolStatus().subscribe({
      next: status => {
        this.poolStatus = status;
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch ticket availability',
        });
      },
    });
  }

  buyTickets() {
    if (this.ticketForm.valid) {
      this.loading = true;
      const ticketCount = this.ticketForm.get('ticketCount')?.value;

      this.customerService.buyTickets(ticketCount).subscribe({
        next: response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail:
              typeof response === 'string'
                ? response
                : 'Ticket purchase request submitted successfully',
          });
          this.refreshPoolStatus();
          this.ticketForm.reset({ ticketCount: 1 });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || error?.message || 'Failed to purchase tickets',
          });
          this.refreshPoolStatus();
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
