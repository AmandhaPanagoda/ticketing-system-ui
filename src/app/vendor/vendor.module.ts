import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { VendorDashboardComponent } from './pages/vendor-dashboard/vendor-dashboard/vendor-dashboard.component';
import { CreateTicketComponent } from './pages/create-ticket/create-ticket.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [VendorComponent, VendorDashboardComponent, CreateTicketComponent],
  imports: [
    CommonModule,
    VendorRoutingModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    StepsModule,
    InputNumberModule,
    TableModule,
    CardModule,
    TagModule,
    MessagesModule,
  ],
})
export class VendorModule {}
