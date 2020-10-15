import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaceOrderComponent } from './place-order.component';
import { 
  AuthGuardService as AuthGuard 
} from '../../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: ':orderID',
    component: PlaceOrderComponent,
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaceOrderRoutingModule { }