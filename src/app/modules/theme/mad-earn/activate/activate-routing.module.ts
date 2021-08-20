import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateComponent } from './activate.component';

const routes: Routes = [
  {
    path: ':userId/:activationCode/:appId',
    component: ActivateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivateRoutingModule { }

//userId + "/" + activationCode + "/" + app._id