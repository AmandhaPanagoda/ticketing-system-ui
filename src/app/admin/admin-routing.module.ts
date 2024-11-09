import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { TransactionLogComponent } from './pages/transaction-log/transaction-log.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  {
    path: 'transactions',
    component: TransactionLogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
