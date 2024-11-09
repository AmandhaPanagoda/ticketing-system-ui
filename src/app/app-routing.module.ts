import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupCustomerComponent } from './ticketing/components/signup-customer/signup-customer.component';
import { SignupVendorComponent } from './ticketing/components/signup-vendor/signup-vendor.component';
import { LoginComponent } from './ticketing/components/login/login.component';
import { SignupComponent } from './ticketing/components/signup/signup.component';

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
    path: 'register',
    component: SignupComponent,
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
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
