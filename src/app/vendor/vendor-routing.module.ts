import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor.component';
import { VendorDashboardComponent } from './pages/vendor-dashboard/vendor-dashboard/vendor-dashboard.component';
import { CreateTicketComponent } from './pages/create-ticket/create-ticket.component';

const routes: Routes = [
  { path: '', component: VendorComponent },
  { path: 'dashboard', component: VendorDashboardComponent },
  { path: 'ticket', component: CreateTicketComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRoutingModule {}
