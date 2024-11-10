import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { SystemConfiguration } from '../../models/system-configuration.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  providers: [MessageService],
})
export class AdminPanelComponent implements OnInit {
  configForm: FormGroup;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService
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
    this.loadConfiguration();
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
