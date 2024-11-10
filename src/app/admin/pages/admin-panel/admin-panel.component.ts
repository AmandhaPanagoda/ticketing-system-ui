import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { SystemConfiguration } from '../../models/system-configuration.model';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class AdminPanelComponent implements OnInit {
  configForm: FormGroup;
  isEditing = false;
  systemRunning = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.configForm = this.fb.group({
      totalTickets: [{ value: '', disabled: true }],
      ticketReleaseRate: [{ value: '', disabled: true }, [Validators.required, Validators.min(1)]],
      customerRetrievalRate: [
        { value: '', disabled: true },
        [Validators.required, Validators.min(1)],
      ],
      maxTicketCapacity: [{ value: '', disabled: true }, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.loadSystemStatus();
    this.loadConfiguration();
  }

  loadSystemStatus() {
    this.adminService.getSystemStatus().subscribe({
      next: status => {
        this.systemRunning = status.running;
      },
      error: error => {
        console.error('Error loading system status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load system status',
        });
      },
    });
  }

  toggleSystem(event: Event) {
    const target = event.target as HTMLInputElement;
    const newStatus = target.checked;

    if (!newStatus) {
      this.confirmationService.confirm({
        message:
          'Are you sure you want to stop the system? This will:<br><br>' +
          '• Prevent new tickets from being added<br>' +
          '• Stop all ongoing ticket purchases<br>' +
          '• Halt all vendor operations<br><br>' +
          'Please ensure all critical operations are completed before stopping the system.',
        accept: () => {
          this.updateSystemStatus(newStatus, target);
        },
        reject: () => {
          target.checked = !newStatus;
        },
      });
    } else {
      this.updateSystemStatus(newStatus, target);
    }
  }

  private updateSystemStatus(newStatus: boolean, target: HTMLInputElement) {
    this.adminService.updateSystemStatus(newStatus).subscribe({
      next: response => {
        this.systemRunning = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response,
        });
      },
      error: error => {
        target.checked = !newStatus;
        this.systemRunning = !newStatus;
        console.error('Error updating system status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error || 'Failed to update system status',
        });
      },
    });
  }

  loadConfiguration() {
    this.adminService.getSystemConfiguration().subscribe({
      next: config => {
        this.configForm.patchValue(config);
      },
      error: error => {
        console.error('Error loading configuration:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load system configuration',
        });
      },
    });
  }

  onSubmit() {
    if (this.configForm.valid) {
      const formData = this.configForm.getRawValue();

      this.adminService.updateSystemConfiguration(formData).subscribe({
        next: response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });

          this.isEditing = false;
          this.configForm.disable();
          this.loadConfiguration();
        },
        error: error => {
          console.error('Error updating configuration:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update system configuration',
          });
        },
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.configForm.get('ticketReleaseRate')?.enable();
      this.configForm.get('customerRetrievalRate')?.enable();
      this.configForm.get('maxTicketCapacity')?.enable();
    } else {
      this.configForm.disable();
    }
  }
}
