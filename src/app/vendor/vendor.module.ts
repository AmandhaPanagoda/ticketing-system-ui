import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { VendorDashboardComponent } from './pages/vendor-dashboard/vendor-dashboard/vendor-dashboard.component';
import { CreateTicketComponent } from './pages/create-ticket/create-ticket.component';

@NgModule({
  declarations: [VendorComponent, VendorDashboardComponent, CreateTicketComponent],
  imports: [CommonModule, VendorRoutingModule, ReactiveFormsModule],
})
export class VendorModule {}
