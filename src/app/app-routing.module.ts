import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupCustomerComponent } from './ticketing/components/signup-customer/signup-customer.component';
import { SignupVendorComponent } from './ticketing/components/signup-vendor/signup-vendor.component';
import { LoginComponent } from './ticketing/components/login/login.component';

const routes: Routes = [
  {
    path: 'register_customer',
    component: SignupCustomerComponent,
  },
  {
    path: 'register_vendor',
    component: SignupVendorComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'vendor',
    loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule),
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
