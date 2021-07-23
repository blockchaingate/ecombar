import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './cart.component';
import { 
  AuthGuardService as AuthGuard 
} from '../../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }