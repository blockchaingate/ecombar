import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PwdRecoverComponent} from './pages/recover/pwd-recover.component';
import { ActivationComponent } from './pages/activation/activation.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'signup', component: SignupComponent },
      { path: 'signin', component: SigninComponent },
      { path: 'confirm-email', component: ActivationComponent },
      { path: 'pwd-recover', component: PwdRecoverComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }