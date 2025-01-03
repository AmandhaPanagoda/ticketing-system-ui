import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoolStatusService } from '../../../ticketing/services/pool/pool-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buy-tickets',
  templateUrl: './buy-tickets.component.html',
  styleUrl: './buy-tickets.component.scss',
  providers: [MessageService],
})
export class BuyTicketsComponent implements OnInit, OnDestroy {
  ticketForm: FormGroup;
  poolStatus: any = { currentTicketCount: 0 };
  loading = false;
  private subscription?: Subscription;
  ticketSummaries: any[] = [];
  refreshing = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private poolStatusService: PoolStatusService,
    private messageService: MessageService
  ) {
    this.ticketForm = this.fb.group({
      ticketCount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.loadInitialPoolStatus();
    this.subscribeToPoolUpdates();
    this.loadTicketSummaries();
  }

  loadInitialPoolStatus() {
    this.customerService.getPoolStatus().subscribe({
      next: status => {
        if (status) {
          this.poolStatus = status;
        }
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load initial pool status',
        });
      },
    });
  }

  loadTicketSummaries() {
    this.refreshing = true;
    this.customerService.getTicketSummaries().subscribe({
      next: summaries => {
        this.ticketSummaries = summaries;
        this.refreshing = false;
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load ticket summaries',
        });
        this.refreshing = false;
      },
    });
  }

  private subscribeToPoolUpdates() {
    this.subscription = this.poolStatusService.getPoolStatus().subscribe({
      next: status => {
        if (status) {
          this.poolStatus = status;
        }
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get pool status updates',
        });
      },
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  buyTickets() {
    if (this.ticketForm.valid) {
      this.loading = true;
      const ticketCount = this.ticketForm.get('ticketCount')?.value;

      // Validate against current pool status
      if (this.poolStatus && ticketCount > this.poolStatus.currentTicketCount) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Not enough tickets available',
        });
        this.loading = false;
        return;
      }

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
          this.ticketForm.reset({ ticketCount: 1 });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || error?.message || 'Failed to purchase tickets',
          });
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
