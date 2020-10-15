import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { 
  AuthGuardService as AuthGuard 
} from '../../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: ':orderID',
    component: PaymentComponent,
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }