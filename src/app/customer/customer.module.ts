import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CustomerDashboardComponent } from './pages/customer-dashboard/customer-dashboard/customer-dashboard.component';
import { BuyTicketsComponent } from './pages/buy-tickets/buy-tickets.component';

@NgModule({
  declarations: [CustomerComponent, CustomerDashboardComponent, BuyTicketsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    InputNumberModule,
    ButtonModule,
    ProgressSpinnerModule,
    CustomerRoutingModule,
    ReactiveFormsModule,
  ],
})
export class CustomerModule {}
