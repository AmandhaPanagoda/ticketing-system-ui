import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VendorService } from '../../services/vendor.service';
import { Subscription } from 'rxjs';
import {
  PoolStatusService,
  PoolStatus,
} from '../../../ticketing/services/pool/pool-status.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss',
})
export class CreateTicketComponent implements OnInit, OnDestroy {
  ticketForm: FormGroup;
  poolStatus: any = { currentTicketCount: 0 };
  loading = false;
  private subscription?: Subscription;
  ticketSummaries: any[] = [];
  refreshing = false;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
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
    this.vendorService.getPoolStatus().subscribe({
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

  loadTicketSummaries() {
    this.refreshing = true;
    this.vendorService.getTicketSummaries().subscribe({
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
          this.ticketForm.reset();
          this.loading = false;
          this.loadTicketSummaries();
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || error?.message || 'Failed to release tickets',
          });
          this.loading = false;
          this.ticketForm.reset();
        },
      });
    }
  }
}
