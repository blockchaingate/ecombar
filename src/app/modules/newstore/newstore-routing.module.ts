import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NewstoreComponent } from './newstore.component';

const routes: Routes = [
  {
    path: '',
    component: NewstoreComponent,
    children: [
   
    ]
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StoresRoutingModule { }
