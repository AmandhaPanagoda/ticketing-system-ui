import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { TransactionLogComponent } from './pages/transaction-log/transaction-log.component';
import { AdminWebsocketService } from './services/admin-websocket.service';
import { NgChartsModule } from 'ng2-charts';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SystemLogComponent } from './pages/system-log/system-log.component';

@NgModule({
  declarations: [AdminComponent, AdminPanelComponent, TransactionLogComponent, SystemLogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    NgChartsModule,
    ToastModule,
    TooltipModule,
    ConfirmDialogModule,
    TableModule,
    TagModule,
  ],
  providers: [AdminWebsocketService, MessageService, ConfirmationService],
})
export class AdminModule {}
