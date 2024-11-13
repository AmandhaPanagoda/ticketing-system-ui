import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { CustomerDashboardComponent } from './pages/customer-dashboard/customer-dashboard/customer-dashboard.component';
import { BuyTicketsComponent } from './pages/buy-tickets/buy-tickets.component';

const routes: Routes = [
  { path: '', component: CustomerComponent },
  { path: 'dashboard', component: CustomerDashboardComponent },
  { path: 'buy-tickets', component: BuyTicketsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
