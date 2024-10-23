import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './ticketing/components/login/login.component';
import { SignupComponent } from './ticketing/components/signup/signup.component';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { SignupCustomerComponent } from './ticketing/components/signup-customer/signup-customer.component';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [AppComponent, LoginComponent, SignupComponent, SignupCustomerComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    // PrimeNG modules
    ButtonModule,
    ReactiveFormsModule,
    MenubarModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
