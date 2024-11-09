import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { TransactionLogComponent } from './pages/transaction-log/transaction-log.component';
import { AdminWebsocketService } from './services/admin-websocket.service';

@NgModule({
  declarations: [AdminComponent, TransactionLogComponent],
  imports: [CommonModule, AdminRoutingModule, NgChartsModule],
  providers: [AdminWebsocketService],
})
export class AdminModule {}
