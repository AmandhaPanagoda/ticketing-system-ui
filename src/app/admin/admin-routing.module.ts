import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { TransactionLogComponent } from './pages/transaction-log/transaction-log.component';
import { AdminComponent } from './admin.component';
import { SystemLogComponent } from './pages/system-log/system-log.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'system-configuration',
    component: AdminPanelComponent,
  },
  {
    path: 'transactions',
    component: TransactionLogComponent,
  },
  {
    path: 'system-logs',
    component: SystemLogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
